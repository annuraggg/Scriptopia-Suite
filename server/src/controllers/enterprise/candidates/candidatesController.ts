import r2Client from "@/config/s3";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import Candidate from "@/models/Candidate";
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

  // @ts-expect-error - Type 'Promise<GetObjectOutput>' is not assignable to type 'string'
  const url = await getSignedUrl(r2Client, command, { expiresIn: 600 });

  return sendSuccess(c, 200, "Resume URL", { url });
};

export default {
  getCandidate,
  getResume,
};
