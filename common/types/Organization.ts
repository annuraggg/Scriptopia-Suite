interface Notification {
  _id?: string;
  title: string;
  description: string;
  date?: Date;
  read?: boolean;
}

interface Role {
  _id?: string;
  name: string;
  slug: string;
  default?: boolean;
  description?: string;
  permissions: string[];
}

interface Member {
  _id?: string;
  user?: string;
  email: string;
  role: string | Role;
  addedOn?: Date;
  notifications?: Notification[]; // Updated to include notifications
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
  candidates?: string[]; // Assuming these are string references to candidates
  postings?: string[]; // Assuming these are string references to postings
  createdOn?: Date;
  updatedOn?: Date;
}

export type {
  Member,
  Department,
  AuditLog,
  Subscription,
  Organization,
  Role,
  Notification,
};
