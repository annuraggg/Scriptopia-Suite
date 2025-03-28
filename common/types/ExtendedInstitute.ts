import { Candidate } from "./Candidate";
import { Institute } from "./Institute";

interface ExtendedInstitute
  extends Omit<Institute, "candidates" | "pendingCandidates"> {
  candidates: Candidate[];
  pendingCandidates: Candidate[];
}

export type { ExtendedInstitute };
