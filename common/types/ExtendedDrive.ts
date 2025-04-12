import { ExtendedCandidate } from "./ExtendedCandidate";
import { Meet } from "./Meet";
import { Organization } from "./Organization";
import { Interview, Drive } from "./Drive";
import { Company } from "./Company";

interface ExtendedDrive
  extends Omit<Drive, "institute" | "candidates" | "interviews" | "hiredCandidates" | "offerLetters" | "company"> {
  institute: Omit<Organization, "members">;
  candidates: ExtendedCandidate[];
  interviews: ExtendedInterviews[];
  department?: string;
  hiredCandidates?: ExtendedCandidate[];
  offerLetters?: string[]
  company: Company;
}

interface ExtendedInterviews extends Omit<Interview, "interview"> {
  interview: Meet;
}

export type { ExtendedDrive, ExtendedInterviews };
