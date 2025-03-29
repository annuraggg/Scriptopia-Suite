import { Candidate } from "./Candidate";
import { Drive } from "./Drive";
import { Institute } from "./Institute";

interface ExtendedInstitute
  extends Omit<Institute, "candidates" | "pendingCandidates" | "drives"> {
  drives: Drive[];
  candidates: Candidate[];
  pendingCandidates: Candidate[];
}

export type { ExtendedInstitute };
