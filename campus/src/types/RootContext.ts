import { Institute } from "@shared-types/Instititue";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification, Organization } from "@shared-types/Organization";
import { Posting } from "@shared-types/Posting";

interface InstituteWithDrives extends Omit<Institute, "drives"> {
  drives: Posting[]
}

interface RootContext {
  user: MemberWithPermission;
  organization: InstituteWithDrives;
  setOrganization: (organization: InstituteWithDrives) => void;
  notifications: Notification[];
  rerender: boolean;
}

export type { RootContext, InstituteWithDrives};
