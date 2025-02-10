interface TestCase {
  _id?: string;
  input: string[];
  output: string;
  difficulty: "easy" | "medium" | "hard";
  isSample: boolean;
}

interface CustomStub {
  _id?: string;
  language: string;
  stub: string;
}

interface Problem {
  _id?: string;
  title: string;
  description: object;
  author?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  isPrivate: boolean;
  sdsl: string[];
  customStubs?: CustomStub[];
  testCases: TestCase[];
  totalSubmissions: number;
  successfulSubmissions: number;
  acceptanceRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { TestCase, CustomStub, Problem };
