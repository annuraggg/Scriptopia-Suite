import loops from "@/config/loops";
import r2Client from "@/config/s3";
import Candidate from "@/models/Candidate";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Upload } from "@aws-sdk/lib-storage";
import { Context } from "hono";

const submitAssignment = async (c: Context) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");
    const postingId = formData.get("postingId");
    const userId = formData.get("userId");
    const assignmentId = formData.get("assignmentId");

    if (!file || !postingId || !userId || !assignmentId) {
      return sendError(c, 400, "Invalid request");
    }

    const user = await Candidate.findOne({ userId });
    if (!user) {
      return sendError(c, 404, "Candidate not found");
    }

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    if (!posting.assignments) {
      return sendError(c, 404, "Assignments not found");
    }

    const assignment = posting.assignments.find(
      (a) => a._id.toString() === assignmentId
    );
    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    // @ts-expect-error - Type 'string' is not assignable to type 'ObjectId'
    if (assignment.submissions.includes(user._id)) {
      return sendError(c, 400, "Assignment already submitted");
    }

    // @ts-expect-error - Type 'string' is not assignable to type 'ObjectId'
    if (!posting.candidates.includes(user._id)) {
      return sendError(c, 400, "User is not a candidate for this posting");
    }

    const currentstep = posting?.workflow?.currentStep;
    const step = posting?.workflow?.steps[currentstep as number];

    if (!step) {
      return sendError(c, 400, "Invalid workflow");
    }

    if (step.stepId.toString() !== assignment._id.toString()) {
      return sendError(c, 400, "Invalid assignment");
    }

    const uploadParams = {
      Bucket: process.env.R2_S3_BUCKET!,
      Key: `assignments/${assignmentId}/${user._id}`,
      Body: file, // @ts-expect-error - Type 'File' is not assignable to type 'Body'
      ContentType: file.type,
    };

    const upload = new Upload({
      client: r2Client,
      params: uploadParams,
    });

    await upload.done();

    assignment.submissions.push(user._id);
    await posting.save();

    loops.sendTransactionalEmail({
      transactionalId: "cm13tu50l02mc80gpi76joqvy",
      email: user.email,
      dataVariables: { // @ts-expect-error - Type 'string' is not assignable to type 'DataVariables'
        organization: posting?.organizationId?.name,
      },
    });

    return sendSuccess(c, 200, "Assignment submitted successfully");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

export default {
  submitAssignment,
};
