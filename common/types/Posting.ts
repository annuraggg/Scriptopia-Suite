type StepType =
  | "RESUME_SCREENING"
  | "MCQ_ASSESSMENT"
  | "CODING_ASSESSMENT"
  | "ASSIGNMENT"
  | "INTERVIEW"
  | "CUSTOM";

interface Slot {
  _id?: string;
  candidate?: string;
  start: Date;
  end: Date;
}

interface Interview {
  _id?: string;
  assignees?: string[];
  duration: number;
  slots: Slot[];
  days: string[];
  timeSlotStart: string;
  timeSlotEnd: string;
}

interface ATS {
  _id?: string;
  minimumScore: number;
  negativePrompts?: string[];
  positivePrompts?: string[];
  status: "pending" | "processing" | "finished";
  lastUpdated: Date;
}

interface WorkflowStep {
  _id?: string;
  name: string;
  type: StepType;
  completed: boolean;
  timestamp: Date;
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
  type: "full_time" | "part_time" | "internship" | "contract" | "temporary";
  url?: string;
  openings: number;
  salary: Salary;
  applicationRange: { start: Date; end: Date };
  skills: string[];
  workflow?: Workflow;
  assignments?: Assignment[];
  ats?: ATS;
  assessments?: Assessment[];
  interview?: Interview;
  candidates?: string[];
  additionalDetails?: AdditionalDetails;
  published: boolean;
  publishedOn?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  StepType,
  Slot,
  Interview,
  ATS,
  WorkflowStep,
  Workflow,
  Salary,
  Assignment,
  Assessment,
  AdditionalFieldConfig,
  AdditionalDetails,
  Posting,
};
