import Institute from "../../../models/Institute";
import checkPermission from "../../../middlewares/checkInstitutePermission";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import logger from "../../../utils/logger";
import { Context } from "hono";
import mongoose from "mongoose";
import clerkClient from "@/config/clerk";
import { AuditLog } from "@shared-types/Institute";

const getPlacementGroups = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const formattedPlacementGroups = institute.placementGroups.map(group => ({
      _id: group._id?.toString(),
      name: group.name,
      startYear: group.startYear,
      endYear: group.endYear,
      departments: group.departments,
      purpose: group.purpose,
      expiryDate: group.expiryDate,
      expiryTime: group.expiryTime,
      accessType: group.accessType,
      archived: group.archived || false,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    }));

    const formattedDepartments = institute.departments.map(dept => ({
      id: dept._id?.toString(),
      name: dept.name
    }));

    logger.info(`Found ${formattedPlacementGroups.length} placement groups and ${formattedDepartments.length} departments`);

    return sendSuccess(c, 200, "Placement groups fetched successfully", {
      placementGroups: formattedPlacementGroups,
      departments: formattedDepartments,
    });
  } catch (e: any) {
    logger.error(`Error fetching placement groups: ${e.message}`);
    logger.error(e.stack);
    return sendError(c, 500, "Something went wrong");
  }
};

const getPlacementGroup = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["view_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const groupId = c.req.param("id");
    const placementGroup = institute.placementGroups.find(
      (group) => group._id?.toString() === groupId
    );

    if (!placementGroup) {
      return sendError(c, 404, "Placement group not found");
    }

    const formattedGroup = {
      _id: placementGroup._id?.toString(),
      name: placementGroup.name,
      startYear: placementGroup.startYear,
      endYear: placementGroup.endYear,
      departments: placementGroup.departments,
      purpose: placementGroup.purpose,
      expiryDate: placementGroup.expiryDate,
      expiryTime: placementGroup.expiryTime,
      accessType: placementGroup.accessType,
      archived: placementGroup.archived || false,
      createdAt: placementGroup.createdAt,
      updatedAt: placementGroup.updatedAt
    };

    return sendSuccess(c, 200, "Placement group fetched successfully", formattedGroup);
  } catch (e: any) {
    logger.error(`Error fetching placement group: ${e.message}`);
    logger.error(e.stack);
    return sendError(c, 500, "Something went wrong");
  }
};

const getPlacementGroupBySlug = async (c: Context) => {
  try {
    const slug = c.req.param("slug");
    const institute = await Institute.findOne({
      "placementGroups.name": { $regex: new RegExp(slug.replace(/-/g, " "), "i") }
    });

    if (!institute) {
      return sendError(c, 404, "Placement group not found");
    }

    const placementGroup = institute.placementGroups.find(
      (group) => group.name.toLowerCase().replace(/\s+/g, "-") === slug
    );

    if (!placementGroup) {
      return sendError(c, 404, "Placement group not found");
    }

    const formattedGroup = {
      _id: placementGroup._id?.toString(),
      name: placementGroup.name,
      startYear: placementGroup.startYear,
      endYear: placementGroup.endYear,
      departments: placementGroup.departments,
      purpose: placementGroup.purpose,
      expiryDate: placementGroup.expiryDate,
      expiryTime: placementGroup.expiryTime,
      accessType: placementGroup.accessType,
      archived: placementGroup.archived || false,
      createdAt: placementGroup.createdAt,
      updatedAt: placementGroup.updatedAt
    };

    return sendSuccess(c, 200, "Placement group fetched successfully", formattedGroup);
  } catch (e: any) {
    logger.error(`Error fetching placement group by slug: ${e.message}`);
    logger.error(e.stack);
    return sendError(c, 500, "Something went wrong");
  }
};

const createPlacementGroup = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const groupData = await c.req.json();
    const { name, startYear, endYear, departments, purpose, expiryDate, expiryTime, accessType } = groupData;

    if (!name || !startYear || !endYear || !departments || !purpose || !expiryDate || !expiryTime || !accessType) {
      return sendError(c, 400, "Missing required fields");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const existingGroup = institute.placementGroups.find(
      (group) => group.name.toLowerCase() === name.toLowerCase()
    );

    if (existingGroup) {
      return sendError(c, 400, "A placement group with this name already exists");
    }

    const newPlacementGroup = {
      _id: new mongoose.Types.ObjectId(),
      name,
      startYear,
      endYear,
      departments,
      purpose,
      expiryDate,
      expiryTime,
      accessType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    institute.placementGroups.push(newPlacementGroup);
    await institute.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Created new placement group: ${name}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 201, "Placement group created successfully", newPlacementGroup);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, `Error creating placement group: ${e.message}`);
  }
};

