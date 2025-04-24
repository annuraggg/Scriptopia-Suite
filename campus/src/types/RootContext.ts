import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification } from "@shared-types/Notification";
import { ExtendedInstitute } from "@shared-types/ExtendedInstitute";
interface RootContext {
  user: MemberWithPermission;
  institute: ExtendedInstitute;
  setInstitute: (institute: ExtendedInstitute) => void;
  notifications: Notification[];
  setNotifications: (
    notifications: Notification[],
    notificationId: string
  ) => void;
  rerender: boolean;
}

export type { RootContext };
