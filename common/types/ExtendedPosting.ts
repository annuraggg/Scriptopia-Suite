import { Organization } from "./Organization";
import { Posting } from "./Posting";

interface ExtendedPosting extends Omit<Posting, "organizationId"> {
  organizationId: Omit<Organization, "members">;
}

export type { ExtendedPosting };
