interface Slot {
  _id?: string;
  candidate?: string; // Should match the ObjectId type from Mongoose
  start: Date;
  end: Date;
}

interface Interviewer {
  _id?: string;
  interviewer: string; // Name or identifier for the interviewer
  candidates: string[]; // Candidate IDs
  meetingLink: string; // Link for the interview meeting
  timeSlot?: {
    start: Date;
    end?: Date; // Made optional to match Mongoose schema
  };
}

interface Interview {
  _id?: string;
  assignees: Interviewer[]; // Array of Interviewer objects
  duration: number; // Duration in minutes
  slots: Slot[]; // Match with Mongoose schema for slots
  days: string[]; // Days when the interviews will occur
  timeSlotStart: string; // Start time for the time slots
  timeSlotEnd: string; // End time for the time slots
}

interface Ats {
  _id?: string; // Optional ID
  minimumScore: number; // Minimum score required
  negativePrompts?: string[]; // Optional negative prompts
  positivePrompts?: string[]; // Optional positive prompts
  status: "pending" | "processing" | "finished"; // Status of the ATS
}

interface Auto {
  _id?: string; // Optional ID
  step: number; // Step number
  start: Date; // Start time of the auto step
  end?: Date; // End time of the auto step, optional
}

interface WorkflowStep {
  _id?: string; // Optional ID
  name: string; // Name of the workflow step
  type: "rs" | "mcqa" | "ca" | "mcqca" | "as" | "pi" | "cu"; // Type of step
  stepId: string; // ID of the step
}

interface Workflow {
  _id?: string; // Optional ID
  steps?: WorkflowStep[]; // Array of workflow steps
  currentStep: number; // Current step number
  behavior: "manual" | "auto"; // Behavior type
  auto?: Auto[]; // Array of Auto steps
}

interface Salary {
  _id?: string; // Optional ID
  min?: number; // Minimum salary
  max?: number; // Maximum salary
  currency?: string; // Currency type
}

interface Assignment {
  _id?: string; // Optional ID
  name: string; // Assignment name
  description: string; // Assignment description
  submissions: string[]; // Array of candidate IDs who submitted
}

interface Assessment {
  assessmentId: string; // Assessment ID
  stepId: string; // Step ID
  _id?: string; // Optional ID
}

interface Posting {
  _id?: string; // Optional ID
  organizationId?: string; // Organization ID
  title: string; // Posting title
  description: string; // Job description
  department?: string; // Department ID
  location: string; // Job location
  type: "full_time" | "part_time" | "internship"; // Job type
  url?: string; // URL for the job posting
  openings: number; // Number of openings
  salary: Salary; // Salary details
  workflow?: Workflow; // Workflow associated with the posting
  applicationRange: {
    start: string; // Start date for applications
    end: string; // End date for applications
  };
  qualifications: string; // Required qualifications
  assignments: Assignment[]; // Array of assignments related to the job
  skills: string[]; // Required skills
  ats?: Ats; // ATS configuration
  assessments?: Assessment[]; // Array of assessment IDs
  interview?: Interview; // Interview details
  candidates?: string[]; // Array of candidate IDs
  published?: boolean; // Published status
  publishedOn?: Date; // Date published
  createdOn: Date; // Creation date
  updatedOn: Date; // Last updated date
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
  Slot, // Exporting Slot interface as well
};
