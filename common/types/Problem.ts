interface TestCase {
  input: string[];
  output: string;
  difficulty: "easy" | "medium" | "hard";
  isSample: boolean;
}

interface CustomStub {
  language: string;
  stub: string;
}

interface Problem {
  title: string;
  description: object;
  author?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  isPrivate: boolean;
  totalSubmissions: number;
  sdsl: string[];
  customStubs?: CustomStub[];
  testCases: TestCase[];
  createdAt: Date;
  updatedAt: Date;
}

export type { TestCase, CustomStub, Problem };
