export interface AcademicYear {
  start: string;
  end: string;
}

export interface PlacementGroupDocument {
  name: string;
  institute: string;
  academicYear: AcademicYear;
  departments: string[];
  purpose?: string;
  expiryDate: Date;
  accessType: "public" | "private";
  candidates: string[];
  pendingCandidates: string[];
  createdBy: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

export interface PlacementGroupRule {
  _id?: string;
  category: string;
  subcategory: string;
  operator: string;
  value: any;
  type?: string;
  createdAt?: Date;
}

/**
 * PlacementGroup interface for client-side usage
 * Pure TypeScript interface without Mongoose specific types
 */
export interface PlacementGroup {
  _id?: string;
  name: string;
  institute: string;
  academicYear: AcademicYear;
  departments: string[];
  purpose?: string;
  expiryDate: Date;
  criteria?: PlacementGroupRule[];
  candidates: string[];
  pendingCandidates: string[];
  createdBy: string;
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}
