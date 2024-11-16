import Candidate from "@/models/Candidate";
import logger from "@/utils/logger";
import { sendError, sendSuccess } from "@/utils/sendResponse";
import { Context } from "hono";

const getProfile = async (c: Context) => {
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

export default {
  getProfile,
};
