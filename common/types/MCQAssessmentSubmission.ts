interface Offense {
  tabChange?: number;
  copyPaste?: number;
}

interface McqSubmission {
  mcqId: string;
  selectedOptions: string[];
}

interface ObtainedMcqGrade {
  mcqId: string;
  obtainedMarks: number;
}

interface ObtainedGrade {
  mcq?: ObtainedMcqGrade[];
  total: number;
}

interface MCQAssessmentSubmission {
  assessmentId: string;
  status?: "in-progress" | "completed";
  name: string;
  email: string;
  offenses?: Offense;
  mcqSubmissions?: McqSubmission[];
  timer: number;
  sessionRewindUrl?: string;
  obtainedGrades?: ObtainedGrade;
  cheatingStatus?: "No Copying" | "Light Copying" | "Heavy Copying";
  createdAt: Date;
  updatedAt: Date;
}

export type {
  Offense,
  McqSubmission,
  ObtainedMcqGrade,
  ObtainedGrade,
  MCQAssessmentSubmission,
};
