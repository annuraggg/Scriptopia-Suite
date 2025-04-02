import r2Client from "@/config/s3";
import checkInstitutePermission from "@/middlewares/checkInstitutePermission";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import AppliedDrive from "@/models/AppliedDrive";
import AppliedPosting from "@/models/AppliedPosting";
import Candidate from "@/models/Candidate";
import Drive from "@/models/Drive";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Context } from "hono";

const getCandidate = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const candidate = await Candidate.findOne({ userId: id });
    let exists = false;
    let candId = "";

    if (!candidate) {
      return sendSuccess(c, 200, "Candidate not found", { exists, candId });
    }

    let name = candidate.name;
    let phone = candidate.phone;

    exists = true;
    candId = candidate._id.toString();
    return sendSuccess(c, 200, "Candidate fetched successfully", {
      exists,
      name,
      phone,
      candId,
      posted: candidate.appliedPostings,
    });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getResume = async (c: Context) => {
  const checkPerms = await checkOrganizationPermission.some(c, [
    "view_job",
    "view_organization",
  ]);
  if (!checkPerms.allowed) {
    return sendError(c, 403, "Unauthorized");
  }

  const { id } = c.req.param();
  const command = new GetObjectCommand({
    Bucket: process.env.R2_S3_RESUME_BUCKET!,
    Key: `${id}.pdf`,
  });

  const url = await getSignedUrl(r2Client, command, { expiresIn: 600 });

  return sendSuccess(c, 200, "Resume URL", { url });
};

const qualifyCandidate = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.some(c, ["manage_job"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { postingId, _id } = await c.req.json();
    console.log(postingId, _id);
    const appliedPosting = await AppliedPosting.findOne({
      user: _id,
      posting: postingId,
    });

    if (!appliedPosting) {
      return sendError(c, 404, "Applied posting not found");
    }

    appliedPosting.status = "inprogress";
    appliedPosting.disqualifiedStage = null;
    await appliedPosting.save();

    return sendSuccess(c, 200, "Candidate qualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const disqualifyCandidate = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.some(c, ["manage_job"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { _id, postingId, reason } = await c.req.json();
    console.log(_id, postingId, reason);

    const appliedPosting = await AppliedPosting.findOne({
      user: _id,
      posting: postingId,
    });

    if (!appliedPosting) {
      return sendError(c, 404, "Applied posting not found");
    }

    appliedPosting.status = "rejected";
    const posting = await Posting.findOne({ _id: postingId });

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const stage = posting?.workflow?.steps?.find(
      (step) => step.status === "in-progress"
    )?._id;

    console.log("stage", stage);

    appliedPosting.disqualifiedStage = stage?.toString();
    appliedPosting.disqualifiedReason = reason;
    await appliedPosting.save();

    return sendSuccess(c, 200, "Candidate disqualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const bulkQualify = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.some(c, ["manage_job"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { postingId, candidateIds } = await c.req.json();
    const appliedPostings = await AppliedPosting.find({
      user: { $in: candidateIds },
      posting: postingId,
    });

    for (const appliedPosting of appliedPostings) {
      appliedPosting.status = "inprogress";
      appliedPosting.disqualifiedStage = null;
      await appliedPosting.save();
    }

    return sendSuccess(c, 200, "Candidates qualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const bulkDisqualify = async (c: Context) => {
  try {
    const perms = await checkOrganizationPermission.some(c, ["manage_job"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { postingId, candidateIds, reason } = await c.req.json();
    const appliedPostings = await AppliedPosting.find({
      user: { $in: candidateIds },
      posting: postingId,
    });

    const posting = await Posting.findOne({ _id: postingId });

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }
    const stage = posting?.workflow?.steps?.find(
      (step) => step.status === "in-progress"
    )?._id;

    for (const appliedPosting of appliedPostings) {
      appliedPosting.status = "rejected";

      appliedPosting.disqualifiedStage = stage?.toString();
      appliedPosting.disqualifiedReason = reason;
      await appliedPosting.save();
    }

    return sendSuccess(c, 200, "Candidates disqualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const qualifyCandidateInCampus = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.some(c, ["manage_drive"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { driveId, _id } = await c.req.json();
    console.log(driveId, _id);
    const appliedDrive = await AppliedDrive.findOne({
      user: _id,
      drive: driveId,
    });

    if (!appliedDrive) {
      return sendError(c, 404, "Applied drive not found");
    }

    appliedDrive.status = "inprogress";
    appliedDrive.disqualifiedStage = null;
    await appliedDrive.save();

    return sendSuccess(c, 200, "Candidate qualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const disqualifyCandidateInCampus = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.some(c, ["manage_drive"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { _id, driveId, reason } = await c.req.json();
    console.log(_id, driveId, reason);

    const appliedDrive = await AppliedDrive.findOne({
      user: _id,
      drive: driveId,
    });

    if (!appliedDrive) {
      return sendError(c, 404, "Applied drive not found");
    }

    appliedDrive.status = "rejected";
    const posting = await Drive.findOne({ _id: driveId });

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const stage = posting?.workflow?.steps?.find(
      (step) => step.status === "in-progress"
    )?._id;

    console.log("stage", stage);

    appliedDrive.disqualifiedStage = stage?.toString();
    appliedDrive.disqualifiedReason = reason;
    await appliedDrive.save();

    return sendSuccess(c, 200, "Candidate disqualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const bulkQualifyInCampus = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.some(c, ["manage_drive"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { driveId, candidateIds } = await c.req.json();
    const appliedDrives = await AppliedDrive.find({
      user: { $in: candidateIds },
      drive: driveId,
    });

    for (const appliedDrive of appliedDrives) {
      appliedDrive.status = "inprogress";
      appliedDrive.disqualifiedStage = null;
      await appliedDrive.save();
    }

    return sendSuccess(c, 200, "Candidates qualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const bulkDisqualifyInCampus = async (c: Context) => {
  try {
    const perms = await checkInstitutePermission.some(c, ["manage_drive"]);

    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const { driveId, candidateIds, reason } = await c.req.json();
    const appliedDrives = await AppliedDrive.find({
      user: { $in: candidateIds },
      drive: driveId,
    });

    const posting = await Drive.findOne({ _id: driveId });

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }
    const stage = posting?.workflow?.steps?.find(
      (step) => step.status === "in-progress"
    )?._id;

    for (const appliedDrive of appliedDrives) {
      appliedDrive.status = "rejected";

      appliedDrive.disqualifiedStage = stage?.toString();
      appliedDrive.disqualifiedReason = reason;
      await appliedDrive.save();
    }

    return sendSuccess(c, 200, "Candidates disqualified successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

export default {
  getCandidate,
  getResume,
  qualifyCandidate,
  disqualifyCandidate,
  bulkQualify,
  bulkDisqualify,
  qualifyCandidateInCampus,
  disqualifyCandidateInCampus,
  bulkQualifyInCampus,
  bulkDisqualifyInCampus,
};
