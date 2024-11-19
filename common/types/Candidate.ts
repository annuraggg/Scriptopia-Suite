interface AppliedPosting {
  postingId: string; // Required
  query?: string;
  appliedAt?: Date;
  disqualifiedStage?: number;
  disqualifiedReason?: string;
  scores: {
    rs?: {
      score: number;
      reason: string;
    };
    mcqa?: {
      score: number;
      mcqaId: string;
    }[];
    ca?: {
      score: number;
      caId: string;
    }[];
    mcqca?: {
      score: number;
      mcqaId: string;
      caId: string;
    }[];
    as?: {
      score: number;
      asId: string;
      submittedOn?: Date; // Added this field to match the Mongoose model
    }[];
    pi?: {
      score: number;
      piId: string;
    };
    cu?: {
      score: number;
      cuId: string;
    }[];
  };
  status?: "applied" | "inprogress" | "rejected" | "hired"; // Updated to match Mongoose model
  currentStepStatus?: "qualified" | "disqualified" | "pending";
}

interface Candidate {
  name: string;
  _id: string;
  userId?: string; // Optional as per the model
  firstName: string; // Required
  lastName: string; // Required
  email: string; // Required
  phone: string; // Required
  resumeUrl?: string;
  website?: string;
  resumeExtract?: string;
  appliedPostings: AppliedPosting[];
  createdAt?: Date;
}

export type { Candidate, AppliedPosting };
