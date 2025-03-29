import { Context } from "hono";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import loops from "@/config/loops";
import clerkClient from "@/config/clerk";

import Drive from "../../../models/Drive";
import Institute from "../../../models/Institute";
import CandidateModel from "../../../models/Candidate";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { Role } from "@shared-types/Institute";
import { Assessment, Assignment } from "@shared-types/Drive";

const REGION = "ap-south-1";

const advanceWorkflow = async (c: Context) => {
  try {
    const { _id } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findById(_id).populate("candidates");
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    const workflow = drive?.workflow;
    if (!workflow) {
      return sendError(c, 400, "No workflow found");
    }

    if (workflow.steps.length === 0) {
      return sendError(c, 400, "No workflow steps found");
    }

    // Find current incomplete step
    const currentStepIndex = workflow.steps.findIndex(
      (step) => !step.completed
    );
    if (currentStepIndex === -1) {
      return sendError(c, 400, "Workflow already completed");
    }

    // Mark current step as completed
    workflow.steps[currentStepIndex].completed = true;
    workflow.steps[currentStepIndex].timestamp = new Date();

    // Process based on step type
    const currentStep = workflow.steps[currentStepIndex];

    if (currentStep.type === "RESUME_SCREENING") {
      await handleResumeScreening(drive);
    }

    if (currentStep.type === "ASSIGNMENT") {
      await handleAssignmentRound(drive, currentStep);
    }

    if (
      currentStep.type === "CODING_ASSESSMENT" ||
      currentStep.type === "MCQ_ASSESSMENT"
    ) {
      await handleAssessmentRound(drive, currentStep);
    }

    // Update candidate statuses
    for (const candidateId of drive.candidates) {
      const candidate = await CandidateModel.findById(candidateId);
      if (!candidate) continue;

      const appliedDrive = candidate.appliedDrives.find(
        (ad) => ad.toString() === drive._id.toString()
      );

      if (!appliedDrive) continue;

      await CandidateModel.findByIdAndUpdate(
        candidateId,
        {
          $set: {
            "appliedDrives.$[drive].status": "inprogress",
            "appliedDrives.$[drive].currentStepStatus": "pending",
          },
        },
        {
          arrayFilters: [{ "drive._id": appliedDrive._id }],
        }
      );
    }

    await drive.save();

    // Create audit log and notifications
    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const institute = await Institute.findById(
      perms.data!.institute?._id
    );

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    // Add audit log
    institute.auditLogs.push({
      action: `Advanced workflow for ${drive.title} to next step`,
      user: `${clerkUser.firstName} ${clerkUser.lastName}`,
      userId: clerkUser.id,
      type: "info",
    });

    // Create notification for members with manage_drive permission
    const notification = {
      title: "Workflow Advanced",
      description: `Workflow for ${drive.title} has been advanced to the next step`,
      date: new Date(),
      read: false,
    };

    institute.members.forEach((member) => {
      const memberRole = institute.roles.find(
        (role: any) => role.slug === member.role
      ) as Role | undefined;

      if (memberRole && memberRole.permissions.includes("manage_drive")) {
        member.notifications.push(notification);
      }
    });

    await institute.save();

    return sendSuccess(c, 200, "Workflow advanced successfully", drive);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const handleResumeScreening = async (drive: any) => {
  const lambdaClient = new LambdaClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_LAMBDA_SECRET_ACCESS_KEY!,
    },
  });

  const resumes = [];

  for (const candidateId of drive.candidates) {
    const candidate = await CandidateModel.findById(candidateId);
    if (!candidate) continue;

    const appliedDrive = candidate.appliedDrives.find(
      (ad) => ad.toString() === drive._id.toString()
    );

    if (!appliedDrive) continue;

    resumes.push({
      candidateId: candidate._id.toString(),
      resume: candidate.resumeExtract,
    });
  }

  const event = {
    driveDescription: drive.description,
    skills: drive.skills?.join(","),
    negativePrompts: drive.ats?.negativePrompts?.join(","),
    positivePrompts: drive.ats?.positivePrompts?.join(","),
    driveId: drive._id.toString(),
    resumes,
  };

  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: "resume-screener",
      Payload: JSON.stringify(event),
    })
  );
};

const handleAssignmentRound = async (drive: any, step: any) => {
  const assignment = drive.assignments?.find(
    (a: Assignment) => a.name === step.name
  );
  const institute = await Institute.findById(drive.instituteId);

  if (!assignment || !institute) return;

  const candidates = await CandidateModel.find({
    _id: { $in: drive.candidates },
    appliedDrives: {
      $elemMatch: {
        status: { $ne: "rejected" },
      },
    },
  });

  for (const candidate of candidates) {
    await loops.sendTransactionalEmail({
      transactionalId: "cm0zk1vd900966e8e6czepc4d",
      email: candidate.email as string,
      dataVariables: {
        name: candidate.name as string,
        driveName: drive.title,
        institute: institute.name,
        assignmentLink: `${process.env.ENTERPRISE_FRONTEND_URL}/drives/${drive.url}/assignments/${assignment._id}`,
      },
    });
  }
};

const handleAssessmentRound = async (drive: any, step: any) => {
  const assessment =
    drive.mcqAssessments?.find(
      (a: Assessment) => a.workflowId.toString() === step._id.toString()
    ) ||
    drive.codeAssessments?.find(
      (a: Assessment) => a.workflowId.toString() === step._id.toString()
    );

  const institute = await Institute.findById(drive.instituteId);
  if (!assessment || !institute) return;

  const candidates = await CandidateModel.find({
    _id: { $in: drive.candidates },
    appliedDrives: {
      $elemMatch: {
        status: { $ne: "rejected" },
      },
    },
  });

  const assessmentType = step.type === "CODING_ASSESSMENT" ? "Coding" : "MCQ";

  for (const candidate of candidates) {
    await loops.sendTransactionalEmail({
      transactionalId: "cm16lbamn012iyfq0agp9wl54",
      email: candidate.email as string,
      dataVariables: {
        name: candidate.name as string,
        driveName: drive.title,
        type: assessmentType,
        assessmentLink: `${process.env.SCRIPTOPIA_FRONTEND_URL}/assessments/${assessment.assessmentId}`,
        institute: institute.name,
      },
    });
  }
};

export default {
  advanceWorkflow,
};