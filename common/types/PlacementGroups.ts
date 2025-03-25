
export interface PlacementGroup {
  _id?: String;
  name: string;
  startYear: string;
  endYear: string;
  departments: string[];
  purpose: string;
  expiryDate: string;
  expiryTime: string;
  accessType: "public" | "private";
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlacementGroupFilter {
  year?: string;
  departments?: string[];
}

export interface CreatePlacementGroupRequest {
  name: string;
  startYear: string;
  endYear: string;
  departments: string[];
  purpose: string;
  expiryDate: string;
  expiryTime: string;
  accessType: "public" | "private";
}

export interface UpdatePlacementGroupRequest {
  _id: string;
  name?: string;
  startYear?: string;
  endYear?: string;
  departments?: string[];
  purpose?: string;
  expiryDate?: string;
  expiryTime?: string;
  accessType?: "public" | "private";
}

export interface ArchivePlacementGroupRequest {
  id: string;
}