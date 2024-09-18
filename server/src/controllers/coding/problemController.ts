import { Context } from "hono";
import Problem from "../../models/Problem";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import Submission from "../../models/Submission";

const LIMIT_PER_PAGE = 20;

const getProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;

    const problems = await Problem.find()
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    const acceptanceRate = problems.map((problem) => {
      const problemsWithAcceptanceRate =
        problem.totalSubmissions > 0
          ? (problem.successfulSubmissions / problem.totalSubmissions) * 100
          : 0;
      return { ...problem, problemsWithAcceptanceRate };
    });

    return sendSuccess(c, 200, "Success", acceptanceRate);
  } catch (error) {
    console.error(error);
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

    const problemsWithAcceptanceRate = problems.map((problem) => {
      const acceptanceRate =
        problem.totalSubmissions > 0
          ? (problem.successfulSubmissions / problem.totalSubmissions) * 100
          : 0;
      return { ...problem, acceptanceRate };
    });

    return sendSuccess(c, 200, "Success", problemsWithAcceptanceRate);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
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
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getProblem = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("auth")?.userId;

    const problem = await Problem.findById(id).lean();
    if (!problem) {
      return sendSuccess(c, 404, "Problem not found");
    }

    if (!userId) return sendSuccess(c, 200, "Success", { problem });

    const submissions = await Submission.find({
      problem: id,
      user: userId,
    }).lean();

    return sendSuccess(c, 200, "Success", { problem, submissions });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const createProblem = async (c: Context) => {
  try {
    // @ts-ignore
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const body = await c.req.json();

    const problem = new Problem({
      ...body,
      author: auth.userId,
    });

    await problem.save();

    return sendSuccess(c, 200, "Success", problem);
  } catch (error: any) {
    console.error(error);
    if (error.name === "ValidationError") {
      return sendError(c, 400, "Invalid Data", error.message);
    }
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getProblems,
  getUserGeneratedProblems,
  getMyProblems,
  getProblem,
  createProblem,
};
