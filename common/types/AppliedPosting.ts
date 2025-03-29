interface AppliedPostingScore {
  _id?: string;
  stageId: string;
  score?: number;
  reason?: string;
}

type AppliedPostingStatus = "applied" | "inprogress" | "rejected" | "hired";

interface AppliedPosting {
  _id?: string;
  posting: string;
  user: string;
  disqualifiedStage?: number;
  disqualifiedReason?: string;
  scores?: AppliedPostingScore[];
  status: AppliedPostingStatus;
  resumeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { AppliedPosting, AppliedPostingScore, AppliedPostingStatus };
