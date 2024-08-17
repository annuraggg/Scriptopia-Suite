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
  end: Date;
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

interface Posting {
  _id?: string;
  title: string;
  description: string;
  department?: string;
  schedule: "full" | "part" | "intern";
  openings: number;
  location: string;
  salaryRange: Salary;
  workflow?: Workflow;
  ats: Ats;
  assessments: Assessment[];
  interview: Interview;
  candidates: Candidate[];
  publishedOn: Date;
  createdOn: Date;
  updatedOn: Date;
}

export default Posting;
export type { Interviewer, Interview, Assessment, Ats, Candidate, Auto, WorkflowStep, Workflow, Salary };