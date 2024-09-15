import Posting from "../../../models/Posting";
import checkPermission from "../../../middlewares/checkOrganizationPermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import { Context } from "hono";
import { Posting as PostingType } from "@shared-types/Posting";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { AppliedPosting, Candidate } from "@shared-types/Candidate";
import loops from "@/config/loops";
import Organization from "@/models/Organization";
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

    if (workflow.currentStep >= workflow.steps.length) {
      return sendError(c, 400, "Workflow already completed");
    }

    const newStepIndex = workflow.currentStep + 1;
    workflow.currentStep = newStepIndex;

    if (workflow.steps[newStepIndex].type === "rs")
      await handleResumeScreening(c, posting as unknown as PostingType);

    if (workflow.steps[newStepIndex].type === "as")
      await handleAssignmentRound(
        c,
        posting as unknown as PostingType,
        workflow.steps[newStepIndex]
      );

    await posting.save();

    return sendSuccess(c, 200, "Workflow advanced successfully", posting);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const handleResumeScreening = async (c: Context, posting: PostingType) => {
  if (posting.ats) {
    posting.ats.status = "processing";
  }

  const lambdaClient = new LambdaClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_LAMBDA_SECRET_ACCESS_KEY!,
    },
  });

  const resumes = [];

  for (const candidate of posting.candidates as unknown as Candidate[]) {
    const data = {
      candidateId: candidate._id.toString(),
      resume: candidate.resumeExtract,
    };

    resumes.push(data);
  }

  const event = {
    jobDescription: posting.description,
    skills: posting?.skills?.join(","),
    negativePrompts: posting?.ats?.negativePrompts.join(","),
    positivePrompts: posting?.ats?.positivePrompts.join(","),
    postingId: posting?._id?.toString(),
    resumes: resumes,
  };

  const params = {
    FunctionName: `resume-screener`,
    Payload: JSON.stringify(event),
  };

  lambdaClient.send(new InvokeCommand(params));
  return;
};

const handleAssignmentRound = async (
  c: Context,
  posting: PostingType,
  step: { name: string }
) => {
  const { name } = step;
  const assignment = posting.assignments.find((a) => a.name === name);
  const organization = await Organization.findById(posting.organizationId);

  if (!assignment || !organization || !posting) return;

  const qualifiedCandidates = posting.candidates.filter(
    // @ts-expect-error - candidates is not defined in PostingType
    (candidate: Candidate) => {
      const current = candidate.appliedPostings.find(
        (ap: AppliedPosting) =>
          ap.postingId.toString() === posting?._id?.toString()
      );

      if (!current) return false;
      return current.status !== "rejected";
    }
  );

  for (const candidate of qualifiedCandidates as unknown as Candidate[]) {
    loops.sendTransactionalEmail({
      transactionalId: "cm0zk1vd900966e8e6czepc4d",
      email: candidate?.email!,
      dataVariables: {
        name: candidate?.firstName || "",
        postingName: posting?.title || "",
        company: organization?.name || "",
        assignmentLink: `${process.env.ENTERPRISE_FRONTEND_URL}/postings/${posting?.url}/assignments/${assignment._id}`,
      },
    });
  }
};

const handleAssessmentRound = async (c: Context, posting: PostingType) => {};

export default {
  advanceWorkflow,
};
