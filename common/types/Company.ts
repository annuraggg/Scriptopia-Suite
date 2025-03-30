export interface CompanyGeneralInfo {
  industry: string[];
  yearVisit: string[];
  studentsHired: number;
  averagePackage: number;
  highestPackage: number;
  rolesOffered: string[];
}

export interface CompanyHRContacts {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface Company {
  _id: string;
  name: string;
  description?: string;
  generalInfo: CompanyGeneralInfo;
  hrContacts?: CompanyHRContacts;
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
