import { Candidate } from "./Institute";
import { Candidate as ICandidate } from "./Candidate";

interface ExtendedInstituteCandidate extends Omit<Candidate, "candidate"> {
  candidate: ICandidate;
}

export type { ExtendedInstituteCandidate };
