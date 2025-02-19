import { Context } from "hono";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import loops from "@/config/loops";
import clerkClient from "@/config/clerk";

import Posting from "../../../models/Posting";
import Organization from "../../../models/Organization";
import CandidateModel from "../../../models/Candidate";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import checkPermission from "../../../middlewares/checkOrganizationPermission";
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
    if (!workflow || workflow.steps.length === 0) {
      return sendError(c, 400, "Invalid workflow");
    }

    const currentStepIndex = workflow.steps.findIndex(
      (step) => step.status === "in_progress"
    );

    if (currentStepIndex === -1) {
      return sendError(c, 400, "Workflow already completed");
    }

    workflow.steps[currentStepIndex].status = "completed";
    workflow.steps[currentStepIndex].schedule = {
      ...workflow.steps[currentStepIndex].schedule,
      actualCompletionTime: new Date(),
    };

    const currentStep = workflow.steps[currentStepIndex];

    switch (currentStep.type) {
      case "RESUME_SCREENING":
        await handleResumeScreening(posting);
        break;
      case "ASSIGNMENT":
        await handleAssignmentRound(posting, currentStep);
        break;
      case "CODING_ASSESSMENT":
      case "MCQ_ASSESSMENT":
        await handleAssessmentRound(posting, currentStep);
        break;
    }

    await posting.save();
    await logWorkflowAdvance(c, posting, perms);

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

  const resumes = await Promise.all(
    posting.candidates.map(async (candidateId: string) => {
      const candidate = await CandidateModel.findById(candidateId);
      return candidate
        ? {
            candidateId: candidate._id.toString(),
            resume: candidate.resumeExtract,
          }
        : null;
    })
  );

  const event = {
    jobDescription: posting.description,
    skills: posting.skills?.join(","),
    negativePrompts: posting.ats?.negativePrompts?.join(","),
    positivePrompts: posting.ats?.positivePrompts?.join(","),
    postingId: posting._id.toString(),
    resumes: resumes.filter(Boolean),
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
    "appliedPostings.status": { $ne: "rejected" },
  });

  await Promise.all(
    candidates.map((candidate) =>
      loops.sendTransactionalEmail({
        transactionalId: "cm0zk1vd900966e8e6czepc4d",
        email: candidate.email,
        dataVariables: {
          name: candidate.name,
          postingName: posting.title,
          company: organization.name,
          assignmentLink: `${process.env.ENTERPRISE_FRONTEND_URL}/postings/${posting.url}/assignments/${assignment._id}`,
        },
      })
    )
  );
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
    "appliedPostings.status": { $ne: "rejected" },
  });

  const assessmentType = step.type === "CODING_ASSESSMENT" ? "Coding" : "MCQ";

  await Promise.all(
    candidates.map((candidate) =>
      loops.sendTransactionalEmail({
        transactionalId: "cm16lbamn012iyfq0agp9wl54",
        email: candidate.email,
        dataVariables: {
          name: candidate.name,
          postingName: posting.title,
          type: assessmentType,
          assessmentLink: `${process.env.SCRIPTOPIA_FRONTEND_URL}/assessments/${assessment.assessmentId}`,
          company: organization.name,
        },
      })
    )
  );
};

const logWorkflowAdvance = async (c: Context, posting: any, perms: any) => {
  const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
  const organization = await Organization.findById(
    perms.data!.organization?._id
  );
  if (!organization) return;

  organization.auditLogs.push({
    action: `Advanced workflow for ${posting.title} to next step`,
    user: `${clerkUser.firstName} ${clerkUser.lastName}`,
    userId: clerkUser.id,
    type: "info",
  });

  const notification = {
    title: "Workflow Advanced",
    description: `Workflow for ${posting.title} has been advanced to the next step`,
    date: new Date(),
    read: false,
  };

  organization.members.forEach((member) => {
    if (
      member.role &&
      organization.roles.some(
        (r: any) =>
          r.slug === member.role && r.permissions.includes("manage_job")
      )
    ) {
      member.notifications.push(notification);
    }
  });

  await organization.save();
};

export default { advanceWorkflow };
