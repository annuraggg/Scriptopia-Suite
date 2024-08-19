import Drives from "../../../models/Drives";
import checkPermission from "../../../middlewares/checkPermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";

const getDrives = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drives = await Drives.find({ instituteId: perms.data!.instituteId });

    return sendSuccess(c, 200, "Drives fetched successfully", drives);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const getDrive = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drives.findById(c.req.param("id"));
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    return sendSuccess(c, 200, "Drive fetched successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createDrive = async (c: Context) => {
  try {
    const {
      title,
      location,
      skills,
      salary,
      applicationRange,
      qualifications,
      about,
    } = await c.req.json();

    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = new Drives({
      instituteId: perms.data!.instituteId,
      title,
      location,
      skills,
      salary,
      applicationRange,
      qualifications,
      about,
    });

    await drive.save();

    return sendSuccess(c, 201, "Drive created successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

const createWorkflow = async (c: Context) => {
  try {
    const { formattedData, _id } = await c.req.json();
    console.log("ID", _id);
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const drive = await Drives.findById(_id);
    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    drive.workflow = formattedData;
    await drive.save();

    return sendSuccess(c, 201, "Workflow created successfully", drive);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, "Something went wrong");
  }
};

export default { getDrives, getDrive, createDrive, createWorkflow };
