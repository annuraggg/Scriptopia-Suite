interface OffenseEntry {
  _id?: string;
  problemId: string;
  times: number;
}

interface OffenseType {
  _id?: string;
  mcq: number;
  problem: OffenseEntry[];
}

interface OffenseSchema {
  _id?: string;
  tabChange?: OffenseType;
  copyPaste?: OffenseType;
}

interface McqSubmissionSchema {
  _id?: string;
  mcqId: string;
  selectedOptions: string[];
}

interface ResultSchema {
  _id?: string;
  caseNo: number;
  caseId: string;
  output: string;
  isSample: boolean;
  memory: number;
  time: number;
  passed: boolean;
  console?: string;
}

interface ProblemSubmissionSchema {
  _id?: string;
  problemId: string;
  code: string;
  language: string;
  results: ResultSchema[];
}

interface AssessmentSubmissionsSchema {
  _id?: string;
  assessmentId: string;
  name: string;
  email: string;
  offenses?: OffenseSchema;
  mcqSubmissions?: McqSubmissionSchema[];
  submissions?: ProblemSubmissionSchema[];
  timer: number;
  sessionRewindUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default AssessmentSubmissionsSchema;
export type {
  OffenseEntry,
  OffenseType,
  OffenseSchema,
  McqSubmissionSchema,
  ResultSchema,
  ProblemSubmissionSchema,
};
