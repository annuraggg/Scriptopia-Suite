import { Institute } from "@shared-types/Instititue";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification } from "@shared-types/Organization";
import { Posting } from "@shared-types/Posting";

interface InstituteWithDrives extends Omit<Institute, "drives"> {
  drives: Posting[]
}

interface RootContext {
  user: MemberWithPermission;
  institute: InstituteWithDrives;
  setInstitute: (institute: InstituteWithDrives) => void;
  notifications: Notification[];
  rerender: boolean;
}

export type { RootContext, InstituteWithDrives};
