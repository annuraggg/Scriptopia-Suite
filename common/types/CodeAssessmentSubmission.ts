interface Offense {
  _id?: string;
  tabChange?: { problemId: string; times: number }[];
  copyPaste?: { problemId: string; times: number }[];
}

interface Result {
  _id?: string;
  caseNo: number;
  caseId: string;
  output?: string;
  isSample: boolean;
  memory: number;
  time: number;
  passed: boolean;
  console?: string;
  errorMessage?: string;
}

interface ProblemSubmission {
  _id?: string;
  problemId: string;
  code: string;
  language: string;
  results?: Result[];
  submittedAt: Date;
}

interface ObtainedGrade {
  _id?: string;
  problem?: { problemId: string; obtainedMarks: number }[];
  total: number;
}

interface CodeAssessmentSubmission {
  _id?: string;
  assessmentId: string;
  status?: "in-progress" | "completed";
  name: string;
  email: string;
  offenses?: Offense;
  submissions?: ProblemSubmission[];
  timer: number;
  sessionRewindUrl?: string;
  obtainedGrades?: ObtainedGrade;
  cheatingStatus?: "No Copying" | "Light Copying" | "Heavy Copying";
  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  Offense,
  Result,
  ProblemSubmission,
  ObtainedGrade,
  CodeAssessmentSubmission,
};
