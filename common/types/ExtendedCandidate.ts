import { AppliedPosting } from "./AppliedPosting";
import { Candidate } from "./Candidate";
import { User } from "./User";

interface ExtendedCandidate extends Omit<Candidate, "userId"> {
  userId: User;
  appliedPostings: AppliedPosting[];
}

export type { ExtendedCandidate };
