import Candidate from "@/models/Candidate";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";

const getCandidate = async (c: Context) => {
  try {
    const auth = c.get("auth");

    if (!auth) {
      return sendError(c, 401, "Unauthorized");
    }

    const candidate = await Candidate.findOne({ userId: auth.userId });
    console.log("candidate", candidate);

    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    return sendSuccess(c, 200, "Candidate Profile", candidate);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

const createCandidate = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const body = await c.req.json();

    if (!auth) {
      return sendError(c, 401, "Unauthorized");
    }

    const candidate = await Candidate.findOne({ userId: auth.userId });

    if (candidate) {
      return sendError(c, 400, "Candidate already exists");
    }

    const newCandidate = new Candidate({
      ...body,
      userId: auth.userId,
    });

    await newCandidate.save();

    return sendSuccess(c, 201, "Candidate Profile Created", newCandidate);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

const updateCandidate = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const body = await c.req.json();

    if (!auth) {
      return sendError(c, 401, "Unauthorized");
    }

    const candidate = await Candidate.findOne({ userId: auth.userId });
    console.log("userId ", auth.userId);
    console.log("candidate ", candidate);

    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const newCandidate = await Candidate.findOneAndUpdate(
      { userId: auth.userId },
      { $set: body },
      { new: true }
    );

    return sendSuccess(c, 200, "Candidate Profile Updated", newCandidate);
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

export default {
  getCandidate,
  createCandidate,
  updateCandidate,
};
