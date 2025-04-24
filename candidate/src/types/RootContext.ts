import { ExtendedCandidate } from "@shared-types/ExtendedCandidate";
import { Notification } from "@shared-types/Notification";

interface RootContext {
  user: ExtendedCandidate;
  setUser: (user: ExtendedCandidate) => void;
  notifications: Notification[];
  setNotifications: (
    notifications: Notification[],
    notificationId: string
  ) => void;
}

export default RootContext;
