import AppliedDrive from "@/models/AppliedDrive";
import Candidate from "@/models/Candidate";
import Drive from "@/models/Drive";
import Institute from "@/models/Institute";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";

const getDrives = async (c: Context) => {
  try {
    const authData = c.get("auth");
    const _id = authData?._id;

    if (!_id) {
      return sendError(c, 401, "Authentication required");
    }

    const page = parseInt(c.req.query("page") || "1", 10);
    const limit = Math.min(parseInt(c.req.query("limit") || "20", 10), 100);
    const skip = (page - 1) * limit;

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return sendError(c, 400, "Invalid pagination parameters");
    }

    const candidate = await Candidate.findOne({ userId: _id });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const institute = await Institute.findById(candidate?.institute).select(
      "departments"
    );

    if (!institute) {
      return sendError(c, 404, "Institute not found");
    }

    const totalDrives = await Drive.countDocuments({
      institute: candidate.institute,
      published: true,
    });

    const drivesFromDb = await Drive.find({
      institute: candidate.institute,
      published: true,
    })
      .select(
        "title company applicationRange url published publishedOn hasEnded description salary openings location type candidates"
      )
      .populate("company", "name logo")
      .sort({ publishedOn: -1 })
      .skip(skip)
      .limit(limit);

    const drives = [];

    for (const drive of drivesFromDb) {
      const driveData = drive.toObject();
      const appliedDrive = await AppliedDrive.findOne({
        candidate: candidate._id,
        drive: drive._id,
      });

      const status = appliedDrive?.status || "rejected";

      drives.push({
        drive: { ...driveData, candidates: undefined },
        status,
        totalCandidates: driveData.candidates.length,
      });
    }

    return sendSuccess(c, 200, "Drives fetched successfully", {
      drives,
      departments: institute?.departments || [],
      pagination: {
        total: totalDrives,
        page,
        pages: Math.ceil(totalDrives / limit),
        limit,
      },
    });
  } catch (e: any) {
    logger.error(`Error in getDrivesForCandidate: ${e.message}`);
    return sendError(c, 500, "Internal server error");
  }
};

const getDrive = async (c: Context) => {
  try {
    const authData = c.get("auth");
    const _id = authData?._id;

    if (!_id) {
      return sendError(c, 401, "Authentication required");
    }

    const driveId = c.req.param("id");

    if (!driveId) {
      return sendError(c, 400, "Drive ID is required");
    }

    const candidate = await Candidate.findOne({ userId: _id });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const drive = await Drive.findById(driveId)
      .populate("company", "name logo")
      .populate("institute", "name logo departments")
      .lean();

    if (!drive) {
      return sendError(c, 404, "Drive not found");
    }

    const appliedDrive = await AppliedDrive.findOne({
      candidate: candidate._id,
      drive: drive._id,
    });

    const status = appliedDrive?.status || "rejected";

    return sendSuccess(c, 200, "Drive fetched successfully", {
      drive: { ...drive, candidates: undefined },
      status,
    });
  } catch (e: any) {
    logger.error(`Error in getDriveForCandidate: ${e.message}`);
    return sendError(c, 500, "Internal server error");
  }
};

export default { getDrives, getDrive };
