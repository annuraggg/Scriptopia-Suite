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
  notifications?: Notification[];
  status: "pending" | "active";
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
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
  maxStudents: number;
  maxFaculty: number;
  features?: string[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Company {
  _id?: string;
  name: string;
  description?: string;
  generalInfo: {
    industry?: string[];
    yearVisit?: string[];
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
    rolesOffered?: string[];
  };
  hrContacts?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlacementGroup {
  _id?: string;
  name: string;
  startYear?: string;
  endYear?: string;
  departments?: string[];
  purpose?: string;
  expiryDate?: string;
  expiryTime?: string;
  accessType: "public" | "private";
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Candidate {
  candidate: string;
  uid: string;
}

interface Institute {
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
  companies: Company[];
  placementGroups: PlacementGroup[];
  code: string;
  candidates: Candidate[];
  pendingCandidates: Candidate[];
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
  Address,
  Company,
  PlacementGroup,
  Institute,
  Candidate,
};
