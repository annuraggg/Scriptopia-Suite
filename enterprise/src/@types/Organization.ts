import Role from "./Roles";

interface Member {
  _id?: string;
  user?: string;
  email: string;
  role: Role;
  // this time format: "2021-09-01T00:00:00.000Z"
  addedOn: string;
  status?: "pending" | "active";
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
  stripeId: string;
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
export type { Member, Department, AuditLog, Subscription };
