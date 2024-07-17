export interface ITestCase {
  _id?: string;
  input: string[];
  output: string;
  difficulty: "easy" | "medium" | "hard";
  isSample: boolean;
}

export interface IFunctionArg {
  name: string;
  type: "string" | "number" | "boolean" | "array";
}

interface IProblem extends Document {
  _id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description: Record<string, any>;
  author: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  votes: number;
  functionName: string;
  functionReturnType: "string" | "number" | "boolean" | "array";
  functionArgs: IFunctionArg[];
  testCases: ITestCase[];
  isPrivate: boolean;
  allowInAssessments: boolean;

  status?: "Solved" | "Unsolved";
  acceptanceRate?: number;
}

export default IProblem;

