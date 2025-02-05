interface Notification {
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

interface Members {
  user?: string;
  email: string;
  role: string;
  addedOn: Date;
  notifications?: Notification[];
  status: "pending" | "active";
}

interface Roles {
  name: string;
  slug: string;
  default: boolean;
  description?: string;
  permissions: string[];
}

interface Departments {
  name: string;
  description: string;
}

interface AuditLog {
  action: string;
  user: string;
  userId: string;
  date: Date;
  type: "info" | "warning" | "error" | "success";
}

interface Subscription {
  type: "quarterly" | "annual" | "trial";
  status: "active" | "inactive";
  startedOn: Date;
  endsOn: Date;
}

interface Organization {
  name: string;
  email: string;
  website: string;
  logo?: string;
  members: Members[];
  roles: Roles[];
  departments: Departments[];
  auditLogs: AuditLog[];
  subscription: Subscription;
  candidates?: string[];
  postings?: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  Notification,
  Members,
  Roles,
  Departments,
  AuditLog,
  Subscription,
  Organization,
};
