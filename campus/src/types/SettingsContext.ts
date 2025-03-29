import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Institute } from "@shared-types/Institute";

interface SettingsContext {
  institute: Institute;
  setInstitute: (institute: Institute) => void;
  rerender: boolean;

  toast: boolean;
  setToast: (toast: boolean) => void;
  user: MemberWithPermission;
}

export type { SettingsContext };