const updatePlacementGroup = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const groupData = await c.req.json();
    const { _id, name, startYear, endYear, departments, purpose, expiryDate, expiryTime, accessType } = groupData;

    if (!_id) {
      return sendError(c, 400, "Group ID is required");
    }

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const groupIndex = institute.placementGroups.findIndex(
      (group) => group._id?.toString() === _id
    );

    if (groupIndex === -1) {
      return sendError(c, 404, "Placement group not found");
    }

    if (name && name !== institute.placementGroups[groupIndex].name) {
      const existingGroup = institute.placementGroups.find(
        (group) => group.name.toLowerCase() === name.toLowerCase() && group._id?.toString() !== _id
      );

      if (existingGroup) {
        return sendError(c, 400, "A placement group with this name already exists");
      }
    }

    if (name) institute.placementGroups[groupIndex].name = name;
    if (startYear) institute.placementGroups[groupIndex].startYear = startYear;
    if (endYear) institute.placementGroups[groupIndex].endYear = endYear;
    if (departments) institute.placementGroups[groupIndex].departments = departments;
    if (purpose) institute.placementGroups[groupIndex].purpose = purpose;
    if (expiryDate) institute.placementGroups[groupIndex].expiryDate = expiryDate;
    if (expiryTime) institute.placementGroups[groupIndex].expiryTime = expiryTime;
    if (accessType) institute.placementGroups[groupIndex].accessType = accessType;

    institute.placementGroups[groupIndex].updatedAt = new Date();

    await institute.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Updated placement group: ${institute.placementGroups[groupIndex].name}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 200, "Placement group updated successfully", institute.placementGroups[groupIndex]);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, `Error updating placement group: ${e.message}`);
  }
};

const archivePlacementGroup = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive "]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const { id } = await c.req.json();

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const groupIndex = institute.placementGroups.findIndex(
      (group) => group._id?.toString() === id
    );

    if (groupIndex === -1) {
      return sendError(c, 404, "Placement group not found");
    }

    institute.placementGroups[groupIndex].archived = !institute.placementGroups[groupIndex].archived;
    institute.placementGroups[groupIndex].updatedAt = new Date();

    await institute.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const status = institute.placementGroups[groupIndex].archived ? "Archived" : "Unarchived";
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `${status} placement group: ${institute.placementGroups[groupIndex].name}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 200, `Placement group ${status.toLowerCase()} successfully`, institute.placementGroups[groupIndex]);
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, `Error archiving placement group: ${e.message}`);
  }
};

const deletePlacementGroup = async (c: Context) => {
  try {
    const perms = await checkPermission.all(c, ["manage_drive"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const groupId = c.req.param("id");

    const institute = await Institute.findById(perms.data?.institute?._id);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const groupIndex = institute.placementGroups.findIndex(
      (group) => group._id?.toString() === groupId
    );

    if (groupIndex === -1) {
      return sendError(c, 404, "Placement group not found");
    }

    const groupName = institute.placementGroups[groupIndex].name;

    institute.placementGroups.splice(groupIndex, 1);
    await institute.save();

    const clerkUser = await clerkClient.users.getUser(c.get("auth").userId);
    const auditLog: AuditLog = {
      user: clerkUser.firstName + " " + clerkUser.lastName,
      userId: clerkUser.id,
      action: `Deleted placement group: ${groupName}`,
      type: "info",
    };

    await Institute.findByIdAndUpdate(perms.data?.institute?._id, {
      $push: { auditLogs: auditLog },
    });

    return sendSuccess(c, 200, "Placement group deleted successfully");
  } catch (e: any) {
    logger.error(e);
    return sendError(c, 500, `Error deleting placement group: ${e.message}`);
  }
};

export default {
  getPlacementGroups,
  getPlacementGroup,
  getPlacementGroupBySlug,
  createPlacementGroup,
  updatePlacementGroup,
  archivePlacementGroup,
  deletePlacementGroup,
};