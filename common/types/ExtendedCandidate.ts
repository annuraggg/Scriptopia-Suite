import { AppliedDrive } from "./AppliedDrive";
import { AppliedPosting } from "./AppliedPosting";
import { Candidate } from "./Candidate";
import { User } from "./User";

interface ExtendedCandidate
  extends Omit<Candidate, "userId" | "appliedPostings" | "appliedDrives"> {
  userId: User;
  appliedPostings: AppliedPosting[];
  appliedDrives: AppliedDrive[];
}

export type { ExtendedCandidate };
