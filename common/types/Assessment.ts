interface OpenRange {
  _id?: string;
  start?: Date;
  end?: Date;
}

interface TestCases {
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
  testcases?: TestCases; // Make optional but depending on the type logic.
  problem?: Problem[]; // Make optional but depending on the type logic.
}

interface Candidate {
  _id?: string;
  name: string;
  email: string;
}

interface Candidates {
  _id?: string;
  type: "all" | "specific";
  candidates: Candidate[];
}

interface Mcq {
  _id?: string;
  question: string;
  type: "multiple" | "checkbox" | "text";
  mcq?: { options: string[]; correct: string };
  checkbox?: { options: string[]; correct: string[] };
  grade: number;
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

interface Assessment extends Document {
  _id?: string;
  name: string;
  description: string;
  author: string;
  type: "mcq" | "code";
  timeLimit: number;
  passingPercentage: number;
  openRange?: OpenRange;
  languages: string[];
  problems: string[];
  mcqs: Mcq[];
  grading: Grading;
  candidates: Candidates;
  instructions: string;
  security: Security;
  feedbackEmail: string;
  obtainableScore: number;
  isEnterprise: boolean;
  postingId?: string;
  createdAt: Date;
}

export type {
  Assessment,
  OpenRange,
  TestCases,
  Problem,
  Grading,
  Candidate,
  Candidates,
  Mcq,
  Security,
};
