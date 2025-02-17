import { ExtendedCandidate } from "./ExtendedCandidate";
import { Organization } from "./Organization";
import { Posting } from "./Posting";

interface ExtendedPosting extends Omit<Posting, "organizationId" | "candidates"> {
  organizationId: Omit<Organization, "members">;
  candidates: ExtendedCandidate[];
}

export type { ExtendedPosting };
