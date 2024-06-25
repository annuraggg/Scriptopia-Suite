import { Context } from "hono";
import { sendError, sendSuccess } from "../utils/sendResponse";
import Problem from "../models/Problem";
import { getAuth } from "@hono/clerk-auth";
import User from "../models/User";
import IProblem from "../../@types/Problem";

const getHome = async (c: Context) => {
  const auth = getAuth(c);
  const problems = await Problem.find().limit(20).lean();
  const dupTabs = problems.map((problem) => problem.tags).flat();
  const tags = [...new Set(dupTabs)];

  const user = await User.findOne({ clerkId: auth?.userId })
    .populate("solvedProblems.problemId")
    .lean();

  if (!user) {
    return sendError(c, 401, "Unauthorized");
  }

  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;

  const solvedProblems: string[] = [];
  for (const solvedProblem of user.solvedProblems) {
    const pid = solvedProblem.problemId as string;
    solvedProblems.push(pid);
    const problem = (await Problem.findById(pid)) as IProblem;

    if (!problem) {
      continue; 
    }
    console.log(problem.difficulty);
    if (problem.difficulty === "easy") {
      easyCount++;
    } else if (problem.difficulty === "medium") {
      mediumCount++;
    } else {
      hardCount++;
    }
  }

  const response = {
    problems,
    tags,
    streak: user.streak,
    solvedProblems,
    problemsCount: { easy: easyCount, medium: mediumCount, hard: hardCount },
  };
  return sendSuccess(c, 200, "Success", response);
};

export default {
  getHome,
};
