import Drive from "../../../models/Drive";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import Institute from "@/models/Institute";
import mongoose from "mongoose";
import clerkClient from "@/config/clerk";
import { AuditLog } from "@shared-types/Instititue";
// import assessmentController from "../../coding/assessmentController";

const getDrives = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.find({
      instituteId: perms.data?.institute?._id,
    });

    const institute = await Institute.findById(
      perms.data?.institute?._id
    );

    return sendSuccess(c, 200, "Drive fetched successfully", {
      postings: drive,
      departments: institute?.departments,
    });
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getDrive = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findById(c.req.param("id"))
      .populate("mcqAssessments.assessmentId")
      .populate("codeAssessments.assessmentId")
      .populate("candidates")
      .populate("candidates.appliedPostings")
      .populate("instituteId")
      .populate("assignments.submissions");

    if (!drive) {
      return sendError(c, 404, "drive not found");
    }

    return sendSuccess(c, 200, "drive fetched successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getDriveBySlug = async (c: Context) => {
  try {
    const drive = await Drive.findOne({ url: c.req.param("slug") })
      .populate("mcqAssessments.assessmentId")
      .populate("codeAssessments.assessmentId")
      .populate("candidates")
      .populate("instituteId")
      .populate("assignments.submissions");

    if (!drive) {
      return sendError(c, 404, "job not found");
    }

    return sendSuccess(c, 200, "job fetched successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createDrive = async (c: Context) => {
  try {
    const drive = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    if (drive.additionalDetails) {
      Object.entries(drive.additionalDetails).forEach(
        ([category, fields]) => {
          Object.entries(fields as { [key: string]: any }).forEach(
            ([field, config]: [string, any]) => {
              if (
                typeof config.required !== "boolean" ||
                typeof config.allowEmpty !== "boolean"
              ) {
                throw new Error(
                  `Invalid configuration for ${category}.${field}`
                );
              }
            }
          );
        }
      );
    }

    console.log(drive.workflow.steps);

    const newDrive = new Drive({
      ...drive,
      instituteId: perms.data?.institute?._id,
    });

    await newDrive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Drive: ${drive.title}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: {
        auditLogs: auditLog,
        drives: newDrive._id,
      },
    });

    return sendSuccess(c, 201, "drive created successfully", newDrive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, `Error creating drive: ${e.message}`);
  }
};

const createWorkflow = async (c: Context) => {
  try {
    const { formattedData, _id } = await c.req.json();
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    console.log(formattedData);

    const drive = await Drive.findById(_id);
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    drive.workflow = formattedData;
    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Workflow for Drive: ${drive.title}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Workflow created successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateAts = async (c: Context) => {
  try {
    const { minimumScore, negativePrompts, positivePrompts, _id } =
      await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findById(_id);
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    console.log(drive);

    if (!drive.ats) {
      drive.ats = {
        minimumScore: minimumScore,
        negativePrompts: negativePrompts,
        positivePrompts: positivePrompts,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      drive.ats.minimumScore = minimumScore;
      drive.ats.negativePrompts = negativePrompts;
      drive.ats.positivePrompts = positivePrompts;
    }

    if (!drive.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    if (!drive.ats) {
      return sendError(c, 400, "ATS not found");
    }

    const atsStep = drive.workflow.steps.filter(
      (step) => step.type === "RESUME_SCREENING"
    );
    atsStep[0]._id = new mongoose.Types.ObjectId(drive?.ats?._id?.toString());

    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Updated ATS for Drive: ${drive.title}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "ATS updated successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateAssignment = async (c: Context) => {
  try {
    const { name, description, driveId, step, submissionType } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return sendError(c, 404, "drive not found");
    }

    if (!drive.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    const _id = new mongoose.Types.ObjectId();
    const workflowId = drive.workflow.steps[step]._id;

    drive.assignments.push({ _id, name, description, workflowId, submissionType });
    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Assignment for Drive: ${drive.title}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Assignment created successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const updateInterview = async (c: Context) => {
  try {
    const { driveId, step, interview } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return sendError(c, 404, "drive not found");
    }

    if (!drive.workflow) {
      return sendError(c, 400, "Workflow not found");
    }

    const _id = new mongoose.Types.ObjectId();
    // @ts-expect-error - Object has no properties common
    drive.workflow.steps[step].stepId = _id;

    drive.interview = interview;
    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Interview for Drive: ${drive.title}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Interview created successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const publishDrive = async (c: Context) => {
  try {
    const { id } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findById(id);
    if (!drive) {
      return sendError(c, 404, "drive not found");
    }

    drive.published = true;
    drive.publishedOn = new Date();

    const urlSlug = Math.random().toString(36).substring(7);
    drive.url = urlSlug;
    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Published Drive: ${drive.title}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Drive published successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const deleteDrive = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.findByIdAndDelete(c.req.param("id"));
    if (!drive) {
      return sendError(c, 404, "drive not found");
    }

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $pull: { postings: drive._id },
    });

    return sendSuccess(c, 200, "drive deleted successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

export default {
  getDrives,
  getDrive,
  createDrive,
  createWorkflow,
  updateAts,
  updateAssignment,
  updateInterview,
  publishDrive,
  deleteDrive,
  getDriveBySlug,
};
