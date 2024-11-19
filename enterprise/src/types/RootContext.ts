import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification, Organization } from "@shared-types/Organization";

interface RootContext {
  user: MemberWithPermission;
  organization: Organization;
  setOrganization: (organization: Organization) => void;
  notifications: Notification[];
}

export type { RootContext };
