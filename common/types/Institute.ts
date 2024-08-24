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
    default?: boolean;
    description?: string;
    permissions: string[];
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
  }
  
  interface Institute {
    _id?: string;
    name: string;
    email: string;
    website: string;
    emailDomains?: string[];
    logo?: string;
    members?: Member[];
    roles?: Role[];
    auditLogs?: AuditLog[];
    subscription: Subscription;
    students?: string[];
    drives?: string[];
    createdOn?: Date;
    updatedOn?: Date;
  }

  export type { Member, Role, AuditLog, Subscription, Institute };
  