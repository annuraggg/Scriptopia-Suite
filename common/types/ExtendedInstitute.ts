import { ExtendedInstituteCandidate } from "./ExtendedInstituteCandidate";
import { Institute } from "./Institute";

interface ExtendedInstitute
  extends Omit<Institute, "candidates" | "pendingCandidates"> {
  candidates: ExtendedInstituteCandidate[];
  pendingCandidates: ExtendedInstituteCandidate[];
}

export type { ExtendedInstitute };
