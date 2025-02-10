import { Candidate } from "./Candidate";
import { User } from "./User";

interface ExtendedCandidate extends Omit<Candidate, "userId"> {
  userId: User;
}

export type { ExtendedCandidate };
