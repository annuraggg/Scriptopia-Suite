import { Candidate } from "./Candidate";
import { ExtendedAppliedPosting } from "./ExtendedAppliedPosting";
import { User } from "./User";

interface ExtendedCandidate
  extends Omit<Candidate, "userId" | "appliedPostings"> {
  userId: User;
  appliedPostings: ExtendedAppliedPosting[];
}

export type { ExtendedCandidate };
