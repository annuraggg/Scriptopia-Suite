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
    addedOn: Date;
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
    head: string;
    faculty: string[];
    courses: string[];
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
    features: string[];
    maxStudents: number;
    maxFaculty: number;
  }
  
  interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }
  
  interface Accreditation {
    _id?: string;
    name: string;
    issuedBy: string;
    validUntil: Date;
  }
  
  interface Company {
    _id?: string;
    name: string;
    description?: string;
    generalInfo: {
      industry: string[];
      yearVisit: string[];
      studentsHired: number;
      averagePackage: number;
      highestPackage: number;
      rolesOffered: string[];
    };
    stats: Array<{
      title: string;
      value: string;
      change: string;
      trend: "up" | "down";
    }>;
    hrContacts: {
      name: string;
      phone: string;
      email: string;
      website: string;
    };
    instituteId: string;
  }
  
  interface PlacementGroup {
    _id?: string;
    name: string;
    startYear: string;
    endYear: string;
    departments: string[];
    purpose: string;
    expiryDate: string;
    expiryTime: string;
    accessType: "public" | "private";
    inviteLink: string;
    instituteId: string;
  }
  
  interface Institute {
    _id?: string;
    name: string;
    email: string;
    website: string;
    logo?: string;
    emailDomains?: string[];
    address: Address;
    members: Member[];
    roles: Role[];
    departments: Department[];
    auditLogs: AuditLog[];
    subscription: Subscription;
    students?: string[];
    faculty?: string[];
    courses?: string[];
    drives?: string[];
    accreditations?: Accreditation[];
    companies?: string[];
    placementGroups?: string[];
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
    Accreditation,
    Company,
    PlacementGroup,
    Institute,
  };