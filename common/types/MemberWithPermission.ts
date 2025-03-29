import { Member } from "./Organization";
import { User } from "./User";

interface MemberWithPermission extends Member {
  userInfo?: Omit<User, "_id">;
  permissions: string[];
}

export type { MemberWithPermission };