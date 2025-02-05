interface Offense {
  tabChange?: { problemId: string; times: number }[];
  copyPaste?: { problemId: string; times: number }[];
}

interface Result {
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
  problemId: string;
  code: string;
  language: string;
  results?: Result[];
  submittedAt: Date;
}

interface ObtainedGrade {
  problem?: { problemId: string; obtainedMarks: number }[];
  total: number;
}

interface CodeAssessmentSubmission {
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
  createdAt: Date;
  updatedAt: Date;
}

export type {
  Offense,
  Result,
  ProblemSubmission,
  ObtainedGrade,
  CodeAssessmentSubmission,
};
