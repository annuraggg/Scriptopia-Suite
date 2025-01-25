interface OpenRange {
  start?: Date;
  end?: Date;
}

interface TestCases {
  easy: number;
  medium: number;
  hard: number;
}

interface Problem {
  problemId: string;
  points: number;
}

interface Grading {
  type: "testcase" | "problem";
  testcases?: TestCases; // Make optional but depending on the type logic.
  problem?: Problem[]; // Make optional but depending on the type logic.
}

interface Security {
  codePlayback: boolean;
  codeExecution: boolean;
  tabChangeDetection: boolean;
  copyPasteDetection: boolean;
  allowAutoComplete: boolean;
  allowRunningCode: boolean;
  enableSyntaxHighlighting: boolean;
}

interface Candidate {
  name: string;
  email: string;
}

interface CodeAssessment {
  _id: string;
  name: string;
  description: string;
  author: string;
  timeLimit: number;
  passingPercentage: number;
  openRange?: OpenRange;
  languages: string[];
  problems: string[];
  grading: Grading;
  candidates: Candidate[];
  public: boolean;
  instructions: string;
  security: Security;
  feedbackEmail: string;
  obtainableScore: number;
  isEnterprise: boolean;
  postingId?: string;
  createdAt: Date;
}

export type {
  CodeAssessment,
  OpenRange,
  TestCases,
  Problem,
  Grading,
  Candidate,
  Security,
};
