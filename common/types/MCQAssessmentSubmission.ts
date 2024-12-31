interface OffenseEntry {
  _id?: string;
  problemId: string;
  times: number;
}

interface OffenseType {
  _id?: string;
  mcq: number; // Required
  problem: OffenseEntry[]; // Required
}

interface OffenseSchema {
  _id?: string;
  tabChange?: OffenseType;
  copyPaste?: OffenseType;
}

interface McqSubmissionSchema {
  _id?: string;
  mcqId: string; // Required
  selectedOptions: string[]; // Required
}

interface ObtainedGradeSchema {
  mcq?: {
    mcqId: string;
    obtainedMarks: number;
  }[];
  total: number; // Required
}

interface MCQAssessmentSubmissionsSchema {
  _id?: string;
  assessmentId: string; // Required
  name: string; // Required
  email: string; // Required
  offenses?: OffenseSchema;
  mcqSubmissions?: McqSubmissionSchema[];
  timer: number; // Required
  sessionRewindUrl?: string;
  obtainedGrades?: ObtainedGradeSchema; // Required
  cheatingStatus?: "No Copying" | "Light Copying" | "Heavy Copying";
  createdAt?: Date;
  updatedAt?: Date; // Missing in interface, added here
}

export type {
  OffenseEntry,
  OffenseType,
  OffenseSchema,
  McqSubmissionSchema,
  ObtainedGradeSchema,
  MCQAssessmentSubmissionsSchema,
};
