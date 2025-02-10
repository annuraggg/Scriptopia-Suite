import { Context } from "hono";
import Problem from "../../models/Problem";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import Submission from "../../models/Submission";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import mongoose from "mongoose";

const LIMIT_PER_PAGE = 20;

const getProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = c.get("auth");
    const userId = auth?._id;

    const problems = await Problem.find()
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    let userSolvedProblems: string[] = [];
    if (userId) {
      // Get all successful submissions for the user
      const successfulSubmissions = await Submission.distinct("problem", {
        user: userId,
        status: "SUCCESS",
      });
      userSolvedProblems = successfulSubmissions
        .filter(
          (submission): submission is mongoose.Types.ObjectId =>
            submission !== null
        )
        .map((submission) => submission.toString());
    }

    const problemsWithStatus = problems.map((problem) => {
      const acceptanceRate =
        problem.totalSubmissions > 0
          ? (problem.successfulSubmissions / problem.totalSubmissions) * 100
          : 0;

      return {
        ...problem,
        acceptanceRate,
        solved: userId
          ? userSolvedProblems.includes(problem._id.toString())
          : false,
      };
    });

    return sendSuccess(c, 200, "Success", problemsWithStatus);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getUserGeneratedProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = c.get("auth");
    const userId = auth?._id;

    const problems = await Problem.find({
      author: { $ne: process.env.SCRIPTOPIA_USER_ID },
    })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    let userSolvedProblems: string[] = [];
    if (userId) {
      const successfulSubmissions = await Submission.distinct("problem", {
        user: userId,
        status: "SUCCESS",
      });
      userSolvedProblems = successfulSubmissions
        .filter(
          (submission): submission is mongoose.Types.ObjectId =>
            submission !== null && submission !== undefined
        )
        .map((submission) => submission.toString());
    }

    const problemsWithStatus = problems.map((problem) => {
      const acceptanceRate =
        problem.totalSubmissions > 0
          ? (problem.successfulSubmissions / problem.totalSubmissions) * 100
          : 0;

      return {
        ...problem,
        acceptanceRate,
        solved: userId
          ? userSolvedProblems.includes(problem._id.toString())
          : false,
      };
    });

    return sendSuccess(c, 200, "Success", problemsWithStatus);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyProblems = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = c.get("auth");

    if (!auth?._id) {
      return sendError(c, 401, "Unauthorized");
    }

    const problems = await Problem.find({ author: auth?._id })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    const successfulSubmissions = await Submission.distinct("problem", {
      user: auth?._id,
      status: "SUCCESS",
    });

    const problemsWithStatus = problems.map((problem) => {
      const acceptanceRate =
        problem.totalSubmissions > 0
          ? (problem.successfulSubmissions / problem.totalSubmissions) * 100
          : 0;

      return {
        ...problem,
        acceptanceRate,
        solved: successfulSubmissions.includes(problem._id),
      };
    });

    return sendSuccess(c, 200, "Success", problemsWithStatus);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getProblem = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("auth")?._id;

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
    const auth = c.get("auth");

    if (!auth?._id) {
      return sendError(c, 401, "Unauthorized");
    }

    const body = await c.req.json();

    const problem = new Problem({
      ...body,
      isPrivate: auth?._id === process.env.SCRIPTOPIA_USER_ID ? false : true,
      author: auth._id,
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

const MODEL_NAME = "gemini-1.5-flash-8b";
const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
  stopSequences: ["Note"],
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const explain = async (c: Context) => {
  const { code } = await c.req.json();
  const appendTemplate = "Just Explain the Following Code DO NOT COMPLETE IT: ";

  try {
    if (code) {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const result = await chat.sendMessage(`${appendTemplate} ${code}`);
      const response = result.response;
      const toText = response.text();

      return sendSuccess(c, 200, "Success", toText);
    }
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const deleteProblem = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("auth")?._id;

    if (!userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const problem = await Problem.findOneAndDelete({
      _id: id,
      author: userId,
    });

    if (!problem) {
      return sendError(c, 404, "Problem not found");
    }

    return sendSuccess(c, 200, "Success", problem);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getProblems,
  getUserGeneratedProblems,
  getMyProblems,
  getProblem,
  createProblem,
  explain,
  deleteProblem,
};
