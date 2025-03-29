interface AppliedDriveScore {
    _id?: string;
    stageId: string;
    score?: number;
    reason?: string;
  }
  
  type AppliedDriveStatus = "applied" | "inprogress" | "rejected" | "hired";
  
  interface AppliedDrive {
    _id?: string;
    drive: string;
    user: string;
    disqualifiedStage?: number;
    disqualifiedReason?: string;
    scores?: AppliedDriveScore[];
    status: AppliedDriveStatus;
    resumeUrl?: string;
    resumeExtract?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export type { AppliedDrive, AppliedDriveScore, AppliedDriveStatus };
  