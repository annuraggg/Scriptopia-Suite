import { AppliedPosting } from "./AppliedPosting";
import { Candidate } from "./Candidate";
import { ExtendedPosting } from "./ExtendedPosting";

interface ExtendedAppliedPosting extends Omit<AppliedPosting, "posting" | "user"> {
  posting: ExtendedPosting;
  user: Candidate
}

export type { ExtendedAppliedPosting };
