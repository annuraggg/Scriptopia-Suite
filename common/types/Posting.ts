enum StepType {
  RESUME_SCREENING = "RESUME_SCREENING",
  MCQ_ASSESSMENT = "MCQ_ASSESSMENT",
  CODING_ASSESSMENT = "CODING_ASSESSMENT",
  ASSIGNMENT = "ASSIGNMENT",
  INTERVIEW = "INTERVIEW",
  CUSTOM = "CUSTOM",
}

enum StepStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

enum PostingType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  INTERNSHIP = "internship",
  CONTRACT = "contract",
  TEMPORARY = "temporary",
}

interface Schedule {
  startTime: Date | null;
  endTime: Date | null;
  actualCompletionTime?: Date;
}

interface Slot {
  _id?: string;
  candidate?: string;
  start: Date;
  end: Date;
}

interface Interview {
  _id?: string;
  interview: string;
  workflowId: string;
}

interface ATSLog {
  level: "INFO" | "ERROR" | "WARNING";
  stage: "INIT" | "PROCESSING" | "EMAIL" | "RESUME_PROCESSING" | "DATABASE";
  timestamp: Date;
  message: string;
  error?: {
    name: string;
    message: string;
    stack: string;
  };
  metadata?: {
    candidateId?: string;
    resumeId?: string;
    apiResponse?: unknown;
    processingTime?: number;
    retryCount?: number;
  };
}

interface ATS {
  _id?: string;
  minimumScore: number;
  negativePrompts?: string[];
  positivePrompts?: string[];
  status: "pending" | "processing" | "finished" | "failed";
  startTime?: Date;
  endTime?: Date;
  failedCount?: number;
  successCount?: number;
  error?: string;
  logs?: ATSLog[];
  summary?: {
    totalProcessed: number;
    successfulProcessing: number;
    failedProcessing: number;
    totalTime: number;
    averageProcessingTime: number;
  };
}

interface WorkflowStep {
  _id?: string;
  name: string;
  type: StepType;
  status: StepStatus;
  schedule?: Schedule;
  startedBy?: string;
}

interface Workflow {
  _id?: string;
  steps: WorkflowStep[];
}

interface Salary {
  _id?: string;
  min?: number;
  max?: number;
  currency?: string;
}

  interface Assignment {
    _id?: string;
    name: string;
    workflowId: string;
    description: string;
    submissionType: "file" | "text" | "link";
    submissions?: string[];
  }

interface Assessment {
  _id?: string;
  assessmentId: string;
  workflowId: string;
}

interface AdditionalFieldConfig {
  _id?: string;
  required: boolean;
  allowEmpty: boolean;
}

interface AdditionalDetails {
  basic?: {
    summary?: AdditionalFieldConfig;
  };
  links?: {
    socialLinks?: AdditionalFieldConfig;
  };
  background?: {
    education?: AdditionalFieldConfig;
    workExperience?: AdditionalFieldConfig;
  };
  skills?: {
    technicalSkills?: AdditionalFieldConfig;
    languages?: AdditionalFieldConfig;
    subjects?: AdditionalFieldConfig;
  };
  experience?: {
    responsibilities?: AdditionalFieldConfig;
    projects?: AdditionalFieldConfig;
  };
  achievements?: {
    awards?: AdditionalFieldConfig;
    certificates?: AdditionalFieldConfig;
    competitions?: AdditionalFieldConfig;
  };
  professional?: {
    conferences?: AdditionalFieldConfig;
    patents?: AdditionalFieldConfig;
    scholarships?: AdditionalFieldConfig;
  };
  activities?: {
    volunteerings?: AdditionalFieldConfig;
    extraCurriculars?: AdditionalFieldConfig;
  };
}

interface Posting {
  _id?: string;
  organizationId?: string;
  title: string;
  description: Record<string, unknown>;
  department?: string;
  location: string;
  type: PostingType;
  url?: string;
  openings: number;
  salary: Salary;
  applicationRange: { start: Date; end: Date };
  skills: string[];
  workflow?: Workflow;
  assignments?: Assignment[];
  ats?: ATS;
  mcqAssessments?: Assessment[];
  codeAssessments?: Assessment[];
  interviews?: [Interview];
  candidates?: string[];
  additionalDetails?: AdditionalDetails;
  published: boolean;
  publishedOn?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  Slot,
  Interview,
  ATS,
  ATSLog,
  WorkflowStep,
  Workflow,
  Salary,
  Assignment,
  Assessment,
  AdditionalFieldConfig,
  AdditionalDetails,
  Posting,
  Schedule,
};

export { StepType, StepStatus, PostingType };
