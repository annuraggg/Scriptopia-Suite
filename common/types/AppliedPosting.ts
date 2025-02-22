interface AppliedPostingScore {
  _id?: string;
  stageId: string;
  score?: number;
  reason?: string;
}

interface AppliedPosting {
  _id?: string;
  posting: string;
  user: string;
  disqualifiedStage?: number;
  disqualifiedReason?: string;
  scores?: AppliedPostingScore[];
  status: "applied" | "inprogress" | "rejected" | "hired";
  resumeUrl?: string;
  resumeExtract?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { AppliedPosting, AppliedPostingScore };
