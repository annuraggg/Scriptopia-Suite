import Institute from "../../../models/Institute";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import { Context } from "hono";
import clerkClient from "@/config/clerk";
import checkInstitutePermission from "../../../middlewares/checkInstitutePermission";
import PlacementGroup from "@/models/PlacementGroup";
const createPlacementGroup = async (c: Context) => {
  try {
    const { userId, _id } = c.get("auth");
    const body = await c.req.json();

    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const {
      name,
      academicYear,
      departments,
      purpose,
      expiryDate,
      accessType,
      candidates,
    } = body;

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return sendError(c, 403, "Unauthorized");
    }

    const instituteId = (clerkUser.publicMetadata.institute as any)?._id;
    console.log(clerkUser.publicMetadata);

    const group = await PlacementGroup.create({
      name,
      institute: instituteId,
      academicYear,
      departments,
      purpose,
      expiryDate,
      accessType,
      candidates,
      createdBy: _id,
    });

    await Institute.findByIdAndUpdate(instituteId, {
      $push: {
        placementGroups: group._id,
      },
    });

    await Institute.findByIdAndUpdate(instituteId, {
      $push: {
        auditLogs: {
          action: "create",
          userId: _id,
          user: clerkUser.fullName,
          type: "info",
        },
      },
    });

    return sendSuccess(c, 201, "Placement group created", group);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

const getPlacementGroups = async (c: Context) => {
  try {
    const { userId } = c.get("auth");
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return sendError(c, 403, "Unauthorized");
    }

    const instituteId = (clerkUser.publicMetadata.institute as any)?._id;

    const groups = await PlacementGroup.find({ institute: instituteId })
      .populate("departments")
      .populate("candidates")
      .populate("createdBy")
      .populate("pendingCandidates")
      .sort({ createdAt: -1 });

    return sendSuccess(c, 200, "Placement groups fetched", groups);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

const getPlacementGroup = async (c: Context) => {
  try {
    const { userId } = c.get("auth");
    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return sendError(c, 403, "Unauthorized");
    }

    const groupId = c.req.param("id");

    const group = await PlacementGroup.findById(groupId)
      .populate("departments")
      .populate("candidates")
      .populate("createdBy")
      .sort({ createdAt: -1 });

    if (!group) {
      return sendError(c, 404, "Placement group not found");
    }

    return sendSuccess(c, 200, "Placement group fetched", group);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

export default {
  createPlacementGroup,
  getPlacementGroups,
  getPlacementGroup,
};
