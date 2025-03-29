import { AppliedDrive } from "./AppliedDrive";
import { Candidate } from "./Candidate";
import { ExtendedDrive } from "./ExtendedDrive";

interface ExtendedAppliedDrive extends Omit<AppliedDrive, "drive" | "user"> {
  drive: ExtendedDrive;
  user: Candidate
}

export type { ExtendedAppliedDrive };
