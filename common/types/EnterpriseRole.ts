interface Role {
  _id?: string;
  name: string;
  default: boolean;
  description?: string;
  permissions: string[];
  organization: string;
}

export type { Role };
