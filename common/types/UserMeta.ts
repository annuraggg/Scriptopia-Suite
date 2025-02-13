import { Role } from "./Organization";

interface UserMeta {
  _id: string;
  organization?: {
    _id: string;
    name: string;
    role: Role;
  };
  institute?: {
    _id: string;
    name: string;
    role: Role;
  };
}

export type { UserMeta };
