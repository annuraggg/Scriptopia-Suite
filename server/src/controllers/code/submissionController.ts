import { Context } from "hono";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import Problem from "../../models/Problem";
import { runCode as runCompilerCode } from "../../utils/runCode";
import User from "../../models/User";
import { TestCase } from "@shared-types/Problem";
import Submission from "@/models/Submission";
import {
  shouldRewardUser,
  sendTokenReward,
} from "../../config/blockchainService";
import Web3 from "web3";
import { User as IUser } from "@shared-types/User";

const runCode = async (c: Context) => {
  try {
    const body = await c.req.json();
    const prob = await Problem.findOne({ _id: body.problemId });

    if (!prob) {
      return sendError(c, 404, "Problem Not Found");
    }

    if (!prob) {
      return sendError(c, 404, "Problem Not Found");
    }

    const result = await runCompilerCode(
      body.language,
      prob.sdsl,
      body.code,
      prob.testCases as unknown as TestCase[]
    );

    if (!result) {
      return sendSuccess(c, 200, "Success", result);
    }

    if (result?.status === "ERROR") {
      console.error(result.error);
    }

    return sendSuccess(c, 200, "Success", result);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

const submitCode = async (c: Context) => {
  try {
    const body = await c.req.json();
    const prob = await Problem.findOne({ _id: body.problemId });
    if (!prob) {
      return sendError(c, 404, "Problem Not Found");
    }

    const result = await runCompilerCode(
      body.language,
      prob.sdsl,
      body.code,
      prob.testCases as unknown as TestCase[]
    );

    const results = result.results.map((r: any) => ({
      caseNo: r.caseNo,
      caseId: r._id,
      output: r.output,
      isSample: r.isSample,
      memory: r.memory,
      time: r.time,
      passed: r.passed,
      console: r.console,
    }));

    // @ts-ignore
    const auth = c.get("auth");
    const u = auth?._id;
    if (!u) {
      return sendError(c, 401, "Unauthorized");
    }

    const submission = new Submission({
      problem: body.problemId,
      user: u,
      code: body.code,
      language: body.language,
      status: result.failedCaseNo === -1 ? "SUCCESS" : "FAILED",
      avgMemory: result.avgMemory,
      avgTime: result.avgTime,
      failedCaseNumber: result.failedCaseNo,
      results: results,
      meta: {
        driver: result.driver,
        timestamp: result.timestamp,
      },
    });

    let rewardResult = null;

    if (result.failedCaseNo === -1) {
      const date = new Date();
      const user = await User.findOne({ _id: u });

      if (user) {
        user.streak.push(date);

        const shouldReward = shouldRewardUser(
          prob.difficulty,
          prob._id?.toString(),
          user as unknown as IUser
        );

        if (shouldReward && user.wallet?.address) {
          const rewardAmount =
            prob.difficulty === "easy"
              ? "1"
              : prob.difficulty === "medium"
              ? "2"
              : "3";
          const amountInWei = Web3.utils.toWei(
            rewardAmount.toString(),
            "ether"
          );
          console.log(amountInWei);

          try {
            const rewardSent = await sendTokenReward(
              user.wallet.address,
              rewardAmount
            );

            if (rewardSent) {
              user.wallet.balance += parseFloat(rewardAmount);
              rewardResult = {
                earned: true,
                amount: rewardAmount,
              };

              const newDbTransaction = {
                amount: rewardAmount,
                problemId: prob._id,
              };

              if (!user.wallet.transactions) {
                // @ts-expect-error
                user.wallet.transactions = [];
              }

              user.wallet.transactions?.push(newDbTransaction);
            } else {
              rewardResult = {
                earned: false,
                reason: "Token transfer failed",
              };
            }
          } catch (error) {
            console.error("Error sending token reward:", error);
            rewardResult = {
              earned: false,
              reason: "Token transfer error",
            };
          }
        } else {
          rewardResult = {
            earned: false,
            reason: shouldReward ? "No wallet found" : "Luck not in your favor",
          };
        }

        await user.save();
      } else {
        console.error("User not found for reward:", u);
        rewardResult = {
          earned: false,
          reason: "User not found",
        };
      }
    }

    prob.totalSubmissions += 1;
    if (result.failedCaseNo === -1) {
      console.log("Success");
      prob.successfulSubmissions += 1;
      const acceptanceRate =
        (prob.successfulSubmissions / prob.totalSubmissions) * 100;
      prob.acceptanceRate = acceptanceRate;
    }

    await prob.save();
    console.log(result.STATUS);
    if (result.STATUS === "PASSED") {
      await submission.save();
    } else {
      return sendError(c, 400, "Submission Failed", result);
    }

    return sendSuccess(c, 200, "Success", {
      submission,
      result,
      reward: rewardResult,
    });
  } catch (error) {
    console.log(error);
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default { runCode, submitCode };
