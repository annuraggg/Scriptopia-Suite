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

interface Candidate {
  name: string;
  email: string;
}

interface Candidates {
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
  codePlayback: boolean;
  codeExecution: boolean;
  tabChangeDetection: boolean;
  copyPasteDetection: boolean;
  allowAutoComplete: boolean;
  allowRunningCode: boolean;
  enableSyntaxHighlighting: boolean;
}

interface Assessment extends Document {
  _id: string;
  name: string;
  description: string;
  author: string;
  type: "mcq" | "code" | "mcqcode";
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
