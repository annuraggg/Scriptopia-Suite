import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Organization } from "@shared-types/Organization";

interface SettingsContext {
  organization: Organization;
  setOrganization: (organization: Organization) => void;
  rerender: boolean;

  toast: boolean;
  setToast: (toast: boolean) => void;
  user: MemberWithPermission;
}

export type { SettingsContext };
