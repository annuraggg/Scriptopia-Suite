import { ExtendedCandidate } from "./ExtendedCandidate";
import { Meet } from "./Meet";
import { Organization } from "./Organization";
import { Interview, Drive } from "./Drive";

interface ExtendedDrive
  extends Omit<Drive, "organizationId" | "candidates" | "interviews"> {
  organizationId: Omit<Organization, "members">;
  candidates: ExtendedCandidate[];
  interviews: ExtendedInterviews[];
}

interface ExtendedInterviews extends Omit<Interview, "interview"> {
  interview: Meet;
}

export type { ExtendedDrive, ExtendedInterviews };
