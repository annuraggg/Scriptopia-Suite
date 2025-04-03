import { Context } from "hono";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import loops from "@/config/loops";
import clerkClient from "@/config/clerk";

import Drive from "../../../models/Drive";
import Institute from "../../../models/Institute";
import CandidateModel from "../../../models/Candidate";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { Assessment, Assignment } from "@shared-types/Drive";
import User from "@/models/User";
import Meet from "@/models/Meet";

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
    if (!workflow || workflow.steps.length === 0) {
      return sendError(c, 400, "Invalid workflow");
    }

    const currentStepIndex = workflow.steps.findIndex(
      (step) => step.status === "in-progress"
    );

    if (
      currentStepIndex === -1 &&
      workflow.steps.every((step) => step.status === "completed")
    ) {
      return sendError(c, 400, "Workflow already completed");
    }

    if (currentStepIndex === -1) {
      workflow.steps[0].status = "in-progress";
      workflow.steps[0].schedule = {
        ...workflow.steps[0].schedule,
      };
      workflow.steps[0].startedBy = c.get("auth")._id;
    } else {
      workflow.steps[currentStepIndex].status = "completed";
      workflow.steps[currentStepIndex + 1].status = "in-progress";
      workflow.steps[currentStepIndex].schedule = {
        ...workflow.steps[currentStepIndex].schedule,
        actualCompletionTime: new Date(),
      };
      workflow.steps[0].startedBy = c.get("auth")._id;
    }

    const currentStep =
      workflow.steps[currentStepIndex === -1 ? 0 : currentStepIndex + 1];

    switch (currentStep.type) {
      case "RESUME_SCREENING":
        handleResumeScreening(drive, perms.data!.institute?._id);
        break;
      case "ASSIGNMENT":
        handleAssignmentRound(drive, currentStep);
        break;
      case "CODING_ASSESSMENT":
      case "MCQ_ASSESSMENT":
        handleAssessmentRound(drive, currentStep);
        break;
      case "INTERVIEW":
        handleInterviewRound(drive, currentStep);
        break;
    }

    console.log("Workflow advanced to next step", currentStep.type);

    await drive.save();
    await logWorkflowAdvance(c, drive, perms);

    const updatedDrive = await Drive.findById(_id)
      .populate("candidates")
      .populate("institute");
    return sendSuccess(
      c,
      200,
      "Workflow advanced successfully",
      updatedDrive
    );
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const handleResumeScreening = async (drive: any, orgId?: string) => {
  await Drive.findByIdAndUpdate(drive._id, {
    "ats.status": "processing",
  });

  const lambdaClient = new LambdaClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_LAMBDA_SECRET_ACCESS_KEY!,
    },
  });

  const resumes = await Promise.all(
    drive.candidates.map(async (candidateId: string) => {
      const candidate = await CandidateModel.findById(candidateId);
      if (!candidate) return null;
      return candidate
        ? {
            candidateId: candidate._id.toString(),
            resume: candidate.resumeExtract,
          }
        : null;
    })
  );

  const org = await Institute.findById(orgId).populate("members.user");
  const step = drive.workflow.steps.find(
    (step: any) => step.type === "RESUME_SCREENING"
  );
  const user = org?.members.find(
    (member: any) => member.user._id.toString() === step?.startedBy.toString()
  );
  const dbUser = await User.findById(user?.user);
  if (!dbUser) return;
  const clerkUser = await clerkClient.users.getUser(dbUser?.clerkId);

  const event = {
    driveDescription: drive.description,
    skills: drive.skills?.join(","),
    negativePrompts: drive.ats?.negativePrompts?.join(","),
    positivePrompts: drive.ats?.positivePrompts?.join(","),
    driveId: drive._id.toString(),
    resumes: resumes.filter(Boolean),
    mailData: {
      name: clerkUser.firstName + " " + clerkUser.lastName,
      email: user?.email,
      drive: drive.title,
      resumeScreenUrl: `${process.env.ENTERPRISE_FRONTEND_URL}/drives/${drive.url}/ats`,
    },
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
  const institute = await Institute.findById(drive.institute);

  if (!assignment || !institute) return;

  const candidates = await CandidateModel.find({
    _id: { $in: drive.candidates },
    "appliedDrives.status": { $ne: "rejected" },
  });

  await Promise.all(
    candidates.map((candidate) =>
      loops.sendTransactionalEmail({
        transactionalId: "cm0zk1vd900966e8e6czepc4d",
        email: candidate.email,
        dataVariables: {
          name: candidate.name,
          driveName: drive.title,
          company: institute.name,
          assignmentLink: `${process.env.CANDIDATE_FRONTEND_URL}/drives/${drive._id}/assignments/${assignment._id}`,
        },
      })
    )
  );
};

