import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import Candidate from "@/models/Candidate";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";

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

    const resumeUrl = `${process.env.RESUMES_PUBLIC_URL}/${candidateId}.pdf`;

    return sendSuccess(c, 200, "Success", resumeUrl);
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

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const candidate = await Candidate.findOne({ _id: candidateId });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.postingId.toString() === postingId
    );

    if (!appliedPosting) {
      return sendError(c, 404, "Candidate not applied to this posting");
    }

    appliedPosting.status = "inprogress";
    await candidate.save();

    return sendSuccess(c, 200, "Success");
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

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const candidate = await Candidate.findOne({ _id: candidateId });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.postingId.toString() === postingId
    );

    if (!appliedPosting) {
      return sendError(c, 404, "Candidate not applied to this posting");
    }

    const step = posting.workflow?.currentStep;

    appliedPosting.status = "rejected";
    appliedPosting.disqualifiedStage = step;
    appliedPosting.disqualifiedReason = "Disqualified at Resume Round";

    await candidate.save();

    return sendSuccess(c, 200, "Success");
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

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const candidates = await Candidate.find({ _id: { $in: candidateIds } });

    for (const candidate of candidates) {
      const appliedPosting = candidate.appliedPostings.find(
        (ap) => ap.postingId.toString() === postingId
      );

      if (appliedPosting) {
        appliedPosting.status = "inprogress";
        await candidate.save();
      }
    }

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

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const step = posting.workflow?.currentStep;

    const candidates = await Candidate.find({ _id: { $in: candidateIds } });

    for (const candidate of candidates) {
      const appliedPosting = candidate.appliedPostings.find(
        (ap) => ap.postingId.toString() === postingId
      );

      if (appliedPosting) {
        appliedPosting.status = "rejected";
        appliedPosting.disqualifiedStage = step;
        appliedPosting.disqualifiedReason = "Disqualified at Resume Round";
        await candidate.save();
      }
    }

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
