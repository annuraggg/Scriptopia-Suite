import { Institute } from "@shared-types/Institute";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification } from "@shared-types/Institute";
import { Drive } from "@shared-types/Drive";

interface InstituteWithDrives extends Omit<Institute, "drives"> {
  drives: Drive[]
}

interface RootContext {
  user: MemberWithPermission;
  institute: InstituteWithDrives;
  setInstitute: (institute: InstituteWithDrives) => void;
  notifications: Notification[];
  rerender: boolean;
}

export type { RootContext, InstituteWithDrives};
