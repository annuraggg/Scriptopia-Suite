interface OpenRange {
  start?: Date;
  end?: Date;
}

interface Testcases {
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
  testcases?: Testcases;
  problem?: Problem[];
}

interface Candidate {
  name: string;
  email: string;
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

interface CodeAssessment {
  name: string;
  description: string;
  author: string;
  timeLimit: number;
  passingPercentage: number;
  openRange?: OpenRange;
  languages: string[];
  problems: string[];
  grading?: Grading;
  candidates?: Candidate[];
  instructions: string;
  security: Security;
  feedbackEmail: string;
  obtainableScore: number;
  isEnterprise: boolean;
  postingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  OpenRange,
  Testcases,
  Problem,
  Grading,
  Candidate,
  Security,
  CodeAssessment,
};
