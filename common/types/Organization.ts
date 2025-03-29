interface Notification {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

interface Member {
  _id?: string;
  user?: string;
  email: string;
  role: string;
  createdAt: Date;
  notifications?: Notification[];
  status: "pending" | "active";
}

interface Role {
  _id?: string;
  name: string;
  slug: string;
  default: boolean;
  description?: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
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
  type: "info" | "warning" | "error" | "success";
  createdAt?: Date;
  updatedAt?: Date;
}

interface Subscription {
  _id?: string;
  type: "quarterly" | "annual" | "trial";
  status: "active" | "inactive";
  startedOn: Date;
  endsOn: Date;
}

interface Organization {
  _id?: string;
  name: string;
  email: string;
  website: string;
  logo?: string;
  members: Member[];
  roles: Role[];
  departments: Department[];
  auditLogs: AuditLog[];
  subscription: Subscription;
  candidates?: string[];
  postings?: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  Notification,
  Member,
  Role,
  Department,
  AuditLog,
  Subscription,
  Organization,
};
