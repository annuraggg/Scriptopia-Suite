import { Context } from "hono";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import loops from "@/config/loops";
import clerkClient from "@/config/clerk";

import Posting from "../../../models/Posting";
import Organization from "../../../models/Organization";
import CandidateModel from "../../../models/Candidate";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import checkPermission from "../../../middlewares/checkOrganizationPermission";
import { Role } from "@shared-types/Organization";
import { Assessment, Assignment } from "@shared-types/Posting";

const REGION = "ap-south-1";

const advanceWorkflow = async (c: Context) => {
  try {
    const { _id } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(_id).populate("candidates");
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const workflow = posting?.workflow;
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
      await handleResumeScreening(posting);
    }

    if (currentStep.type === "ASSIGNMENT") {
      await handleAssignmentRound(posting, currentStep);
    }

    if (
      currentStep.type === "CODING_ASSESSMENT" ||
      currentStep.type === "MCQ_ASSESSMENT"
    ) {
      await handleAssessmentRound(posting, currentStep);
    }

    // Update candidate statuses
    for (const candidateId of posting.candidates) {
      const candidate = await CandidateModel.findById(candidateId);
      if (!candidate) continue;

      const appliedPosting = candidate.appliedPostings.find(
        (ap) => ap.toString() === posting._id.toString()
      );

      if (!appliedPosting) continue;

      // Update the applied posting status based on current workflow step
      await CandidateModel.findByIdAndUpdate(
        candidateId,
        {
          $set: {
            "appliedPostings.$[posting].status": "inprogress",
            "appliedPostings.$[posting].currentStepStatus": "pending",
          },
        },
        {
          arrayFilters: [{ "posting._id": appliedPosting._id }],
        }
      );
    }

    await posting.save();

    // Create audit log and notifications
    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const organization = await Organization.findById(
      perms.data!.organization?._id
    );

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    // Add audit log
    organization.auditLogs.push({
      action: `Advanced workflow for ${posting.title} to next step`,
      user: `${clerkUser.firstName} ${clerkUser.lastName}`,
      userId: clerkUser.id,
      type: "info",
    });

    // Create notification for members with manage_job permission
    const notification = {
      title: "Workflow Advanced",
      description: `Workflow for ${posting.title} has been advanced to the next step`,
      date: new Date(),
      read: false,
    };

    organization.members.forEach((member) => {
      const memberRole = organization.roles.find(
        (role: any) => role.slug === member.role
      ) as Role | undefined;

      if (memberRole && memberRole.permissions.includes("manage_job")) {
        member.notifications.push(notification);
      }

      if (memberRole?.permissions.includes("manage_job")) {
        member.notifications.push(notification);
      }
    });

    await organization.save();

    return sendSuccess(c, 200, "Workflow advanced successfully", posting);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const handleResumeScreening = async (posting: any) => {
  const lambdaClient = new LambdaClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_LAMBDA_SECRET_ACCESS_KEY!,
    },
  });

  const resumes = [];

  for (const candidateId of posting.candidates) {
    const candidate = await CandidateModel.findById(candidateId);
    if (!candidate) continue;

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.toString() === posting._id.toString()
    );

    if (!appliedPosting) continue;

    resumes.push({
      candidateId: candidate._id.toString(),
      resume: candidate.resumeExtract,
    });
  }

  const event = {
    jobDescription: posting.description,
    skills: posting.skills?.join(","),
    negativePrompts: posting.ats?.negativePrompts?.join(","),
    positivePrompts: posting.ats?.positivePrompts?.join(","),
    postingId: posting._id.toString(),
    resumes,
  };

  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: "resume-screener",
      Payload: JSON.stringify(event),
    })
  );
};

const handleAssignmentRound = async (posting: any, step: any) => {
  const assignment = posting.assignments?.find(
    (a: Assignment) => a.name === step.name
  );
  const organization = await Organization.findById(posting.organizationId);

  if (!assignment || !organization) return;

  const candidates = await CandidateModel.find({
    _id: { $in: posting.candidates },
    appliedPostings: {
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
        postingName: posting.title,
        company: organization.name,
        assignmentLink: `${process.env.ENTERPRISE_FRONTEND_URL}/postings/${posting.url}/assignments/${assignment._id}`,
      },
    });
  }
};

const handleAssessmentRound = async (posting: any, step: any) => {
  const assessment =
    posting.mcqAssessments?.find(
      (a: Assessment) => a.workflowId.toString() === step._id.toString()
    ) ||
    posting.codeAssessments?.find(
      (a: Assessment) => a.workflowId.toString() === step._id.toString()
    );

  const organization = await Organization.findById(posting.organizationId);
  if (!assessment || !organization) return;

  const candidates = await CandidateModel.find({
    _id: { $in: posting.candidates },
    appliedPostings: {
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
        postingName: posting.title,
        type: assessmentType,
        assessmentLink: `${process.env.SCRIPTOPIA_FRONTEND_URL}/assessments/${assessment.assessmentId}`,
        company: organization.name,
      },
    });
  }
};

export default {
  advanceWorkflow,
};
