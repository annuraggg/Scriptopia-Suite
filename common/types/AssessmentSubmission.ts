interface OffenseEntry {
  _id?: string;
  problemId: string;
  times: number;
}

interface OffenseType {
  _id?: string;
  mcq: number;   // Required
  problem: OffenseEntry[];  // Required
}

interface OffenseSchema {
  _id?: string;
  tabChange?: OffenseType;
  copyPaste?: OffenseType;
}

interface McqSubmissionSchema {
  _id?: string;
  mcqId: string;  // Required
  selectedOptions: string[];  // Required
}

interface ResultSchema {
  _id?: string;
  caseNo: number;
  caseId: string;
  output?: string;  // Optional, default is " "
  isSample: boolean;
  memory: number;
  time: number;
  passed: boolean;
  console?: string;
}

interface ProblemSubmissionSchema {
  _id?: string;
  problemId: string;  // Required
  code: string;  // Required
  language: string;  // Required
  results: ResultSchema[];  // Required
}

interface ObtainedGradeSchema {
  mcq?: {
    mcqId: string;
    obtainedMarks: number;
  }[];
  problem?: {
    problemId: string;
    obtainedMarks: number;
  }[];
  total: number;  // Required
}

interface AssessmentSubmissionsSchema {
  _id?: string;
  assessmentId: string;  // Required
  name: string;  // Required
  email: string;  // Required
  offenses?: OffenseSchema;
  mcqSubmissions?: McqSubmissionSchema[];
  submissions?: ProblemSubmissionSchema[];  // Optional
  timer: number;  // Required
  sessionRewindUrl?: string;
  obtainedGrades?: ObtainedGradeSchema;  // Required
  cheatingStatus?: "No Copying" | "Light Copying" | "Heavy Copying";
  createdAt?: Date;
  updatedAt?: Date;  // Missing in interface, added here
}

export type {
  OffenseEntry,
  OffenseType,
  OffenseSchema,
  McqSubmissionSchema,
  ResultSchema,
  ProblemSubmissionSchema,
  ObtainedGradeSchema,
  AssessmentSubmissionsSchema
};
