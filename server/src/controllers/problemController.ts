import { Context } from "hono";
import Problem from "../models/Problem";
import { sendError, sendSuccess } from "../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
const LIMIT_PER_PAGE = 20;

const getProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;

    const problems = await Problem.find()
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", problems);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getUserGeneratedProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;

    const problems = await Problem.find({
      author: { $ne: process.env.SCRIPTOPIA_USER_ID },
    })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", problems);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const problems = await Problem.find({ author: auth.userId })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", problems);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getProblem = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const problem = await Problem.findById(id).lean();
    if (!problem) {
      return sendSuccess(c, 404, "Problem not found");
    }
    return sendSuccess(c, 200, "Success", problem);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getProblems,
  getUserGeneratedProblems,
  getMyProblems,
  getProblem,
};
