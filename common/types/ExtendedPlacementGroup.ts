import { Candidate } from "./Candidate";
import { Institute } from "./Institute";
import { PlacementGroup } from "./PlacementGroup";

interface ExtendedPlacementGroup
  extends Omit<
    PlacementGroup,
    "institute" | "candidates" | "pendingCandidates"
  > {
  institute: Institute;
  candidates: Candidate[];
  pendingCandidates: Candidate[];
}

export type { ExtendedPlacementGroup };
