export interface YearStats {
  year: string;
  hired: number;
  highest: number;
  average: number;
}

export interface CompanyGeneralInfo {
  industry: string[];
  yearStats: YearStats[];
  rolesOffered: string[];
}

export interface CompanyHRContact {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface Company {
  _id?: string;
  name: string;
  description?: string;
  generalInfo: CompanyGeneralInfo;
  hrContact?: CompanyHRContact;
  isArchived?: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
