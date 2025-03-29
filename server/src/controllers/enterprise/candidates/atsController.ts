import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import Candidate from "@/models/Candidate";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";
import mongoose from "mongoose";

const getResume = async (c: Context) => {
  try {
    const { candidateId } = await c.req.json();
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const candidate = await Candidate.findOne({ _id: candidateId });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    if (!candidate.resumeUrl) {
      return sendError(c, 404, "Resume not found for this candidate");
    }

    return sendSuccess(c, 200, "Success", candidate.resumeUrl);
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const qualifyCandidate = async (c: Context) => {
  try {
    const { candidateId, postingId } = await c.req.json();
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findOne({ _id: postingId })
      .populate("organizationId")
      .populate("workflow");

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    // Verify if posting has a workflow and is in resume screening step
    if (!posting.workflow?.steps?.length) {
      return sendError(c, 400, "Posting workflow not configured");
    }

    const currentStep = posting.workflow.steps.find((step) => step.status === "in-progress");
    if (!currentStep || currentStep.type !== "RESUME_SCREENING") {
      return sendError(c, 400, "Current step is not resume screening");
    }

    const candidate = await Candidate.findOne({ _id: candidateId });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPostingIndex = candidate.appliedPostings.findIndex(
      (ap) => ap.toString() === postingId
    );

    if (appliedPostingIndex === -1) {
      return sendError(c, 404, "Candidate not applied to this posting");
    }

    // Update candidate status in posting's candidates array
    if (!posting.candidates.includes(candidateId as mongoose.Types.ObjectId)) {
      posting.candidates.push(candidateId as mongoose.Types.ObjectId);
      await posting.save();
    }

    return sendSuccess(c, 200, "Candidate qualified successfully");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const disqualifyCandidate = async (c: Context) => {
  try {
    const { candidateId, postingId } = await c.req.json();
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findOne({ _id: postingId })
      .populate("organizationId")
      .populate("workflow");

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    // Verify current workflow step
    if (!posting.workflow?.steps?.length) {
      return sendError(c, 400, "Posting workflow not configured");
    }

    const currentStep = posting.workflow.steps.find((step) => step.status === "in-progress");
    if (!currentStep) {
      return sendError(c, 400, "No active workflow step found");
    }

    const candidate = await Candidate.findOne({ _id: candidateId });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    // Remove candidate from posting's candidates array
    posting.candidates = posting.candidates.filter(
      (cid) => cid.toString() !== candidateId
    );
    await posting.save();

    return sendSuccess(c, 200, "Candidate disqualified successfully");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const bulkQualifyCandidates = async (c: Context) => {
  try {
    const { candidateIds, postingId } = await c.req.json();
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findOne({ _id: postingId })
      .populate("organizationId")
      .populate("workflow");

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    // Verify workflow step
    if (!posting.workflow?.steps?.length) {
      return sendError(c, 400, "Posting workflow not configured");
    }

    const currentStep = posting.workflow.steps.find((step) => step.status === "in-progress");
    if (!currentStep || currentStep.type !== "RESUME_SCREENING") {
      return sendError(c, 400, "Current step is not resume screening");
    }

    // Update posting's candidates array
    const uniqueCandidateIds = [...new Set(candidateIds)];
    for (const candidateId of uniqueCandidateIds) {
      if (
        !posting.candidates.includes(candidateId as mongoose.Types.ObjectId)
      ) {
        posting.candidates.push(candidateId as mongoose.Types.ObjectId);
      }
    }
    await posting.save();

    return sendSuccess(c, 200, "Candidates qualified successfully");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const bulkDisqualifyCandidates = async (c: Context) => {
  try {
    const { candidateIds, postingId } = await c.req.json();
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findOne({ _id: postingId })
      .populate("organizationId")
      .populate("workflow");

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    // Verify workflow step
    if (!posting.workflow?.steps?.length) {
      return sendError(c, 400, "Posting workflow not configured");
    }

    const currentStep = posting.workflow.steps.find((step) => step.status === "in-progress");
    if (!currentStep) {
      return sendError(c, 400, "No active workflow step found");
    }

    // Remove candidates from posting's candidates array
    posting.candidates = posting.candidates.filter(
      (cid) => !candidateIds.includes(cid.toString())
    );
    await posting.save();

    return sendSuccess(c, 200, "Candidates disqualified successfully");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

export default {
  getResume,
  disqualifyCandidate,
  qualifyCandidate,
  bulkQualifyCandidates,
  bulkDisqualifyCandidates,
};
