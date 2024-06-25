import mongoose, { Document } from "mongoose";

interface ITestCase {
  input: string[];
  output: string;
  difficulty: "easy" | "medium" | "hard";
  isSample: boolean;
}

interface IFunctionArg {
  name: string;
  type: "string" | "number" | "boolean" | "array";
}

interface IProblem extends Document {
  title: string;
  description: Record<string, any>;
  author: mongoose.Types.ObjectId;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  votes: number;
  functionName: string;
  functionReturnType: "string" | "number" | "boolean" | "array";
  functionArgs: IFunctionArg[];
  testCases: ITestCase[];
  isPrivate: boolean;
  allowInAssessments: boolean;
}

export default IProblem;
export { ITestCase, IFunctionArg };
