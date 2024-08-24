import { Role } from "./EnterpriseRole";

interface Member {
  _id?: string;
  user?: string;
  email: string;
  role: Role;
  addedOn?: Date;
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
  userId: string;
  date?: Date;
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

export type { Member, Department, AuditLog, Subscription, Organization };
