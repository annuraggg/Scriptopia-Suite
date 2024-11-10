import Posting from "../../../models/Posting";
import checkPermission from "../../../middlewares/checkOrganizationPermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import Organization from "@/models/Organization";
import assessmentController from "@/controllers/coding/assessmentController";
import mongoose from "mongoose";
import clerkClient from "@/config/clerk";
import { AuditLog } from "@shared-types/Organization";
// import assessmentController from "../../coding/assessmentController";

const getPostings = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.find({
      organizationId: perms.data!.orgId,
    });

    const organization = await Organization.findById(perms.data!.orgId);

    return sendSuccess(c, 200, "Posting fetched successfully", {
      postings: posting,
      departments: organization?.departments,
    });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getPosting = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(c.req.param("id"))
      .populate("assessments.assessmentId")
      .populate("candidates")
      .populate("organizationId")
      .populate("assignments.submissions");

    if (!posting) {
      return sendError(c, 404, "job not found");
    }

    return sendSuccess(c, 200, "job fetched successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createPosting = async (c: Context) => {
  try {
    const {
      title,
      description,
      department,
      location,
      openings,
      type,
      skills,
      qualifications,
      salary: { min, max, currency },
      applicationRange: { start, end },
    } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = new Posting({
      organizationId: perms.data!.orgId,
      title,
      description,
      department,
      openings,
      location,
      type,
      skills,
      qualifications,
      salary: { min, max, currency },
      applicationRange: { start, end },
    });

    await posting.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Job Posting: ${title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "job created successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createWorkflow = async (c: Context) => {
  try {
    const { formattedData, _id } = await c.req.json();
    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    console.log(formattedData);

    const posting = await Posting.findById(_id);
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    posting.workflow = formattedData;
    await posting.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Workflow for Job Posting: ${posting.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Workflow created successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateAts = async (c: Context) => {
  try {
    const { minimumScore, negativePrompts, positivePrompts, _id } =
      await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(_id);
    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    if (!posting.ats) {
      posting.ats = {
        // @ts-expect-error - Object has no properties common
        _id: new mongoose.Types.ObjectId(),
        minimumScore: minimumScore,
        negativePrompts: negativePrompts,
        positivePrompts: positivePrompts,
        status: "pending",
      };
    } else {
      posting.ats.minimumScore = minimumScore;
      posting.ats.negativePrompts = negativePrompts;
      posting.ats.positivePrompts = positivePrompts;
    }

    if (!posting.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    if (!posting.ats) {
      return sendError(c, 400, "ATS not found");
    }

    const atsStep = posting.workflow.steps.filter((step) => step.type === "rs");
    atsStep[0].stepId = posting.ats._id!;

    await posting.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Updated ATS for Job Posting: ${posting.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "ATS updated successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateAssessment = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const newAssessment = await assessmentController.createAssessment(c);
    const { postingId, step } = await c.req.json();

    console.log(postingId, step);

    const resp = await newAssessment.json();

    const existingAssessments = await Posting.findOne({
      _id: postingId,
    }).populate("assessments");
    if (!existingAssessments) {
      return sendError(c, 404, "job not found");
    }

    if (!existingAssessments.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    existingAssessments.workflow.steps[step].stepId = resp.data._id;
    await existingAssessments.save();

    await Posting.findByIdAndUpdate(postingId, {
      $push: { assessments: {
        assessmentId: resp.data._id,
        stepId: existingAssessments.workflow.steps[step].stepId,
      } },
      updatedOn: new Date(),
    });

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Assessment for Job Posting: ${existingAssessments.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    console.log(resp.data._id);
    return sendSuccess(c, 200, "Success", resp.data._id);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateAssignment = async (c: Context) => {
  try {
    const { name, description, postingId, step } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(postingId);
    if (!posting) {
      return sendError(c, 404, "job not found");
    }

    if (!posting.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    const _id = new mongoose.Types.ObjectId();
    // @ts-expect-error - Object has no properties common
    posting.workflow.steps[step].stepId = _id;

    posting.assignments.push({ _id, name, description });
    await posting.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Assignment for Job Posting: ${posting.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Assignment created successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateInterview = async (c: Context) => {
  try {
    const { postingId, step, interview } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(postingId);
    if (!posting) {
      return sendError(c, 404, "job not found");
    }

    if (!posting.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    const _id = new mongoose.Types.ObjectId();
    // @ts-expect-error - Object has no properties common
    posting.workflow.steps[step].stepId = _id;

    posting.interview = interview;
    await posting.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Interview for Job Posting: ${posting.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Interview created successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const publishPosting = async (c: Context) => {
  try {
    const { id } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findById(id);
    if (!posting) {
      return sendError(c, 404, "job not found");
    }

    posting.published = true;
    posting.publishedOn = new Date();

    const urlSlug = Math.random().toString(36).substring(7);
    posting.url = urlSlug;
    await posting.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Published Job Posting: ${posting.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data!.orgId, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Posting published successfully", posting);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const deletePosting = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findByIdAndDelete(c.req.param("id"));
    if (!posting) {
      return sendError(c, 404, "job not found");
    }

    return sendSuccess(c, 200, "job deleted successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

export default {
  getPostings,
  getPosting,
  createPosting,
  createWorkflow,
  updateAts,
  updateAssessment,
  updateAssignment,
  updateInterview,
  publishPosting,
  deletePosting,
};
