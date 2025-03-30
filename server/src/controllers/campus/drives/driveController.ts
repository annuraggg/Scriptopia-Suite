import Drive from "../../../models/Drive";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import Organization from "@/models/Organization";
import mongoose from "mongoose";
import clerkClient from "@/config/clerk";
import { AuditLog } from "@shared-types/Organization";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import { Upload } from "@aws-sdk/lib-storage";
import r2Client from "@/config/s3";
import loops from "@/config/loops";
import Candidate from "@/models/Candidate";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AppliedDrive from "@/models/AppliedDrive";

const getDrives = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drive.find({
      organizationId: perms.data?.organization?._id,
    });

    const organization = await Organization.findById(
      perms.data?.organization?._id
    );

    return sendSuccess(c, 200, "Drive fetched successfully", {
      drives: drive,
      departments: organization?.departments,
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
      .populate({
        path: "candidates",
        populate: {
          path: "appliedDrives",
          model: "AppliedDrive",
        },
      })
      .populate("organizationId")
      .populate("assignments.submissions")
      .populate("interviews.interview");

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
      .populate("organizationId")
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

const createDrive = async (c: Context) => {
  try {
    const drive = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    if (drive.additionalDetails) {
      Object.entries(drive.additionalDetails).forEach(([category, fields]) => {
        Object.entries(fields as { [key: string]: any }).forEach(
          ([field, config]: [string, any]) => {
            if (
              typeof config.required !== "boolean" ||
              typeof config.allowEmpty !== "boolean"
            ) {
              throw new Error(`Invalid configuration for ${category}.${field}`);
            }
          }
        );
      });
    }

    const newDrive = new Drive({
      ...drive,
      organizationId: perms.data?.organization?._id,
    });

    await newDrive.save();

    const newDriveFetched = await Drive.findById(newDrive._id);
    if (!newDriveFetched) {
      return sendError(c, 500, "Error creating drive");
    }

    await newDriveFetched.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Drive: ${drive.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
      $push: {
        auditLogs: auditLog,
        drives: newDrive._id,
      },
    });

    return sendSuccess(c, 200, "drive created successfully", newDrive);
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

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
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
    if (!drive.ats) {
      drive.ats = {
        _id: new mongoose.Types.ObjectId(),
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
    if (drive.ats && drive.ats._id) {
      atsStep[0]._id = new mongoose.Types.ObjectId(drive.ats._id.toString());
    }

    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Updated ATS for Drive: ${drive.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
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
    const { name, description, driveId, step, submissionType } =
      await c.req.json();

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

    drive.assignments.push({
      _id,
      name,
      description,
      workflowId,
      submissionType,
    });
    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Assignment for Drive: ${drive.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
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
    const { driveId, step } = await c.req.json();

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

    await drive.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created New Interview for Drive: ${drive.title}`,
      type: "info",
    };

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
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

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
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

    await Organization.findByIdAndUpdate(perms.data?.organization?._id, {
      $pull: { drives: drive._id },
    });

    return sendSuccess(c, 200, "drive deleted successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getAssignment = async (c: Context) => {
  try {
    const { id, aid } = c.req.param();
    const drive = await Drive.findById(id);
    if (!drive) {
      return sendError(c, 404, "drive not found");
    }

    const assignment = drive.assignments.find((a) => a._id?.toString() === aid);
    if (!assignment) {
      return sendError(c, 404, "assignment not found");
    }

    return sendSuccess(c, 200, "drive fetched successfully", assignment);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const saveAssignmentSubmission = async (c: Context) => {
  try {
    const { id, aid } = c.req.param();

    // Parse request body only once
    let textSubmission, linkSubmission;

    if (c.req.header("content-type")?.includes("application/json")) {
      const body = await c.req.json();
      textSubmission = body.textSubmission;
      linkSubmission = body.linkSubmission;
    }

    // Validate parameters
    if (!id || !aid) {
      return sendError(c, 400, "Missing required parameters");
    }

    // Get the drive
    const drive = await Drive.findById(id);
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    // Find the assignment
    const assignment = drive.assignments.find((a) => a._id?.toString() === aid);

    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    // Check user
    const userId = c.get("auth")._id;
    if (!userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const user = await Candidate.findOne({ userId });
    if (!user) {
      return sendError(c, 404, "User not found");
    }

    // Check if submission deadline has passed
    const driveStep = drive.workflow?.steps.find(
      (step) => step._id?.toString() === assignment.workflowId?.toString()
    );
    if (!driveStep || driveStep.status !== "in-progress") {
      return sendError(c, 400, "Submission deadline has passed");
    }

    // Check if submission already exists
    const existingSubmission = await AssignmentSubmission.findOne({
      assignmentId: assignment._id,
      candidateId: userId,
    });

    if (existingSubmission) {
      return sendError(c, 409, "You have already submitted this assignment");
    }

    // Handle file upload if needed
    if (assignment.submissionType === "file") {
      const formData = await c.req.formData();
      const file = formData.get("file");

      if (!file) {
        return sendError(c, 400, "File is required for this assignment");
      }

      try {
        const uploadParams = {
          Bucket: process.env.R2_S3_ASSIGNMENT_BUCKET!,
          Key: `${aid}/${c.get("auth")._id}.zip`,
          Body: file, // @ts-expect-error - Type 'File' is not assignable to type 'Body'
          ContentType: file.type,
        };

        const upload = new Upload({
          client: r2Client,
          params: uploadParams,
        });

        await upload.done();
      } catch (uploadError) {
        logger.error("File upload failed");
        return sendError(c, 500, "Failed to upload file");
      }
    }

    // Create submission
    const submission = new AssignmentSubmission({
      assignmentId: assignment._id,
      driveId: drive._id,
      candidateId: userId,
      textSubmission,
      linkSubmission,
      submittedAt: new Date(),
    });

    // Add submission to assignment
    assignment.submissions.push(submission._id);

    // Send confirmation email
    try {
      await loops.sendTransactionalEmail({
        transactionalId: "cm13tu50l02mc80gpi76joqvy",
        email: user.email as string,
        dataVariables: {
          // @ts-expect-error - Type 'string' is not assignable to type 'DataVariables'
          organization: drive?.organizationId?.name || "the company",
        },
      });
    } catch (emailError) {
      logger.warn("Failed to send confirmation email");
      // Continue with submission process even if email fails
    }

    // Save changes
    await Promise.all([drive.save(), submission.save()]);

    return sendSuccess(c, 201, "Submission saved successfully", submission);
  } catch (e: any) {
    logger.error("Error saving assignment submission");
    return sendError(
      c,
      500,
      "Something went wrong while processing your submission"
    );
  }
};

const gradeAssignment = async (c: Context) => {
  try {
    const { id, aid } = c.req.param();
    const { grade, cid } = await c.req.json();

    console.log(grade, cid);

    // Get the drive
    const drive = await Drive.findById(id);
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    // Find the assignment
    const assignment = drive.assignments.find((a) => a._id?.toString() === aid);

    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    // Get the submission
    console.log(assignment._id, cid);
    const submission = await AssignmentSubmission.findOne({
      assignmentId: assignment._id,
      candidateId: cid,
    });

    if (!submission) {
      return sendError(c, 404, "Submission not found");
    }

    // Update the grade
    submission.grade = grade;
    console.log(submission);
    await submission.save();

    return sendSuccess(c, 200, "Grade saved successfully", submission);
  } catch (e: any) {
    logger.error("Error grading assignment submission");
    return sendError(
      c,
      500,
      "Something went wrong while processing your submission"
    );
  }
};

const getAssignmentSubmission = async (c: Context) => {
  try {
    const { id, aid, sid } = c.req.param();

    // Get the drive
    const drive = await Drive.findById(id);
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    // Find the assignment
    const assignment = drive.assignments.find((a) => a._id?.toString() === aid);

    if (!assignment) {
      return sendError(c, 404, "Assignment not found");
    }

    console.log(aid, sid);
    // Get the submission file
    const command = new GetObjectCommand({
      Bucket: process.env.R2_S3_ASSIGNMENT_BUCKET!,
      Key: `${aid}/${sid}.zip`,
    });

    const url = await getSignedUrl(r2Client, command, { expiresIn: 600 });

    return sendSuccess(c, 200, "File URL", { url });
  } catch (e: any) {
    logger.error("Error getting assignment submission");
    return sendError(
      c,
      500,
      "Something went wrong while processing your submission"
    );
  }
};

const getAppliedDrives = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drives = await AppliedDrive.find({
      drive: c.req.param("id"),
    })
      .populate("drive")
      .populate("user");

    return sendSuccess(c, 200, "Applied drives fetched successfully", drives);
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
  getAssignment,
  saveAssignmentSubmission,
  gradeAssignment,
  getAssignmentSubmission,
  getAppliedDrives,
};
