import r2Client from "@/config/s3";
import AppliedPosting from "@/models/AppliedPosting";
import Candidate from "@/models/Candidate";
import Organization from "@/models/Organization";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Upload } from "@aws-sdk/lib-storage";
import { AuditLog } from "@shared-types/Organization";
import { Context } from "hono";
import PDE from "pdf.js-extract";
const PDFExtract = PDE.PDFExtract;

const getPosting = async (c: Context) => {
  const { url } = c.req.param();
  try {
    const posting = await Posting.findOne({ url: url, published: true });
    const organization = await Organization.findOne({
      _id: posting?.organizationId,
    });

    return sendSuccess(c, 200, "Posting fetched successfully", {
      postings: posting,
      organization,
    });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

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

const apply = async (c: Context) => {
  try {
    const formData = await c.req.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const website = formData.get("website");
    const resume = formData.get("resume");
    const postingId = formData.get("postingId");
    const exists = formData.get("exists") === "true";
    const candId = formData.get("candId");
    const userId = formData.get("userId");

    let finalCandId: string = candId?.toString() || "";

    const posting = await Posting.findById(postingId);
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const today = new Date();
    if (
      today < posting?.applicationRange?.start! ||
      today > posting?.applicationRange?.end!
    ) {
      return sendError(c, 400, "Posting is closed for applications");
    }

    if (exists) {
      const candidate = await Candidate.findById(candId).populate(
        "appliedPostings"
      );
      if (!candidate) {
        return sendError(c, 404, "Candidate not found");
      }

      if (
        candidate.appliedPostings.some(
          (posting) => posting._id?.toString() === postingId
        )
      ) {
        return sendError(c, 400, "You have already applied for this posting");
      }

      candidate.name = `${firstName} ${lastName}`;
      candidate.phone = candidate.phone;
      candidate.email = email?.toString() || candidate.email;

      const appliedPosting = new AppliedPosting({
        posting: postingId,
        user: candidate._id,
      });

      await appliedPosting.save();
      candidate.appliedPostings.push(appliedPosting._id);
      await candidate.save();
    }

    if (!exists) {
      const cand = await Candidate.findOne({ email });
      if (cand) {
        return sendError(c, 400, "Candidate with this email already exists");
      }

      if (!resume) {
        return sendError(c, 400, "Resume file is required");
      }

      const candidate = new Candidate({
        firstName,
        lastName,
        email,
        phone,
        website,
        userId,
      });

      const appliedPosting = new AppliedPosting({
        posting: postingId,
        user: candidate._id,
      });

      await appliedPosting.save();
      candidate.appliedPostings.push(appliedPosting._id);

      await candidate.save();
      finalCandId = candidate._id.toString();
    }

    if (resume) {
      const uploadParams = {
        Bucket: process.env.R2_S3_RESUME_BUCKET!,
        Key: `${finalCandId?.toString()}.pdf`,
        Body: resume, // @ts-expect-error - Type 'File' is not assignable to type 'Body'
        ContentType: resume.type,
      };

      const upload = new Upload({
        client: r2Client,
        params: uploadParams,
      });

      await upload.done();

      await extractTextFromResume(resume as File, finalCandId);

      await Candidate.findByIdAndUpdate(finalCandId, {
        resumeUrl: `resumes/${finalCandId}`,
      });
    }
    const postingUp = await Posting.findByIdAndUpdate(postingId, {
      $push: {
        candidates: finalCandId,
      },
    });

    await postingUp?.save();

    const auditLog: AuditLog = {
      user: "System",
      userId: "system",
      action: `Received application for ${posting.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(posting.organizationId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 200, "Application submitted successfully");
  } catch (e: any) {
    console.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const extractTextFromResume = async (resume: File, candidateId: string) => {
  const resumeBuffer = Buffer.from(await resume.arrayBuffer());
  const pdfExtract = new PDFExtract();
  const options = {}; /* see below */

  let extractedText = "";

  pdfExtract.extractBuffer(resumeBuffer, options, async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    if (!data) {
      return extractedText;
    }

    for (const page of data.pages) {
      for (const content of page.content) {
        extractedText += content.str + " ";
      }
    }

    await Candidate.findByIdAndUpdate(candidateId, {
      resumeExtract: extractedText,
    });

    return extractedText;
  });

  return extractedText;
};

const verifyCandidate = async (c: Context) => {
  try {
    const { userId, postingId } = await c.req.json();
    const posting = await Posting.findById(postingId);
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const candidate = await Candidate.findOne({ userId });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    // @ts-expect-error - Type 'string' is not assignable to type 'ObjectId'
    if (posting.candidates.includes(candidate?._id.toString())) {
      return sendSuccess(c, 200, "Candidate verified successfully");
    }
    return sendError(c, 400, "Candidate not verified");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

export default {
  getPosting,
  apply,
  getCandidate,
  verifyCandidate,
};
