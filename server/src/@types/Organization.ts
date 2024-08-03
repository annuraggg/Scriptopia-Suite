interface Member {
  _id?: string;
  user?: string;
  email: string;
  role: string;
  addedOn?: Date;
  status?: "pending" | "active";
}

interface Role {
  _id?: string;
  name: string;
  description: string;
  permissions?: string[];
  default: boolean;
  organization: string;
}

interface Department {
  _id?: string;
  name: string;
  description: string;
}

interface AuditLog {
  _id?: string;
  action: string;
  user: string;
  date: string;
  type: "info" | "warning" | "error" | "success";
}

interface Subscription {
  _id?: string;
  type: "quarterly" | "annual" | "trial";
  status?: "active" | "inactive";
  startedOn: Date;
  endsOn: Date;
  lemonSqueezyId: string;
}

interface Organization {
  _id?: string;
  name: string;
  email: string;
  website: string;
  logo?: string;
  members?: Member[];
  roles?: Role[];
  departments?: Department[];
  auditLogs?: AuditLog[];
  subscription: Subscription;
  candidates?: string[];
  postings?: string[];
  createdOn?: Date;
  updatedOn?: Date;
}

export default Organization;
export { Member, Role, Department, AuditLog, Subscription };
