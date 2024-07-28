import Permission from "./Permission";

interface Role {
  _id: string;
  name: string;
  default: boolean;
  description?: string;
  permissions: Permission[];
  organization: string;
}

export default Role;
