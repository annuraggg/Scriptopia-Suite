import Candidate from "@/models/Candidate";
import PlacementGroup from "@/models/PlacementGroup";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";

const getPlacementGroups = async (c: Context) => {
  try {
    const { _id } = c.get("auth");

    const page = parseInt(c.req.query("page") || "1");
    const limit = Math.min(parseInt(c.req.query("limit") || "10"), 50);
    const skip = (page - 1) * limit;

    const candidate = await Candidate.findOne({ userId: _id });

    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const totalCount = await PlacementGroup.countDocuments({
      institute: candidate.institute,
      candidates: { $in: [candidate._id] },
    });

    const groups = await PlacementGroup.find({
      institute: candidate.institute,
      candidates: { $in: [candidate._id] },
    })
      .populate("departments", "name")
      .populate("candidates", "name email")
      .populate("createdBy", "name email")
      .populate("pendingCandidates", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return sendSuccess(c, 200, "Placement groups fetched successfully", {
      groups,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit),
        limit,
      },
    });
  } catch (err) {
    console.error(
      "Error fetching placement groups:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return sendError(c, 500, "Failed to fetch placement groups");
  }
};

export default { getPlacementGroups };
