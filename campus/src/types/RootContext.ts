import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification } from "@shared-types/Institute";
import { ExtendedInstitute } from "@shared-types/ExtendedInstitute";
interface RootContext {
  user: MemberWithPermission;
  institute: ExtendedInstitute;
  setInstitute: (institute: ExtendedInstitute) => void;
  notifications: Notification[];
  rerender: boolean;
}

export type { RootContext };
