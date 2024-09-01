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

interface Assessment {
  _id?: string;
  assessmentId: string;
}

interface Ats {
  _id?: string;
  minimumScore: number;
  negativePrompts: string[];
  positivePrompts: string[];
}

interface Candidate {
  _id?: string;
  candidateId?: string;
  disqualifiedStage?: number;
  disqualifiedReason?: string;
  status: "pending" | "qualified" | "rejected";
}

interface Auto {
  _id?: string;
  step: number;
  start: Date;
  end?: Date;
}

interface WorkflowStep {
  _id?: string;
  name: string;
  type: "rs" | "sa" | "ca" | "pi" | "cu";
}

interface Workflow {
  _id?: string;
  steps: WorkflowStep[];
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
  dueDate: Date;
}

interface Posting {
  _id?: string;
  title: string;
  description: string;
  department?: string;
  location: string;
  type: "full_time" | "part_time" | "internship";
  openings: number;
  salary: Salary;
  workflow?: Workflow;
  applicationRange: {
    start: Date;
    end: Date;
  };
  qualifications: string;
  skills: string[];
  ats: Ats;

  assessments: Assessment[];
  assignments: Assignment[];
  interview: Interview;
  candidates: Candidate[];
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
  Candidate,
  Ats,
  Assessment,
  Interview,
  Interviewer,
};
