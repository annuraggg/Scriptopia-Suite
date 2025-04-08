import { ExtendedCandidate } from "./ExtendedCandidate";
import { Meet } from "./Meet";
import { Organization } from "./Organization";
import { Interview, Drive } from "./Drive";

interface ExtendedDrive
  extends Omit<Drive, "institute" | "candidates" | "interviews" | "hiredCandidates" | "offerLetters"> {
  institute: Omit<Organization, "members">;
  candidates: ExtendedCandidate[];
  interviews: ExtendedInterviews[];
  department?: string;
  hiredCandidates?: ExtendedCandidate[];
  offerLetters?: string[]
}

interface ExtendedInterviews extends Omit<Interview, "interview"> {
  interview: Meet;
}

export type { ExtendedDrive, ExtendedInterviews };
