interface Member {
  _id?: string;
  user?: string; // User ID or Name (as per your schema, it's a String)
  email: string;
  role: string; // Role ID (ObjectId reference in your schema)
  addedOn?: Date;
  status?: "pending" | "active";
}

interface Role {
  _id?: string;
  name: string;
  default?: boolean; // Indicates if it's the default role
  description?: string;
  permissions: string[]; // List of permissions
}

interface AuditLog {
  _id?: string;
  action: string; // Description of the action performed
  user: string; // Username or user identifier
  userId: string; // User ID
  date?: Date; // Date the action occurred
  type: "info" | "warning" | "error" | "success"; // Enum for type of log
}

interface Subscription {
  _id?: string;
  type: "quarterly" | "annual" | "trial"; // Subscription type enum
  status?: "active" | "inactive"; // Subscription status enum
  startedOn: Date; // Date when the subscription started
  endsOn: Date; // Date when the subscription ends
}

interface Institute {
  _id?: string;
  name: string; // Name of the institute
  email: string; // Contact email of the institute
  website: string; // Institute website
  emailDomains?: string[]; // Optional list of allowed email domains
  logo?: string; // Logo URL or reference
  members?: Member[]; // Array of Member objects
  roles?: Role[]; // Array of Role objects
  auditLogs?: AuditLog[]; // Array of AuditLog objects
  subscription: Subscription; // Subscription details
  students?: string[]; // Array of student IDs (ObjectId references)
  drives?: string[]; // Array of drive IDs (ObjectId references)
  createdOn?: Date; // Date when the institute was created
  updatedOn?: Date; // Date when the institute was last updated
}

export type { Member, Role, AuditLog, Subscription, Institute };
