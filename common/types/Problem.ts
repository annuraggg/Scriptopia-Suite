

interface ITestCase {
  _id?: string;
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
  _id: string;
  title: string;
  description: Record<string, any>;
  author: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  votes: number;
  scl: string[];
  testCases: ITestCase[];
  isPrivate: boolean;
  allowInAssessments: boolean;
  totalSubmissions?: number;
  successfulSubmissions?: number;

  status?: "Solved" | "Unsolved";
  acceptanceRate?: number;
}

export type { IProblem, ITestCase, IFunctionArg };
