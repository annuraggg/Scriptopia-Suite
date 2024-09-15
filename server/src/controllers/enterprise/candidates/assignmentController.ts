import loops from "@/config/loops";
import r2Client from "@/config/s3";
import Candidate from "@/models/Candidate";
import Organization from "@/models/Organization";
import Otp from "@/models/Otp";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Upload } from "@aws-sdk/lib-storage";
import { Context } from "hono";
import PDE from "pdf.js-extract";
const PDFExtract = PDE.PDFExtract;

const submitAssignment = async (c: Context) => {
  const formData = await c.req.formData();
  const file = formData.get("file");
  const postingId = formData.get("postingId");
  const userId = formData.get("userId");

  if (!file || !postingId || !userId) {
    return sendError(c, 400, "Invalid request");
  }
};
