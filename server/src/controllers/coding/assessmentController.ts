import { Context } from "hono";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import Assessment from "../../models/Assessment";
import Problem from "../../models/Problem";
import { runCode as runCompilerCode } from "../../aws/runCode";
import AssessmentSubmissions from "../../models/AssessmentSubmissions";
import AssessmentSubmissionsSchema from "../../@types/AssessmentSubmission";

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

const getMyMcqAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = devAuth ? global.auth : getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const assessments = await Assessment.find({
      author: auth.userId,
      type: "mcq",
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

const getMyCodeAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = devAuth ? global.auth : getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const assessments = await Assessment.find({
      author: auth.userId,
      type: "code",
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

const getMyMcqCodeAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = devAuth ? global.auth : getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const assessments = await Assessment.find({
      author: auth.userId,
      type: "mcqcode",
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

    const getTotalScore = async () => {
      let score = 0;
      const assessment = body;

      let mcqTotal = 0;
      assessment?.mcqs?.forEach((mcq: any) => {
        if (mcq.type === "text") {
          return;
        }
        mcqTotal += mcq.grade;
      });

      let problemTotal = 0;
      if (assessment.grading && assessment.grading.type === "testcase") {
        const problems = assessment.problems;
        for (const problem of problems) {
          const p = await Problem.findById(problem);
          if (!p) {
            return;
          }

          if (!assessment.grading.testcases) {
            return;
          }

          for (const testCase of p.testCases) {
            if (testCase.difficulty === "easy") {
              problemTotal += assessment.grading.testcases.easy;
            } else if (testCase.difficulty === "medium") {
              problemTotal += assessment.grading.testcases.medium;
            } else {
              problemTotal += assessment.grading.testcases.hard;
            }
          }
        }
      }

      if (assessment.grading && assessment.grading.type === "problem") {
        assessment?.grading?.problem?.forEach((problem: any) => {
          problemTotal += problem.points;
        });
      }

      score = mcqTotal + problemTotal;
      console.log("Obtainable Score " + score);
      return score;
    };

    const assessmentObj = {
      ...body,
      obtainableScore: await getTotalScore(),
      author: auth.userId,
    };

    console.log(assessmentObj);

    const newAssessment = new Assessment(assessmentObj);

    await newAssessment.save();

    return sendSuccess(c, 200, "Success", newAssessment);
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

    const assessmentStartTime = new Date(assessment.openRange.start).getTime();
    const assessmentEndTime = new Date(assessment.openRange.end).getTime();

    const currentTime = new Date().getTime();
    if (currentTime < assessmentStartTime) {
      return sendError(c, 403, "Assessment not started yet");
    }

    if (currentTime > assessmentEndTime) {
      return sendError(c, 403, "Assessment has ended");
    }

    const takenAssessment = await AssessmentSubmissions.findOne({
      assessmentId: body.id,
      email: body.email,
    });

    if (takenAssessment) {
      return sendError(c, 403, "You have already taken this assessment");
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

    // check if already submitted
    const existingSubmission = await AssessmentSubmissions.findOne({
      assessmentId,
      email,
    });

    if (existingSubmission) {
      return sendError(c, 400, "You have already submitted this assessment");
    }

    const problemResults = [];
    if (submissions) {
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

        const result: any = await runCompilerCode(
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
    }

    const mcqs: { mcqId: string; selectedOptions: string[] }[] = [];
    mcqSubmissions?.forEach((mcq: any) => {
      mcqs.push({
        mcqId: mcq.id,
        selectedOptions:
          typeof mcq.answer === "string" ? [mcq.answer] : mcq.answer,
      });
    });

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    const submission = {
      assessmentId,
      name,
      email,
      offenses,
      mcqSubmissions: mcqs,
      submissions: problemResults,
      timer,
      sessionRewindUrl,
    };

    const getCheatingStatus = (offenses: any) => {
      if (!offenses) {
        return "No Copying";
      }

      const total =
        (offenses.tabChange?.mcq || 0) +
        offenses.tabChange?.problem.reduce(
          (acc: any, curr: any) => acc + curr.times,
          0
        ) +
        offenses.copyPaste?.mcq +
        offenses.copyPaste?.problem.reduce(
          (acc: any, curr: any) => acc + curr.times,
          0
        );

      if (total === 0) {
        return "No Copying";
      }

      if (total <= 3) {
        return "Light Copying";
      }

      return "Heavy Copying";
    };

    const getScore = async () => {
      let total = 0;
      let mcq = [];
      let problem = [];

      for (const mcqSubmission of submission.mcqSubmissions) {
        let grade = 0;
        const mcqObj = assessment.mcqs.find((mcq) => {
          if (!mcq._id) return;
          console.log(mcq._id.toString() === mcqSubmission.mcqId);
          if (!mcq._id) return false;
          return mcq._id.toString() === mcqSubmission.mcqId;
        });

        if (!mcqObj) return;

        if (mcqObj.type === "multiple") {
          if (!mcqObj.mcq) return;
          if (mcqObj.mcq.correct === mcqSubmission.selectedOptions[0]) {
            grade = mcqObj.grade;
          }
        }

        if (mcqObj.type === "checkbox") {
          if (!mcqObj.checkbox) return;
          const correct = mcqObj.checkbox.correct;
          const selected = mcqSubmission.selectedOptions;

          if (
            correct.length === selected.length &&
            correct.every((value) => selected.includes(value))
          ) {
            grade = mcqObj.grade;
          }
        }

        mcq.push({
          mcqId: mcqSubmission.mcqId,
          obtainedMarks: grade,
        });
      }

      for (const problemSubmission of submission.submissions) {
        let grade = 0;

        const problemObj = assessment.problems.find(
          (problem) => problem._id.toString() === problemSubmission.problemId
        );

        if (!problemObj) return;
        if (!assessment.grading) return;

        if (assessment.grading.type === "testcase") {
          const problem = await Problem.findById(problemSubmission.problemId);
          if (!problem) return { mcq, problem, total };
          if (!assessment.grading.testcases) return { mcq, problem, total };

          for (const testCase of problem.testCases) {
            if (testCase.difficulty === "easy") {
              grade += assessment.grading.testcases.easy;
            } else if (testCase.difficulty === "medium") {
              grade += assessment.grading.testcases.medium;
            } else {
              grade += assessment.grading.testcases.hard;
            }
          }
        }

        if (assessment.grading.type === "problem") {
          const problemObj = assessment.grading.problem.find(
            (p) =>
              p.problemId?.toString() === problemSubmission.problemId.toString()
          );

          if (!problemObj) return;

          problemSubmission.results.forEach((result: any) => {
            if (!result.passed) {
              problem.push({
                problemId: problemSubmission.problemId,
                obtainedMarks: 0,
              });
              return;
            }
          });

          grade = problemObj.points;
        }

        problem.push({
          problemId: problemSubmission.problemId,
          obtainedMarks: grade,
        });
      }

      mcq.forEach((m) => {
        total += m.obtainedMarks;
      });

      problem.forEach((p) => {
        total += p.obtainedMarks;
      });

      return {
        mcq,
        problem,
        total,
      };
    };

    const grades = await getScore();
    const assessmentSubmission = {
      ...submission,
      cheatingStatus: getCheatingStatus(offenses),
      obtainedGrades: grades,
    };

    const newSubmission = new AssessmentSubmissions(assessmentSubmission);
    await newSubmission.save();

    return sendSuccess(c, 200, "Success");
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getAssessmentSubmissions = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const id = c.req.param("id");

    const assessment = await Assessment.findById(id).lean();
    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.author !== auth?.userId) {
      return sendError(c, 403, "Unauthorized");
    }

    const submissions = await AssessmentSubmissions.find({
      assessmentId: id,
    }).lean();

    const finalSubmissions = [];

    const getTimeUsed = (time: number) => {
      const totalTime = assessment.timeLimit * 60;
      const timeTaken = totalTime - time;
      return timeTaken;
    };

    const checkPassed = async (submission: any) => {
      const score = submission.obtainedGrades.total;
      const totalScore = assessment.obtainableScore;
      const passingPercentage = assessment.passingPercentage;
      const percentage = (score / totalScore) * 100;
      return percentage >= passingPercentage;
    };

    for (const submission of submissions) {
      finalSubmissions.push({
        _id: submission._id,
        name: submission.name,
        email: submission.email,
        timer: getTimeUsed(submission.timer),
        createdAt: submission.createdAt,
        cheating: submission.cheatingStatus,
        score: submission.obtainedGrades,
        passed: await checkPassed(submission),
      });
    }

    const qualified = finalSubmissions.filter((s) => s.passed === true).length;
    console.log("Qualified: " + qualified); 
    const totalSubmissions = finalSubmissions.length;
    const noCopy = finalSubmissions.filter(
      (s) => s.cheating === "No Copying"
    ).length;
    const lightCopy = finalSubmissions.filter(
      (s) => s.cheating === "Light Copying"
    ).length;
    const heavyCopy = finalSubmissions.filter(
      (s) => s.cheating === "Heavy Copying"
    ).length;

    const resObj = {
      totalSubmissions,
      qualified,
      cheating: {
        no: noCopy,
        light: lightCopy,
        heavy: heavyCopy,
      },
      submissions: finalSubmissions,
    };

    return sendSuccess(c, 200, "Success", resObj);
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getAssessmentSubmission = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const id = c.req.param("id");
    const submissionId = c.req.param("submissionId");

    const assessment = await Assessment.findById(id).populate("problems").lean();
    const submission = await AssessmentSubmissions.findById(
      submissionId
    ).lean();

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    console.log(assessment.author);
    console.log(auth?.userId);
    if (assessment.author !== auth?.userId) {
      return sendError(c, 403, "Unauthorized");
    }

    if (!submission) {
      return sendError(c, 404, "Submission not found");
    }

    return sendSuccess(c, 200, "Success", { submission, assessment });
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getAssessments,
  getMyMcqAssessments,
  getMyCodeAssessments,
  getMyMcqCodeAssessments,
  getAssessment,
  createAssessment,
  verifyAccess,
  submitAssessment,
  getAssessmentSubmissions,
  getAssessmentSubmission,
};
