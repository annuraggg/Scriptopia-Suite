interface AppliedPosting {
  postingId: string;
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
  status?: "applied" | "shortlisted" | "rejected" | "hired";
}

interface Candidate {
  name: string;
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  website?: string;
  resumeExtract?: string;
  appliedPostings: AppliedPosting[];
  createdAt?: Date;
}

export type { Candidate, AppliedPosting };
