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
  name: string;
}

interface Ats {
  _id?: string;
  minimumScore: number;
  negativePrompts: string[];
  positivePrompts: string[];
}

interface Assignment {
  _id?: string;
  name: string;
  description: string;
  dueDate: Date;
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
  end: Date;
}

interface WorkflowStep {
  _id?: string;
  name: string;
  type: "rs" | "mcqa" | "ca" | "mcqca" | "as" | "pi" | "cu";
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
  show?: boolean;
  currency?: string;
}

interface Drive {
  _id?: string;
  instituteId: string;
  title: string;
  about: string;
  qualifications: string;
  skills: string[];
  location: string;
  salary: Salary;
  applicationRange: {
    start: Date;
    end: Date;
  };
  candidates?: Candidate[];
  workflow?: Workflow;
  ats?: Ats;
  assessments?: Assessment[];
  assignments?: Assignment[];
  interview?: Interview;
  published?: boolean;
  publishedOn?: Date;
  createdOn?: Date;
  updatedOn?: Date;
}

export type { Interviewer, Interview, Assessment, Ats, Assignment, Candidate, Auto, WorkflowStep, Workflow, Salary, Drive };
