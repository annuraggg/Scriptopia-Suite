import loops from "@/config/loops";
import r2Client from "@/config/s3";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import Candidate from "@/models/Candidate";
import Posting from "@/models/Posting";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Upload } from "@aws-sdk/lib-storage";
import { AppliedPosting } from "@shared-types/AppliedPosting";
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
      (a) => a?._id?.toString() === assignmentId
    );
    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    if (assignment.submissions.includes(user._id)) {
      return sendError(c, 400, "Assignment already submitted");
    }

    if (!posting.candidates.includes(user._id)) {
      return sendError(c, 400, "User is not a candidate for this posting");
    }

    const currentstep = posting?.workflow?.steps.findIndex(
      (step) => step.status === "in-progress"
    );
    const step = posting?.workflow?.steps[currentstep as number];

    if (!step) {
      return sendError(c, 400, "Invalid workflow");
    }

    if (step?._id?.toString() !== assignment?._id?.toString()) {
      return sendError(c, 400, "Invalid assignment");
    }

    const uploadParams = {
      Bucket: process.env.R2_S3_ASSIGNMENT_BUCKET!,
      Key: `${assignmentId}/${user._id}`,
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
      email: user.email as string,
      dataVariables: {
        // @ts-expect-error - Type 'string' is not assignable to type 'DataVariables'
        organization: posting?.organizationId?.name,
      },
    });

    return sendSuccess(c, 200, "Assignment submitted successfully");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const getAssignment = async (c: Context) => {
  try {
    const { assignmentId, postingId, candidateId } = await c.req.json();
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

    const assignment = posting.assignments.find(
      (a) => a?._id?.toString() === assignmentId
    );

    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    const url = `${process.env.ASSIGNMENTS_PUBLIC_URL}/${assignmentId}/${candidateId}`;
    return sendSuccess(c, 200, "Assignment fetched successfully", url);
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const gradeAssignment = async (c: Context) => {
  try {
    const { assignmentId, candidateId, postingId, grade } = await c.req.json();
    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    if (grade < 0 || grade > 100) {
      return sendError(
        c,
        400,
        "Invalid grade. Grade should be between 0 and 100"
      );
    }

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const assignment = posting.assignments.find(
      (a) => a?._id?.toString() === assignmentId
    );

    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    const candidate = await Candidate.findById(candidateId).populate<{
      appliedPostings: AppliedPosting[];
    }>("appliedPostings");
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const submission = assignment.submissions.find(
      (s) => s.toString() === candidateId
    );
    if (!submission) {
      return sendError(c, 404, "Submission not found");
    }

    const currentPosting = candidate.appliedPostings.find(
      (p) => (p as unknown as AppliedPosting).posting.toString() === postingId
    );

    if (!currentPosting) {
      return sendError(c, 404, "Posting not found");
    }

    const currentAssignment = currentPosting?.scores?.find(
      (a) => a?.stageId?.toString() === assignmentId
    );

    if (currentAssignment) {
      currentAssignment.score = grade;
    } else {
      currentPosting?.scores?.push({ score: grade, stageId: assignmentId });
    }

    await candidate.save();

    return sendSuccess(c, 200, "Assignment graded successfully");
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

    const candidate = await Candidate.findOne({ _id: candidateId }).populate<{
      appliedPostings: AppliedPosting[];
    }>("appliedPostings");
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.posting.toString() === postingId
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

    const candidate = await Candidate.findOne({ _id: candidateId }).populate<{
      appliedPostings: AppliedPosting[];
    }>("appliedPostings");
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.posting.toString() === postingId
    );

    if (!appliedPosting) {
      return sendError(c, 404, "Candidate not applied to this posting");
    }

    const step = posting.workflow?.steps.findIndex((step) => step.status === "in-progress");

    appliedPosting.status = "rejected";
    appliedPosting.disqualifiedStage = step;
    appliedPosting.disqualifiedReason = "Disqualified at Assignment Round";

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

    const candidates = await Candidate.find({
      _id: { $in: candidateIds },
    }).populate<{ appliedPostings: AppliedPosting[] }>("appliedPostings");

    for (const candidate of candidates) {
      const appliedPosting = candidate.appliedPostings.find(
        (ap) => ap.posting.toString() === postingId
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

    const step = posting.workflow?.steps.findIndex((step) => step.status === "in-progress");

    const candidates = await Candidate.find({
      _id: { $in: candidateIds },
    }).populate<{ appliedPostings: AppliedPosting[] }>("appliedPostings");

    for (const candidate of candidates) {
      const appliedPosting = candidate.appliedPostings.find(
        (ap) => ap.posting.toString() === postingId
      );

      if (appliedPosting) {
        appliedPosting.status = "rejected";
        appliedPosting.disqualifiedStage = step;
        appliedPosting.disqualifiedReason = "Disqualified at Assignment Round";
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
  submitAssignment,
  getAssignment,
  gradeAssignment,
  qualifyCandidate,
  disqualifyCandidate,
  bulkQualifyCandidates,
  bulkDisqualifyCandidates,
};
