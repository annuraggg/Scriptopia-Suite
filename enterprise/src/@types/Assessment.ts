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
  name: string;
  description: string;
  type: "standard" | "live";
  timeLimit: number;
  passingPercentage: number;
  openRange: IOpenRange;
  languages: string[];
  problems: string[];
  grading: IGrading;
  candidates: ICandidates;
  instructions: string;
  security: ISecurity;
  feedbackEmail: string;
}

export default IAssessment;
export type {
  IOpenRange,
  ITestCases,
  IProblem,
  IGrading,
  ICandidate,
  ICandidates,
  ISecurity,
};
