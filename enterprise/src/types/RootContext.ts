import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification, Organization } from "@shared-types/Organization";
import { Posting } from "@shared-types/Posting";

interface OrganizationWithPostings extends Omit<Organization, "postings"> {
  postings: Posting[]
}

interface RootContext {
  user: MemberWithPermission;
  organization: OrganizationWithPostings;
  setOrganization: (organization: OrganizationWithPostings) => void;
  notifications: Notification[];
  rerender: boolean;
}

export type { RootContext, OrganizationWithPostings};
