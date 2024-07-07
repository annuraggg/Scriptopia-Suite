import { Context } from "hono";
import { sendError, sendSuccess } from "../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import Assessment from "../models/Assessment";

const LIMIT_PER_PAGE = 20;

const getAssessments = async (c: Context) => {
  try {
    console.log("REQ REC")
    const page = parseInt(c.req.param("page")) || 1;

    const assessments = await Assessment.find()
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const assessments = await Assessment.find({ author: auth.userId })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyLiveAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const assessments = await Assessment.find({
      author: auth.userId,
      type: "live",
    })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

// ! NEED TO BE REMADE AFTER CANDIDATE ASSESSMENT TAKEN SCHEMA IS MADE
// const getTakenAssessments = async (c: Context) => {
//   try {
//     const page = parseInt(c.req.param("page")) || 1;
//     const auth = getAuth(c);

//     if (!auth?.userId) {
//       return sendError(c, 401, "Unauthorized");
//     }

//     const assessments = await Assessment.find({
//       "candidates.candidates.email": auth.email,
//     })
//       .skip((page - 1) * LIMIT_PER_PAGE)
//       .limit(LIMIT_PER_PAGE)
//       .lean();

//     return sendSuccess(c, 200, "Success", assessments);
//   } catch (error) {
//     console.log(error);
//     return sendError(c, 500, "Internal Server Error", error);
//   }
// };

const getAssessment = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const assessment = await Assessment.findById(id).lean();
    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }
    return sendSuccess(c, 200, "Success", assessment);
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const createAssessment = async (c: Context) => {
  try {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const body = await c.req.parseBody();

    const assessment = new Assessment({
      ...body,
      author: auth.userId,
    });

    await assessment.save();

    return sendSuccess(c, 200, "Success", assessment);
  } catch (error: any) {
    console.log(error);
    if (error.name === "ValidationError") {
      return sendError(c, 400, "Invalid Data", error.message);
    }
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getAssessments,
  getMyAssessments,
  getMyLiveAssessments,
  getAssessment,
  createAssessment,
};
