  interface Offense {
    _id?: string;
    tabChange?: number;
    copyPaste?: number;
  }

  interface McqSubmission {
    _id?: string;
    mcqId: string;
    selectedOptions: string[];
  }

  interface ObtainedMcqGrade {
    _id?: string;
    mcqId: string;
    obtainedMarks: number;
  }

  interface ObtainedGrade {
    _id?: string;
    mcq?: ObtainedMcqGrade[];
    total: number;
  }

  interface MCQAssessmentSubmission {
    _id?: string;
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
    isReviewed?: boolean;
    reviewedBy?: [string];
    createdAt?: Date;
    updatedAt?: Date;
  }

  export type {
    Offense,
    McqSubmission,
    ObtainedMcqGrade,
    ObtainedGrade,
    MCQAssessmentSubmission,
  };
