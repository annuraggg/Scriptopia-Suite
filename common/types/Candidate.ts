interface AppliedPosting {
  postingId: string;
  queries?: string[];
  appliedAt?: Date;
  status?: "applied" | "shortlisted" | "rejected" | "hired";
}

interface Candidate {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  website?: string;
  appliedPostings: AppliedPosting[];
  createdAt?: Date;
}

export type { Candidate, AppliedPosting };
