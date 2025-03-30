import { Candidate } from "./Candidate";
import { Company } from "./Company";
import { Drive } from "./Drive";
import { Institute } from "./Institute";

interface ExtendedInstitute
  extends Omit<Institute, "candidates" | "pendingCandidates" | "drives" | "companies"> {
  drives: Drive[];
  candidates: Candidate[];
  pendingCandidates: Candidate[];
  companies: Company[];
}

export type { ExtendedInstitute };
