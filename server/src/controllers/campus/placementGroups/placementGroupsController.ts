import Institute from "../../../models/Institute";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import { Context } from "hono";
import clerkClient from "@/config/clerk";
import checkInstitutePermission from "../../../middlewares/checkInstitutePermission";
import PlacementGroup from "@/models/PlacementGroup";
import Candidate from "@/models/Candidate";

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

const joinPlacementGroup = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { _id } = c.get("auth");

    const user = await Candidate.findOne({ userId: _id });
    if (!user) {
      return sendError(c, 404, "User not found");
    }

    const institute = await Institute.findById(user.institute);
    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    if (!institute.candidates.includes(user._id)) {
      return sendError(c, 403, "Unauthorized");
    }

    const group = await PlacementGroup.findById(id);
    if (!group) {
      return sendError(c, 404, "Placement group not found");
    }

    if (group.candidates.includes(user._id)) {
      return sendError(c, 400, "Already a member of the group");
    }

    if (group.pendingCandidates.includes(user._id)) {
      return sendError(c, 400, "Already requested to join the group");
    }

    if (group.accessType === "public") {
      group.candidates.push(user._id);
      await group.save();
      return sendSuccess(c, 200, "Joined placement group", group);
    }
    if (group.accessType === "private") {
      group.pendingCandidates.push(user._id);
      await group.save();
      return sendSuccess(c, 200, "Request sent to join placement group", group);
    }
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

const acceptCandidate = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { _id } = c.get("auth");

    const user = await Candidate.findOne({ userId: _id });
    if (!user) {
      return sendError(c, 404, "User not found");
    }

    const group = await PlacementGroup.findById(id);
    if (!group) {
      return sendError(c, 404, "Placement group not found");
    }

    if (!group.pendingCandidates.includes(user._id)) {
      return sendError(c, 400, "Candidate not in pending list");
    }

    group.candidates.push(user._id);
    group.pendingCandidates = group.pendingCandidates.filter(
      (candidate) => candidate.toString() !== user._id.toString()
    );
    await group.save();

    return sendSuccess(c, 200, "Candidate accepted", group);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

const rejectCandidate = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const { _id } = c.get("auth");
    const user = await Candidate.findOne({ userId: _id });
    if (!user) {
      return sendError(c, 404, "User not found");
    }

    const group = await PlacementGroup.findById(id);
    if (!group) {
      return sendError(c, 404, "Placement group not found");
    }

    if (!group.pendingCandidates.includes(user._id)) {
      return sendError(c, 400, "Candidate not in pending list");
    }

    group.pendingCandidates = group.pendingCandidates.filter(
      (candidate) => candidate.toString() !== user._id.toString()
    );

    await group.save();
    return sendSuccess(c, 200, "Candidate rejected", group);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

const getCandidatePlacementGroups = async (c: Context) => {
  const { _id } = c.get("auth");

  try {
    const user = await Candidate.findOne({ userId: _id });
    if (!user) {
      return sendError(c, 404, "User not found");
    }

    const groups = await PlacementGroup.find({
      $or: [{ candidates: user._id }, { pendingCandidates: user._id }],
    })
      .populate("departments")
      .populate("candidates")
      .populate("createdBy")
      .sort({ createdAt: -1 });

    return sendSuccess(c, 200, "Placement groups fetched", groups);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

const updatePlacementGroup = async (c: Context) => {
  try {
    const { userId } = c.get("auth");
    const groupId = c.req.param("id");
    const body = await c.req.json();

    const perms = await checkInstitutePermission.all(c, ["manage_institute"]);
    if (!perms.allowed) {
      return sendError(c, 403, "Unauthorized");
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return sendError(c, 403, "Unauthorized");
    }

    const existingGroup = await PlacementGroup.findById(groupId);
    if (!existingGroup) {
      return sendError(c, 404, "Group not found");
    }

    existingGroup.name = body.name;
    existingGroup.academicYear = body.academicYear;
    existingGroup.departments = body.departments;
    existingGroup.purpose = body.purpose;
    existingGroup.expiryDate = body.expiryDate;
    existingGroup.accessType = body.accessType;

    existingGroup.candidates = [];
    existingGroup.candidates = body.candidates;

    await existingGroup.save();

    const updatedGroup = await PlacementGroup.findById(groupId)
      .populate("departments")
      .populate("candidates")
      .populate("createdBy");

    return sendSuccess(c, 200, "Group updated", updatedGroup);
  } catch (err) {
    console.error(err);
    return sendError(c, 500, "Internal server error", err);
  }
};

export default {
  createPlacementGroup,
  getPlacementGroups,
  getPlacementGroup,
  joinPlacementGroup,
  acceptCandidate,
  rejectCandidate,
  getCandidatePlacementGroups,
  updatePlacementGroup,
};