const handleAssessmentRound = async (drive: any, step: any) => {
  console.log("Detected assessment round");
  const assessment =
    drive.mcqAssessments?.find(
      (a: Assessment) => a.workflowId.toString() === step._id.toString()
    ) ||
    drive.codeAssessments?.find(
      (a: Assessment) => a.workflowId.toString() === step._id.toString()
    );
  const institute = await Institute.findById(drive.institute);
  if (!assessment || !institute) return;

  const candidates = await CandidateModel.find({
    _id: { $in: drive.candidates },
    "appliedDrives.status": { $ne: "rejected" },
  });

  const assessmentType = step.type === "CODING_ASSESSMENT" ? "Coding" : "MCQ";
  const type = step.type === "CODING_ASSESSMENT" ? "c" : "m";

  console.log("Sending assessment emails");
  await Promise.all(
    candidates.map((candidate) =>
      loops.sendTransactionalEmail({
        transactionalId: "cm16lbamn012iyfq0agp9wl54",
        email: candidate.email,
        dataVariables: {
          name: candidate.name,
          postingName: drive.title,
          type: assessmentType,
          assessmentLink: `${process.env.SCRIPTOPIA_FRONTEND_URL}/assessments/${type}/${assessment.assessmentId}`,
          company: institute.name,
        },
      })
    )
  );
};

const handleInterviewRound = async (drive: any, step: any) => {
  console.log("Detected interview round");
  const institute = await Institute.findById(drive.institute);
  if (!institute) return;

  const candidates = await CandidateModel.find({
    _id: { $in: drive.candidates },
    "appliedDrives.status": { $ne: "rejected" },
  });

  const workflowStepId = drive.workflow.steps.find(
    (s: any) => s._id.toString() === step._id.toString()
  )._id;

  const interviewId = drive.interviews.find(
    (interview: any) =>
      interview.workflowId.toString() === workflowStepId.toString()
  ).interview;

  console.log("Interview ID", interviewId);

  if (!interviewId) return;

  const interview = await Meet.findById(interviewId);
  if (!interview) return;

  await Promise.all(
    candidates.map((candidate) => {
      loops.sendTransactionalEmail({
        transactionalId: "cm84on6wm06v3e9gl6a2hm0j8",
        email: candidate.email,
        dataVariables: {
          name: candidate.name,
          driveName: drive.title,
          interviewLink: `${process.env.MEET_FRONTEND_URL}/v3/${interview.code}`,
          company: institute.name,
        },
      });

      interview.candidates.push(candidate._id);
    })
  );

  const interviewer = institute.members.find(
    (member: any) => member.role === "hiring_manager"
  );

  if (interviewer && interviewer.user) {
    interview.interviewers.push(interviewer?.user);
  }

  await interview.save();
};

const logWorkflowAdvance = async (c: Context, drive: any, perms: any) => {
  const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
  const institute = await Institute.findById(
    perms.data!.institute?._id
  );
  if (!institute) return;

  institute.auditLogs.push({
    action: `Advanced workflow for ${drive.title} to next step`,
    user: `${clerkUser.firstName} ${clerkUser.lastName}`,
    userId: clerkUser.id,
    type: "info",
  });

  const notification = {
    title: "Workflow Advanced",
    description: `Workflow for ${drive.title} has been advanced to the next step`,
    date: new Date(),
    read: false,
  };

  institute.members.forEach((member) => {
    if (
      member.role &&
      institute.roles.some(
        (r: any) =>
          r.slug === member.role && r.permissions.includes("manage_drive")
      )
    ) {
      member.notifications.push(notification);
    }
  });

  await institute.save();
};

export default { advanceWorkflow };
