import { ExtendedPosting } from "./ExtendedPosting";
import { Member, Organization } from "./Organization";
import { User } from "./User";

interface ExtendedOrganization
  extends Omit<Organization, "postings" | "members"> {
  postings: ExtendedPosting[];
  members: ExtendedMember[];
}

interface ExtendedMember extends Omit<Member, "user"> {
  user: User;
}

export type { ExtendedOrganization };
