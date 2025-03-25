import { ExtendedCandidate } from "./ExtendedCandidate";
import { Meet } from "./Meet";
import { Organization } from "./Organization";
import { Interview, Posting } from "./Posting";

interface ExtendedPosting
  extends Omit<Posting, "organizationId" | "candidates" | "interviews"> {
  organizationId: Omit<Organization, "members">;
  candidates: ExtendedCandidate[];
  interviews: ExtendedInterviews[];
}

interface ExtendedInterviews extends Omit<Interview, "interview"> {
  interview: Meet;
}

export type { ExtendedPosting, ExtendedInterviews };
