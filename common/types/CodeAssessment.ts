interface OpenRange {
  _id?: string;
  start?: Date;
  end?: Date;
}

interface Testcases {
  _id?: string;
  easy: number;
  medium: number;
  hard: number;
}

interface Problem {
  _id?: string;
  problemId: string;
  points: number;
}

interface Grading {
  _id?: string;
  type: "testcase" | "problem";
  testcases?: Testcases;
  problem?: Problem[];
}

interface Candidate {
  _id?: string;
  name: string;
  email: string;
}

interface Security {
  _id?: string;
  codePlayback: boolean;
  codeExecution: boolean;
  tabChangeDetection: boolean;
  copyPasteDetection: boolean;
  allowAutoComplete: boolean;
  allowRunningCode: boolean;
  enableSyntaxHighlighting: boolean;
}

interface CodeAssessment {
  _id?: string;
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
  isCampus?: boolean;
  postingId?: string;
  driveId?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
