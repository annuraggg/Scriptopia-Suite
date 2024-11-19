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
import CandidateDoc from "@/models/Candidate";
import CandidateModel from "@/models/Candidate";
import checkOrganizationPermission from "@/middlewares/checkOrganizationPermission";
import logger from "@/utils/logger";

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
//     console.error(error);
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

const verifyAccess = async (c: Context) => {
  try {
    const body = await c.req.json();

    const assessment = await Assessment.findOne({ _id: body.id }).populate(
      "problems"
    );
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
      if (currentStep.stepId.toString() !== assessment._id.toString()) {
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

    const takenAssessment = await AssessmentSubmissions.findOne({
      assessmentId: body.id,
      email: body.email,
    });

    if (takenAssessment) {
      return sendError(c, 403, "You have already taken this assessment", {
        allowedForTest: false,
        testActive: true,
      });
    }

    if (assessment.candidates.type === "all") {
      return sendSuccess(c, 200, "Access Granted", {
        instructions: assessment.instructions,
        type: assessment.type,
        assessment: assessment,
      });
    }

    const candidate = assessment.candidates.candidates.find(
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
    });
  } catch (error) {
    console.error(error);
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

        const result: any = await runCompilerCode(
          submission.language, 
          problem.sdsl,
          submission.code,
          problem.testCases as unknown as TestCase[]
        );

        if (result?.status === "ERROR") {
          console.error(result.error);
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

    const grades = getScore(
      submission.mcqSubmissions,
      submission.submissions,
      assessment
    );
    const assessmentSubmission = {
      ...submission,
      cheatingStatus: getCheatingStatus(offenses),
      obtainedGrades: grades,
    };

    const newSubmission = new AssessmentSubmissions(assessmentSubmission);
    await newSubmission.save();

    if (assessment.isEnterprise) {
      const candidate = await CandidateDoc.findOne({
        email,
      });

      const currentPosting = candidate?.appliedPostings.find(
        (posting) =>
          posting?.postingId?.toString() == assessment?.postingId?.toString()
      );

      console.log("currentPosting", currentPosting);

      if (!currentPosting) {
        return sendError(c, 400, "Posting not found");
      }

      const posting = await Posting.findById(currentPosting?.postingId);
      console.log("posting", posting);
      if (!posting) {
        return sendError(c, 400, "Posting not found 2");
      }

      const score = grades?.total || 0;
      const totalScore = assessment.obtainableScore;
      const passingPercentage = assessment.passingPercentage;
      const percentage = (score / totalScore) * 100;
      if (percentage < passingPercentage) {
        currentPosting.status = "rejected";
        currentPosting.disqualifiedStage = posting?.workflow?.currentStep;
        currentPosting.disqualifiedReason = "Failed Assessment";

        await candidate?.save();
      }
    }

    return sendSuccess(c, 200, "Success");
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const codeSubmit = async (c: Context) => {
  try {
    const { assessmentId, email, timer } = await c.req.json();
    console.log(assessmentId, email);
    const assessment = await Assessment.findById(assessmentId).populate(
      "problems"
    );

    if (!assessment) {
      return sendError(c, 404, "Assessment not found");
    }

    const submission = await AssessmentSubmissions.findOne({
      assessmentId,
      email,
    });

    if (!submission) {
      return sendError(c, 404, "Submission not found");
    }

    const grades = getScore(
      [], // @ts-ignore
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

const getScore = (
  mcqSubmissions: { mcqId: string; selectedOptions: string[] }[],
  problemSubmissions: { problemId: string; results: any[] }[],
  assessment: any
) => {
  let total = 0;
  let mcq = [];
  let problem = [];

  for (const mcqSubmission of mcqSubmissions) {
    let grade = 0;
    const mcqObj = assessment.mcqs.find((mcq: any) => {
      if (!mcq._id) return false;
      return mcq._id.toString() === mcqSubmission.mcqId;
    });

    if (!mcqObj) continue;

    if (mcqObj.type === "multiple") {
      if (!mcqObj.mcq) continue;
      if (mcqObj.mcq.correct === mcqSubmission.selectedOptions[0]) {
        grade = mcqObj.grade;
      }
    }

    if (mcqObj.type === "checkbox") {
      if (!mcqObj.checkbox) continue;
      const correct = mcqObj.checkbox.correct;
      const selected = mcqSubmission.selectedOptions;

      if (
        correct.length === selected.length &&
        correct.every((value: string) => selected.includes(value))
      ) {
        grade = mcqObj.grade;
      }
    }

    mcq.push({
      mcqId: mcqSubmission.mcqId,
      obtainedMarks: grade,
    });
  }

  for (const problemSubmission of problemSubmissions) {
    let grade = 0;

    const problemObj = assessment.problems.find(
      (problem: any) =>
        problem._id.toString() === problemSubmission.problemId.toString()
    );

    if (!problemObj) continue;
    if (!assessment.grading) continue;

    if (assessment.grading.type === "testcase") {
      if (!assessment.grading.testcases) continue;

      for (const testCase of problemObj.testCases) {
        if (!testCase?._id?.toString()) continue;
        const passed = problemSubmission.results.find(
          (result: any) =>
            result.caseId.toString() === testCase._id.toString() &&
            result.passed
        );
        if (!passed) continue;
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
      const gradingProblemObj = assessment.grading.problem.find(
        (p: any) =>
          p.problemId?.toString() === problemSubmission.problemId.toString()
      );

      if (!gradingProblemObj) continue;

      const allPassed = problemSubmission.results.every(
        (result: any) => result.passed
      );
      if (allPassed) {
        grade = gradingProblemObj.points;
      }
    }

    problem.push({
      problemId: problemSubmission.problemId,
      obtainedMarks: grade,
    });
  }

  mcq.forEach((m: any) => {
    total += m.obtainedMarks;
  });

  problem.forEach((p: any) => {
    total += p.obtainedMarks;
  });

  return {
    mcq,
    problem,
    total,
  };
};

const checkProgress = async (c: Context) => {
  try {
    const body = await c.req.json();

    const submission = await AssessmentSubmissions.findOne({
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

    const assessment = await Assessment.findById(body.assessmentId)
      .populate("problems")
      .lean();

    return sendSuccess(c, 200, "Success", {
      assessment,
      submission,
    });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error", error);
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

    const submission = await AssessmentSubmissions.findOne({
      email: data.email,
      assessmentId: data.assessmentId,
    });

    if (!submission) {
      return;
    }

    const problemSubmission = {
      problemId: data.problemId,
      code: data.code,
      language: data.language,
      results: r,
    };

    // @ts-ignore - replace the existing submission with the new one or add a new one
    const existingSubmission = submission.submissions.find(
      (s) => s.problemId.toString() === data.problemId
    );

    if (existingSubmission) {
      existingSubmission.code = data.code;
      existingSubmission.language = data.language;
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

    socket.on("start-assessment", async (data) => {
      const newSubmission = new AssessmentSubmissions(data);
      newSubmission.status = "in-progress";
      await newSubmission.save();
    });

    socket.on("timeSync", async (data) => {
      const submission = await AssessmentSubmissions.findOne({
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

      const submission = await AssessmentSubmissions.findOne({
        email,
        assessmentId,
      });

      if (!submission) return;

      if (!submission.offenses) {
        submission.offenses = {};
      }
      if (!submission.offenses.tabChange) {
        submission.offenses.tabChange = { mcq: 0, problem };
      }

      const { tabChange } = submission.offenses;

      const problemEntry = tabChange?.problem?.find(
        (p) => p?.problemId?.toString() === problem
      );

      if (problemEntry) {
        problemEntry.times = (problemEntry.times || 0) + 1;
      } else {
        tabChange?.problem?.push({ problemId: problem, times: 1 });
      }

      await submission.save();
    });

    socket.on("session-url", async ({ assessmentId, email, sessionUrl }) => {
      console.log("session-url", assessmentId, email, sessionUrl);
      if (!assessmentId || !email || !sessionUrl) return;

      const submission = await AssessmentSubmissions.findOne({
        email,
        assessmentId,
      });

      if (!submission) return;

      submission.sessionRewindUrl = sessionUrl;
      await submission.save();
    });
  });
});

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
  deleteAssessment,
  qualifyCandidate,
  disqualifyCandidate,
  checkProgress,
  codeSubmit,
  submitIndividualProblem,
};
