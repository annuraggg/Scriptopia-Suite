import { Context } from "hono";
import { sendError, sendSuccess } from "../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import Assessment from "../models/Assessment";
import Problem from "../models/Problem";
import { runCode as runCompilerCode } from "../aws/runCode";
import AssessmentSubmissions from "../models/AssessmentSubmissions";

const LIMIT_PER_PAGE = 20;

const getAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;

    const assessments = await Assessment.find({ author: c.get("auth").userId })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    console.log(c.get("auth").userId);
    console.log(assessments);
    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = devAuth ? global.auth : getAuth(c);

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
    // @ts-ignore
    const auth = devAuth ? global.auth : getAuth(c);

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

    //for each problem id in the assessment, get the problem details
    const problems = await Problem.find({
      _id: { $in: assessment.problems },
    }).lean();

    return sendSuccess(c, 200, "Success", { assessment, problems });
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const createAssessment = async (c: Context) => {
  try {
    // @ts-ignore
    const auth = devAuth ? global.auth : getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const body = await c.req.json();
    console.log(body);

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

const verifyAccess = async (c: Context) => {
  try {
    const body = await c.req.json();

    const assessment = await Assessment.findOne({ _id: body.id });
    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.candidates.type === "all") {
      return sendSuccess(c, 200, "Access Granted", {
        instructions: assessment.instructions,
      });
    }

    const candidate = assessment.candidates.candidates.find(
      (candidate) => candidate.email === body.email
    );

    if (!candidate) {
      return sendError(c, 403, "You are not allowed to take this assessment");
    }

    return sendSuccess(c, 200, "Access Granted", {
      instructions: assessment.instructions,
    });
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const submitAssessment = async (c: Context) => {
  try {
    const body = await c.req.json();
    const {
      mcqSubmissions,
      submissions,
      assessmentId,
      offenses,
      timer,
      sessionRewindUrl,
      name,
      email,
    } = body;

    const problemResults = [];
    for (const submission of submissions) {
      const problem = await Problem.findById(submission.problemId);
      if (!problem) {
        return sendError(c, 404, "Problem not found");
      }

      const functionSchema = {
        functionName: problem.functionName,
        functionArgs: problem.functionArgs,
        functionBody: submission.code,
        functionReturn: problem.functionReturnType,
      };

      const result = await runCompilerCode(
        submission.language,
        functionSchema,
        problem.testCases
      );

      if (result?.status === "ERROR") {
        console.log(result.error);
        return sendError(c, 500, "Internal Server Error", result.error);
      }

      const r = result.results.map((r: any) => ({
        caseNo: r.caseNo,
        caseId: r._id,
        output: r.output,
        isSample: r.isSample,
        memory: r.memory,
        time: r.time,
        passed: r.passed,
        console: r.console,
      }));

      problemResults.push({
        problemId: submission.problemId,
        code: submission.code,
        language: submission.language,
        results: r,
      });
    }

    const mcqs: { mcqId: string; selectedOptions: string[] }[] = [];
    mcqSubmissions.forEach((mcq: any) => {
      mcqs.push({
        mcqId: mcq.id,
        selectedOptions:
          typeof mcq.answer === "string" ? [mcq.answer] : mcq.answer,
      });
    });

    const assessmentSubmission = {
      assessmentId,
      name,
      email,
      offenses,
      mcqSubmissions: mcqs,
      submissions: problemResults,
      timer,
      sessionRewindUrl,
    };

    const submission = new AssessmentSubmissions(assessmentSubmission);
    await submission.save();

    return sendSuccess(c, 200, "Success");
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getAssessments,
  getMyAssessments,
  getMyLiveAssessments,
  getAssessment,
  createAssessment,
  verifyAccess,
  submitAssessment,
};
