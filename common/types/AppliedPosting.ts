interface AppliedPostingScore {
    stageId: string;
    score?: number;
  }
  
  interface AppliedPosting {
    posting: string;
    user: string;
    disqualifiedStage?: number;
    disqualifiedReason?: string;
    scores?: AppliedPostingScore[];
    status: "applied" | "inprogress" | "rejected" | "hired";
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type { AppliedPosting, AppliedPostingScore };
  