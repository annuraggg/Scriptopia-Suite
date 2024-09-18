interface Interviewer {
  _id?: string;
  interviewer: string;
  candidates: string[];
  meetingLink: string;
  timeSlot?: {
    start: Date;
    end?: Date;
  };
}

interface Interview {
  _id?: string;
  assignees: Interviewer[];
  duration: number;
}

interface Ats {
  _id?: string;
  minimumScore: number;
  negativePrompts: string[];
  positivePrompts: string[];
  status: "pending" | "processing" | "finished";
}

interface Auto {
  _id?: string;
  step: number;
  start: Date;
  end?: Date; // Changed to optional to match the Mongoose schema
}

interface WorkflowStep {
  _id?: string;
  name: string;
  type: "rs" | "mcqa" | "ca" | "mcqca" | "as" | "pi" | "cu";
  stepId: string;
}

interface Workflow {
  _id?: string;
  steps?: WorkflowStep[];
  currentStep: number;
  behavior: "manual" | "auto";
  auto?: Auto[];
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
  description: string;
  submissions: string[];
}

interface Posting {
  _id?: string;
  organizationId?: string;
  title: string;
  description: string;
  department?: string;
  location: string;
  type: "full_time" | "part_time" | "internship";
  url?: string;
  openings: number;
  salary: Salary;
  workflow?: Workflow;
  applicationRange: {
    start: Date;
    end: Date;
  };
  qualifications: string;
  assignments: Assignment[];
  skills: string[];
  ats: Ats;
  assessments: string[];
  interview: Interview;
  candidates: string[];
  published?: boolean;
  publishedOn?: Date;
  createdOn: Date;
  updatedOn: Date;
}

export type {
  Posting,
  Salary,
  Workflow,
  WorkflowStep,
  Auto,
  Ats,
  Interview,
  Interviewer,
  Assignment,
};
