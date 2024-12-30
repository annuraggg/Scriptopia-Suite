import { Context } from "hono";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import { getAuth } from "@hono/clerk-auth";
import Assessment from "../../models/Assessment";
import Problem from "../../models/Problem";
import { runCode as runCompilerCode } from "../../aws/runCode";
import AssessmentSubmissions from "../../models/AssessmentSubmissions";
import { TestCase } from "@shared-types/Problem";
import Posting from "@/models/Posting";
import { Candidate } from "@shared-types/Candidate";
import CandidateModel from "@/models/Candidate";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import logger from "@/utils/logger";
import MCQAssessment from "@/models/MCQAssessment";
import CodeAssessment from "@/models/CodeAssessment";

import { CodeAssessment as ICodeAssessment } from "@shared-types/CodeAssessment";
import { MCQAssessment as IMCQAssessment } from "@shared-types/MCQAssessment";
import MCQAssessmentSubmissions from "@/models/MCQAssessmentSubmission";
import CodeAssessmentSubmissions from "@/models/CodeAssessmentSubmission";
import mongoose from "mongoose";

import calculateMCQScore from "@/utils/calculateMCQScore";
import calculateCodeScore from "@/utils/calculateCodeScore";

import { MCQAssessmentSubmissionsSchema as IMCQAssessmentSubmission } from "@shared-types/MCQAssessmentSubmission";

async function getIoServer() {
  const { ioServer } = await import("@/config/init");
  return ioServer;
}

const LIMIT_PER_PAGE = 20;

const getAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;

    const assessments = await Assessment.find({ author: c.get("auth").userId })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyMcqAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    const isEnterprise = c.req.param("enterprise") === "enterprise";
    const postingId = c.req.param("postingId");

    // @ts-ignore
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    let assessments = [];
    if (isEnterprise) {
      assessments = await Assessment.find({
        isEnterprise: true,
        postingId: postingId,
        type: "mcq",
      });
    } else {
      assessments = await Assessment.find({
        author: auth.userId,
        type: "mcq",
      })
        .skip((page - 1) * LIMIT_PER_PAGE)
        .limit(LIMIT_PER_PAGE)
        .lean();
    }

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyCodeAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    const isEnterprise = c.req.param("enterprise") === "enterprise";
    const postingId = c.req.param("postingId");

    // @ts-ignore
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }
    let assessments = [];
    if (isEnterprise) {
      assessments = await Assessment.find({
        isEnterprise: true,
        postingId: postingId,
        type: "code",
      });
    } else {
      assessments = await Assessment.find({
        author: auth.userId,
        type: "code",
      })
        .skip((page - 1) * LIMIT_PER_PAGE)
        .limit(LIMIT_PER_PAGE)
        .lean();
    }

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMyMcqCodeAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    const isEnterprise = c.req.param("enterprise") === "enterprise";
    const postingId = c.req.param("postingId");
    // @ts-ignore
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    let assessments = [];
    if (isEnterprise) {
      assessments = await Assessment.find({
        isEnterprise: true,
        postingId: postingId,
        type: "mcqcode",
      });
    } else {
      assessments = await Assessment.find({
        author: auth.userId,
        type: "mcqcode",
      })
        .skip((page - 1) * LIMIT_PER_PAGE)
        .limit(LIMIT_PER_PAGE)
        .lean();
    }

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const checkProblemDependencies = async (c: Context) => {
  try {
    const problemId = c.req.param("problemId");

    const assessments = await Assessment.find({
      problems: problemId,
      type: { $in: ["code", "mcqcode"] },
    })
      .select("name type openRange")
      .lean();

    return sendSuccess(c, 200, "Success", { assessments });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getTakenAssessments = async (c: Context) => {
  try {
    const page = parseInt(c.req.param("page")) || 1;
    // @ts-ignore
    const auth = getAuth(c);

    if (!auth?.userId) {
      return sendError(c, 401, "Unauthorized");
    }

    const submissions = await AssessmentSubmissions.find({
      userId: auth.userId,
    })
      .sort({ submittedAt: -1 })
      .skip((page - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE)
      .lean();

    const assessmentIds = submissions.map((sub) => sub.assessmentId);
    const assessments = await Assessment.find({
      _id: { $in: assessmentIds },
    }).lean();

    const takenAssessments = submissions.map((submission) => {
      const assessment = assessments.find(
        (a) => a._id.toString() === submission.assessmentId.toString()
      );
      return {
        ...assessment,
        submissionDetails: {
          score: submission.obtainedGrades?.total ?? 0,
          status: submission.status,
          timeSpent: submission.timer,
        },
      };
    });

    return sendSuccess(c, 200, "Success", takenAssessments);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

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
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const createAssessment = async (c: Context) => {
  try {
    // @ts-ignore
    const auth = getAuth(c);

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

      return score;
    };

    const assessmentObj = {
      ...body,
      obtainableScore: await getTotalScore(),
      author: auth.userId,
    };

    const newAssessment = new Assessment(assessmentObj);

    await newAssessment.save();

    return sendSuccess(c, 200, "Success", newAssessment);
  } catch (error: any) {
    console.error(error);
    if (error.name === "ValidationError") {
      return sendError(c, 400, "Invalid Data", error.message);
    }
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const codeSubmit = async (c: Context) => {
  try {
    const { assessmentId, email, timer } = await c.req.json();
    const assessment = await CodeAssessment.findById(assessmentId).populate(
      "problems"
    );

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    const submission = await CodeAssessmentSubmissions.findOne({
      assessmentId,
      email,
    });

    if (!submission) {
      return sendError(c, 404, "Submission not found");
    }

    const grades = calculateCodeScore(
      // @ts-expect-error - TS doesn't know that the obtainedGrades field is added in the schema
      submission?.submissions || [],
      assessment
    );

    // @ts-ignore
    submission.obtainedGrades = grades;
    submission.timer = timer;
    submission.status = "completed";

    await submission.save();

    return sendSuccess(c, 200, "Success", grades);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const deleteAssessment = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const auth = c.get("auth");

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.author !== auth?.userId) {
      return sendError(c, 403, "Unauthorized");
    }

    await Assessment.findByIdAndDelete(id);
    return sendSuccess(c, 200, "Assessment deleted successfully");
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getAssessmentSubmissions = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const id = c.req.param("id");
    const postingId = c.req.param("postingId");

    const assessment = await Assessment.findById(id).lean();
    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.isEnterprise && postingId) {
      if (assessment?.postingId?.toString() !== postingId) {
        return sendError(c, 403, "Unauthorized in Posts");
      }
    } else {
      if (assessment.author !== auth?.userId) {
        return sendError(c, 403, "Unauthorized");
      }
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
      const score = submission?.obtainedGrades?.total || 0;
      const totalScore = assessment.obtainableScore;
      const passingPercentage = assessment.passingPercentage;
      const percentage = (score / totalScore) * 100;
      return percentage >= passingPercentage;
    };

    if (!postingId) {
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
    } else {
      for (const submission of submissions) {
        const posting = await Posting.findById(postingId).populate(
          "candidates"
        );

        if (!posting) {
          return sendError(c, 404, "Posting not found");
        }

        const candidate = (posting.candidates as unknown as Candidate[]).find(
          (candidate) => candidate.email === submission.email
        );

        if (!candidate) {
          return sendError(c, 404, "Candidate not found");
        }

        const status = candidate.appliedPostings.find(
          (ap) => ap.postingId.toString() === postingId
        )?.currentStepStatus;

        finalSubmissions.push({
          _id: submission._id,
          name: submission.name,
          email: submission.email,
          timer: getTimeUsed(submission.timer),
          createdAt: submission.createdAt,
          cheating: submission.cheatingStatus,
          score: submission.obtainedGrades,
          passed: await checkPassed(submission),
          status: status,
        });
      }
    }

    const qualified = finalSubmissions.filter((s) => s.passed === true).length;

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
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getAssessmentSubmission = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const id = c.req.param("id");
    const submissionId = c.req.param("submissionId");
    const postingId = c.req.param("postingId");

    const assessment = await Assessment.findById(id)
      .populate("problems")
      .lean();
    const submission = await AssessmentSubmissions.findById(
      submissionId
    ).lean();

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.isEnterprise && postingId) {
      if (assessment?.postingId?.toString() !== postingId) {
        return sendError(c, 403, "Unauthorized in Posts");
      }
    } else {
      if (assessment.author !== auth?.userId) {
        return sendError(c, 403, "Unauthorized");
      }
    }

    if (!submission) {
      return sendError(c, 404, "Submission not found");
    }

    return sendSuccess(c, 200, "Success", { submission, assessment });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const qualifyCandidate = async (c: Context) => {
  try {
    const { email, postingId } = await c.req.json();
    console.log(email, postingId);
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const candidate = await CandidateModel.findOne({ email });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.postingId.toString() === postingId
    );

    if (!appliedPosting) {
      return sendError(c, 404, "Candidate not applied to this posting");
    }

    appliedPosting.status = "inprogress";
    appliedPosting.currentStepStatus = "qualified";
    await candidate.save();

    return sendSuccess(c, 200, "Success");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const disqualifyCandidate = async (c: Context) => {
  try {
    const { email, postingId } = await c.req.json();
    const perms = await checkOrganizationPermission.all(c, ["view_job"]);
    if (!perms.allowed) {
      return sendError(c, 401, "Unauthorized");
    }

    const posting = await Posting.findOne({ _id: postingId }).populate(
      "organizationId"
    );

    if (!posting) {
      return sendError(c, 404, "Posting not found");
    }

    const candidate = await CandidateModel.findOne({ email });
    if (!candidate) {
      return sendError(c, 404, "Candidate not found");
    }

    const appliedPosting = candidate.appliedPostings.find(
      (ap) => ap.postingId.toString() === postingId
    );

    if (!appliedPosting) {
      return sendError(c, 404, "Candidate not applied to this posting");
    }

    const step = posting.workflow?.currentStep;

    appliedPosting.status = "rejected";
    appliedPosting.currentStepStatus = "disqualified";
    appliedPosting.disqualifiedStage = step;
    appliedPosting.disqualifiedReason = "Disqualified at Assessment Round";

    await candidate.save();

    return sendSuccess(c, 200, "Success");
  } catch (err) {
    logger.error(err as string);
    return sendError(c, 500, "Internal server error");
  }
};

const submitIndividualProblem = async (c: Context) => {
  try {
    const data = await c.req.json();
    const problem = await Problem.findById(data.problemId);
    if (!problem) {
      return;
    }

    const result = await runCompilerCode(
      data.language,
      problem.sdsl,
      data.code,
      problem.testCases as unknown as TestCase[]
    );

    if (result?.status === "ERROR") {
      console.error(result.error);
      return;
    }

    const r = result?.results?.map((r: any) => ({
      caseNo: r?.caseNo,
      caseId: r?._id,
      output: r?.output,
      isSample: r?.isSample,
      memory: r?.memory,
      time: r?.time,
      passed: r?.passed,
      console: r?.console,
    }));

    const submission = await CodeAssessmentSubmissions.findOne({
      email: data?.email,
      assessmentId: data?.assessmentId,
    });

    if (!submission) {
      return;
    }

    const problemSubmission = {
      problemId: data?.problemId,
      code: data?.code,
      language: data?.language,
      results: r,
    };

    // @ts-ignore - replace the existing submission with the new one or add a new one
    const existingSubmission = submission.submissions.find(
      (s) => s?.problemId?.toString() === data?.problemId
    );

    if (existingSubmission) {
      existingSubmission.code = data?.code;
      existingSubmission.language = data?.language;
      existingSubmission.results = r;
    } else {
      // @ts-ignore
      submission.submissions.push(problemSubmission);
    }

    await submission.save();

    return sendSuccess(c, 200, "Success", submission);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error as string);
  }
};

getIoServer().then((server) => {
  server.on("connection", (socket) => {
    logger.info("A user connected with id: " + socket.id);
    socket.on("disconnect", () => {
      logger.info("User disconnected");
    });

    socket.on("start-code-assessment", async (data) => {
      const newSubmission = new CodeAssessmentSubmissions(data);
      newSubmission.status = "in-progress";
      await newSubmission.save();
    });

    socket.on("start-mcq-assessment", async (data) => {
      const newSubmission = new MCQAssessmentSubmissions(data);
      newSubmission.status = "in-progress";
      await newSubmission.save();
    });

    socket.on("timeSync-code", async (data) => {
      const submission = await CodeAssessmentSubmissions.findOne({
        email: data.email,
        assessmentId: data.assessmentId,
      });

      if (!submission) {
        return;
      }

      if (submission.status === "completed") {
        return;
      }

      submission.timer = data.time;
      await submission.save();
    });

    socket.on("timeSync-mcq", async (data) => {
      const submission = await MCQAssessmentSubmissions.findOne({
        email: data.email,
        assessmentId: data.assessmentId,
      });

      if (!submission) {
        return;
      }

      if (submission.status === "completed") {
        return;
      }

      submission.timer = data.time;
      await submission.save();
    });

    socket.on("tab-change-code", async ({ assessmentId, email, problem }) => {
      if (!assessmentId || !email || !problem) return;

      const submission = await CodeAssessmentSubmissions.findOne({
        email,
        assessmentId,
      });

      if (!submission) return;

      if (!submission?.offenses) {
        submission.offenses = {};
      }

      if (!submission?.offenses?.tabChange) {
        submission.offenses.tabChange = new mongoose.Types.DocumentArray([]);
      }

      const { tabChange } = submission.offenses;

      const problemEntry = tabChange?.find(
        (p) => p?.problemId?.toString() === problem.toString()
      );

      if (problemEntry) {
        problemEntry.times = (problemEntry.times || 0) + 1;
      } else {
        tabChange?.push({ problemId: problem, times: 1 });
      }

      await submission.save();
    });

    socket.on("tab-change-mcq", async ({ assessmentId, email }) => {
      if (!assessmentId || !email) return;
      console.log("Received Tab Change Offence for MCQ Assessment");

      const submission = await MCQAssessmentSubmissions.findOne({
        email,
        assessmentId,
      });

      if (!submission) return;

      if (!submission?.offenses) {
        submission.offenses = {};
      }

      if (!submission?.offenses?.tabChange) {
        submission.offenses.tabChange = 0;
      }

      submission.offenses.tabChange += 1;
      await submission.save();
    });

    socket.on(
      "external-paste-code",
      async ({ assessmentId, email, problem }) => {
        if (!assessmentId || !email || !problem) return;
        console.log("Received Copy Paste Offence for Code Assessment");

        const submission = await CodeAssessmentSubmissions.findOne({
          email,
          assessmentId,
        });

        if (!submission) return;

        if (!submission?.offenses) {
          submission.offenses = {};
        }

        if (!submission?.offenses?.copyPaste) {
          submission.offenses.copyPaste = new mongoose.Types.DocumentArray([]);
        }

        const { copyPaste } = submission.offenses;

        const problemEntry = copyPaste?.find(
          (p) => p?.problemId?.toString() === problem.toString()
        );

        if (problemEntry) {
          problemEntry.times = (problemEntry.times || 0) + 1;
        } else {
          copyPaste?.push({ problemId: problem, times: 1 });
        }

        await submission.save();
      }
    );

    socket.on("external-paste-mcq", async ({ assessmentId, email, mcq }) => {
      if (!assessmentId || !email || !mcq) return;

      const submission = await MCQAssessmentSubmissions.findOne({
        email,
        assessmentId,
      });

      if (!submission) return;

      if (!submission?.offenses) {
        submission.offenses = {};
      }

      if (!submission?.offenses?.copyPaste) {
        submission.offenses.copyPaste = 0;
      }

      submission.offenses.copyPaste += 1;
      await submission.save();
    });

    socket.on(
      "session-url-code",
      async ({ assessmentId, email, sessionUrl }) => {
        if (!assessmentId || !email || !sessionUrl) return;

        const submission = await CodeAssessmentSubmissions.findOne({
          email,
          assessmentId,
        });

        if (!submission) return;

        submission.sessionRewindUrl = sessionUrl;
        await submission.save();
      }
    );

    socket.on(
      "session-url-mcq",
      async ({ assessmentId, email, sessionUrl }) => {
        if (!assessmentId || !email || !sessionUrl) return;

        const submission = await MCQAssessmentSubmissions.findOne({
          email,
          assessmentId,
        });

        if (!submission) return;

        submission.sessionRewindUrl = sessionUrl;
        await submission.save();
      }
    );

    socket.on("auto-save-mcq", async ({ assessmentId, email, submissions }) => {
      if (!assessmentId || !email || !submissions) return;

      const submission = await MCQAssessmentSubmissions.findOne({
        email,
        assessmentId,
      });

      if (!submission) return;

      if (!submission.mcqSubmissions) {
        submission.mcqSubmissions = new mongoose.Types.DocumentArray([]);
      }

      submission.mcqSubmissions = submissions;

      await submission.save();
    });
  });
});

const createMcqAssessment = async (c: Context) => {
  try {
    const body = await c.req.json();
    const userid = c.get("auth")?.userId;

    if (!userid) {
      return sendError(c, 401, "Unauthorized");
    }

    // calculate total obtainable score
    let totalScore = 0;
    const assessment: IMCQAssessment = body;

    assessment.sections.forEach((section) => {
      section.questions.forEach((question) => {
        totalScore += question?.grade || 0;
      });
    });

    const assessmentObj = {
      ...body,
      author: userid,
      obtainableScore: totalScore,
    };

    const newAssessment = new MCQAssessment(assessmentObj);
    await newAssessment.save();

    return sendSuccess(c, 200, "Success", newAssessment);
  } catch (error: any) {
    console.error(error);
    if (error.name === "ValidationError") {
      return sendError(c, 400, "Invalid Data", error.message);
    }
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const createCodeAssessment = async (c: Context) => {
  try {
    const body = await c.req.json();
    const userid = c.get("auth")?.userId;

    if (!userid) {
      return sendError(c, 401, "Unauthorized");
    }

    // calculate total obtainable score
    let totalScore = 0;
    const assessment: ICodeAssessment = body;
    const gradingType = assessment.grading.type;

    if (gradingType === "testcase") {
      const problems = assessment.problems;
      for (const problem of problems) {
        const p = await Problem.findById(problem).select("testCases").lean();
        if (!p) {
          return sendError(c, 404, "Problem not found");
        }

        if (!assessment.grading.testcases) {
          return sendError(c, 400, "Grading not found");
        }

        for (const testCase of p.testCases) {
          if (testCase.difficulty === "easy") {
            totalScore += assessment.grading.testcases.easy;
          } else if (testCase.difficulty === "medium") {
            totalScore += assessment.grading.testcases.medium;
          } else {
            totalScore += assessment.grading.testcases.hard;
          }
        }
      }
    }

    if (gradingType === "problem") {
      assessment?.grading?.problem?.forEach((problem: any) => {
        totalScore += problem.points;
      });
    }

    const assessmentObj = {
      ...body,
      author: userid,
      obtainableScore: totalScore,
    };

    const newAssessment = new CodeAssessment(assessmentObj);
    await newAssessment.save();

    return sendSuccess(c, 200, "Success", newAssessment);
  } catch (error: any) {
    console.error(error);
    if (error.name === "ValidationError") {
      return sendError(c, 400, "Invalid Data", error.message);
    }
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getMcqAssessment = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const assessment = await MCQAssessment.findById(id).lean();
    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    return sendSuccess(c, 200, "Success", assessment);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getCodeAssessment = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const assessment = await CodeAssessment.findById(id).lean();
    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    return sendSuccess(c, 200, "Success", assessment);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const deleteMcqAssessment = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const auth = c.get("auth");

    const assessment = await MCQAssessment.findById(id);

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.author !== auth?.userId) {
      return sendError(c, 403, "Unauthorized");
    }

    await MCQAssessment.findByIdAndDelete(id);
    return sendSuccess(c, 200, "Assessment deleted successfully");
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const deleteCodeAssessment = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const auth = c.get("auth");

    const assessment = await CodeAssessment.findById(id);

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.author !== auth?.userId) {
      return sendError(c, 403, "Unauthorized");
    }

    await CodeAssessment.findByIdAndDelete(id);
    return sendSuccess(c, 200, "Assessment deleted successfully");
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getCreatedCodeAssessments = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const assessments = await CodeAssessment.find({ author: auth?.userId });

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getCreatedMcqAssessments = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const assessments = await MCQAssessment.find({ author: auth?.userId });

    return sendSuccess(c, 200, "Success", assessments);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const verifyAccess = async (c: Context) => {
  try {
    const body = await c.req.json();

    const [result1, result2] = await Promise.all([
      CodeAssessment.findOne({ _id: body.id }).populate("problems").lean(),
      MCQAssessment.findOne({ _id: body.id }).lean(),
    ]);

    const assessment = result1 || result2;

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    if (assessment.isEnterprise) {
      const posting = await Posting.findOne({
        _id: assessment.postingId,
      }).populate("candidates");
      if (!posting) {
        return sendError(c, 404, "Posting not found");
      }

      const workflow = posting.workflow;
      if (!workflow) {
        return sendError(c, 400, "No workflow found");
      }

      const currentStep = workflow.steps[workflow.currentStep];
      if (currentStep?.stepId?.toString() !== assessment._id.toString()) {
        return sendError(c, 403, "Assessment not active", {
          allowedForTest: false,
          testActive: false,
        });
      }

      const candidates = posting.candidates as unknown as Candidate[];
      if (!candidates.some((candidate) => candidate.email === body.email)) {
        return sendError(
          c,
          403,
          "You are not allowed to take this assessment",
          {
            allowedForTest: false,
            testActive: true,
          }
        );
      }
    } else {
      const assessmentStartTime = new Date(
        assessment?.openRange?.start!
      ).getTime();
      const assessmentEndTime = new Date(assessment?.openRange?.end!).getTime();

      const currentTime = new Date().getTime();
      if (currentTime < assessmentStartTime) {
        return sendError(c, 403, "Assessment not started yet", {
          allowedForTest: false,
          testActive: false,
        });
      }

      if (currentTime > assessmentEndTime) {
        return sendError(c, 403, "Assessment has ended", {
          allowedForTest: false,
          testActive: false,
        });
      }
    }

    const codeTakenAssessment = await CodeAssessmentSubmissions.findOne({
      assessmentId: body.id,
      email: body.email,
    });

    const mcqTakenAssessment = await MCQAssessmentSubmissions.findOne({
      assessmentId: body.id,
      email: body.email,
    });

    if (codeTakenAssessment || mcqTakenAssessment) {
      return sendError(c, 403, "You have already taken this assessment", {
        allowedForTest: false,
        testActive: true,
      });
    }

    if (assessment.public) {
      return sendSuccess(c, 200, "Access Granted", {
        instructions: assessment.instructions,
        type: result1 ? "code" : "mcq",
        assessment: assessment,
      });
    }

    const candidate = assessment.candidates.find(
      (candidate) => candidate.email === body.email
    );

    if (!candidate) {
      return sendError(c, 403, "You are not allowed to take this assessment", {
        allowedForTest: false,
        testActive: true,
      });
    }

    return sendSuccess(c, 200, "Access Granted", {
      instructions: assessment.instructions,
      assessment: assessment,
    });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const checkCodeProgress = async (c: Context) => {
  try {
    const body = await c.req.json();

    const [result1, result2] = await Promise.all([
      CodeAssessment.findOne({ _id: body.assessmentId })
        .populate("problems")
        .lean(),
      MCQAssessment.findOne({ _id: body.assessmentId }).lean(),
    ]);

    const assessment = result1 || result2;
    const type = result1 ? "code" : "mcq";

    let submission;

    if (type === "code") {
      submission = await CodeAssessmentSubmissions.findOne({
        email: body.email,
        assessmentId: body.assessmentId,
      });
    } else {
      submission = await MCQAssessmentSubmissions.findOne({
        email: body.email,
        assessmentId: body.assessmentId,
      });
    }

    if (!submission) {
      return sendSuccess(c, 200, "Submission not found", { exists: false });
    }

    if (submission.status === "completed") {
      return sendSuccess(c, 200, "Submission completed", {
        exists: false,
        status: "completed",
        type,
      });
    }

    return sendSuccess(c, 200, "Success", {
      assessment,
      submission,
      type,
    });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const checkMcqProgress = async (c: Context) => {
  try {
    const body = await c.req.json();

    const assessment = await MCQAssessment.findOne({
      _id: body.assessmentId,
    }).lean();

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    const submission = await MCQAssessmentSubmissions.findOne({
      email: body.email,
      assessmentId: body.assessmentId,
    });

    if (!submission) {
      return sendSuccess(c, 200, "Submission not found", { exists: false });
    }

    if (submission.status === "completed") {
      return sendSuccess(c, 200, "Submission completed", {
        exists: false,
        status: "completed",
      });
    }

    return sendSuccess(c, 200, "Success", { assessment, submission });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const submitMcqAssessment = async (c: Context) => {
  try {
    const { assessmentId, email, timer, assessmentSub } = await c.req.json();
    const assessment = await MCQAssessment.findById(assessmentId).lean();

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    const submission = await MCQAssessmentSubmissions.findOne({
      assessmentId,
      email,
    });

    const receivedSub: IMCQAssessmentSubmission = assessmentSub;

    if (!submission || !receivedSub) {
      return sendError(c, 404, "Submission not found");
    }

    const offenses = submission.offenses;

    const getCheatingStatus = (offenses: any) => {
      if (!offenses) {
        return "No Copying";
      }

      if (offenses.tabChange > 5) {
        return "Heavy Copying";
      }

      return "No Copying";
    };

    // @ts-expect-error - TS doesn't allow conversion of mongoose document to object
    const grades = calculateMCQScore(receivedSub.mcqSubmissions!, assessment);

    // @ts-expect-error - TS doesn't allow conversion of mongoose document to object
    submission.obtainedGrades = grades;

    submission.timer = timer;
    submission.status = "completed";
    submission.cheatingStatus = getCheatingStatus(offenses);

    await submission.save();

    return sendSuccess(c, 200, "Success", grades);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getTakenMcqAssessments = async (c: Context) => {
  try {
    const auth = c.get("auth");

    const submissions = await MCQAssessmentSubmissions.find({
      email: auth?.email,
    });

    const takenAssessments = [];

    for (const submission of submissions) {
      const assessment = await MCQAssessment.findById(submission.assessmentId);
      if (!assessment) {
        continue;
      }

      takenAssessments.push({
        assessment,
        submission,
      });
    }

    return sendSuccess(c, 200, "Success", takenAssessments);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const getTakenCodeAssessments = async (c: Context) => {
  try {
    const auth = c.get("auth");

    const submissions = await CodeAssessmentSubmissions.find({
      email: auth?.email,
    });

    const takenAssessments = [];

    for (const submission of submissions) {
      const assessment = await CodeAssessment.findById(submission.assessmentId);
      if (!assessment) {
        continue;
      }

      takenAssessments.push({
        assessment,
        submission,
      });
    }

    return sendSuccess(c, 200, "Success", takenAssessments);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default {
  getAssessments,
  getMyMcqAssessments,
  getMyCodeAssessments,
  getMyMcqCodeAssessments,
  getTakenAssessments,
  getAssessment,
  createAssessment,
  getAssessmentSubmissions,
  getAssessmentSubmission,
  deleteAssessment,
  qualifyCandidate,
  disqualifyCandidate,
  checkCodeProgress,
  codeSubmit,
  submitIndividualProblem,
  checkProblemDependencies,

  createMcqAssessment,
  createCodeAssessment,
  getMcqAssessment,
  getCodeAssessment,
  deleteMcqAssessment,
  deleteCodeAssessment,

  getCreatedCodeAssessments,
  getCreatedMcqAssessments,
  getTakenMcqAssessments,
  getTakenCodeAssessments,

  verifyAccess,

  checkMcqProgress,

  submitMcqAssessment,
};
