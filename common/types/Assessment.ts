interface IOpenRange {
  start: Date;
  end: Date;
}

interface ITestCases {
  easy: number;
  medium: number;
  hard: number;
}

interface IProblem {
  problemId: string;
  points: number;
}

interface IGrading {
  type: "testcase" | "problem";
  testcases?: ITestCases;
  problem?: IProblem[];
}

interface ICandidate {
  name: string;
  email: string;
}

interface ICandidates {
  type: "all" | "specific";
  candidates?: ICandidate[];
}

interface IMcq {
  _id?: string;
  question: string;
  type: "multiple" | "checkbox" | "text";
  mcq?: { options: string[]; correct: string };
  checkbox?: { options: string[]; correct: string[] };
  grade: number;
}

interface ISecurity {
  codePlayback: boolean;
  codeExecution: boolean;
  tabChangeDetection: boolean;
  copyPasteDetection: boolean;
  allowAutoComplete: boolean;
  allowRunningCode: boolean;
  enableSyntaxHighlighting: boolean;
}

interface IAssessment extends Document {
  _id: string;
  name: string;
  description: string;
  type: "mcq" | "code" | "mcqcode";
  timeLimit: number;
  passingPercentage: number;
  openRange: IOpenRange;
  languages: string[];
  problems: string[];
  mcqs: IMcq[];
  grading: IGrading;
  candidates: ICandidates;
  instructions: string;
  security: ISecurity;
  feedbackEmail: string;
  obtainableScore: number;
  createdAt: Date;
}

export type { IAssessment, IOpenRange, ITestCases, IProblem, IGrading, ICandidate, ICandidates, IMcq, ISecurity };

