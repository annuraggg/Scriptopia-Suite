export interface Notification {
  title: string;
  description: string;
  date?: Date;
  read?: boolean;
}

export interface Role {
  _id?: string;
  name: string;
  slug: string;
  default?: boolean;
  description?: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Member {
  _id?: string;
  user?: string;
  email: string;
  role: string;
  notifications?: Notification[];
  status?: "pending" | "active";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Department {
  _id?: string;
  name: string;
  description: string;
}

export interface AuditLog {
  action: string;
  user: string;
  userId: string;
  type: "info" | "warning" | "error" | "success";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Subscription {
  type: "quarterly" | "annual" | "trial";
  status?: "active" | "inactive";
  startedOn?: Date;
  endsOn: Date;
  maxStudents: number;
  maxFaculty: number;
  features?: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Institute {
  _id?: string;
  name: string;
  email: string;
  website: string;
  logo?: string;
  address: Address;
  members: Member[];
  roles: Role[];
  departments: Department[];
  auditLogs: AuditLog[];
  subscription: Subscription;
  drives?: string[];
  companies?: string[];
  placementGroups?: string[];
  candidates: string[];
  pendingCandidates: string[];
  code: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
