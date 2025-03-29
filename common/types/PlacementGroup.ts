export interface AcademicYear {
  start: string;
  end: string;
}

export interface PlacementGroup {
  _id?: string;
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
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
