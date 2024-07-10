import { Context } from "hono";
import { sendError, sendSuccess } from "../utils/sendResponse";
import Problem from "../models/Problem";
import { runCode as runCompilerCode } from "../aws/runCode";

const runCode = async (c: Context) => {
  try {
    const body = await c.req.json();
    const prob = await Problem.findOne({ _id: body.problemId });
    if (!prob) {
      return sendError(c, 404, "Problem Not Found");
    }

    const functionSchema = {
      functionName: prob.functionName,
      functionArgs: prob.functionArgs,
      functionBody: body.code,
      functionReturn: prob.functionReturnType,
    };

    const result = await runCompilerCode(body.language, functionSchema, prob.testCases);

    return sendSuccess(c, 200, "Success", body);
  } catch (error) {
    return sendError(c, 500, "Internal Server Error", error);
  }
};

export default { runCode };
