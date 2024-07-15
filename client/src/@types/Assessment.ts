export interface IOpenRange {
  start: Date;
  end: Date;
}

export interface ITestCases {
  easy: number;
  medium: number;
  hard: number;
}

export interface IProblem {
  problemId: string;
  points: number;
}

export interface IGrading {
  type: "testcase" | "problem";
  testcases?: ITestCases;
  problem?: IProblem[];
}

export interface ICandidate {
  name: string;
  email: string;
}

export interface ICandidates {
  type: "all" | "specific";
  candidates?: ICandidate[];
}

export interface IMcq {
  _id?: string;
  question: string;
  type: "multiple" | "checkbox" | "text";
  mcq: { options: string[]; correct: string };
  checkbox: { options: string[]; correct: string[] };
}

export interface ISecurity {
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
  type: "standard" | "live";
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
  createdAt: Date;
}

export default IAssessment;
