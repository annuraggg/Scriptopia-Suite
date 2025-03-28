export interface Notification {
  title: string;
  description: string;
  date?: Date;
  read?: boolean;
}

export interface Role {
  name: string;
  slug: string;
  default?: boolean;
  description?: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Member {
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

export interface Candidate {
  candidate?: string;
  uid: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Institute {
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
  candidates: Candidate[];
  pendingCandidates: Candidate[];
  code: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
