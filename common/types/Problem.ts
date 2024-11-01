interface TestCase {
  _id?: string;
  input: string[];
  output: string;
  difficulty: "easy" | "medium" | "hard";
  isSample: boolean;
}

interface ArraySclObject {
  _id?: string;
  type:
    | "boolean"
    | "integer"
    | "character"
    | "long"
    | "float"
    | "double"
    | "string";
  size: number;
}

interface SclObject {
  _id?: string;
  name: string;
  type:
    | "boolean"
    | "integer"
    | "character"
    | "long"
    | "float"
    | "double"
    | "string"
    | "array"
    | "return";
  arrayProps?: ArraySclObject;
}

interface Problem {
  _id?: string;
  title: string;
  description: object;
  author?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  votes?: number;
  sclObject: SclObject[];
  testCases: TestCase[];
  isPrivate?: boolean;
  allowInAssessments?: boolean;
  totalSubmissions?: number;
  successfulSubmissions?: number;
}

export type { Problem, SclObject, ArraySclObject, TestCase };
