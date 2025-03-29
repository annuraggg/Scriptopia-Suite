import { ExtendedDrive } from "@shared-types/ExtendedDrive";

interface DriveContext {
  drive: ExtendedDrive;
  setDrive: (drive: ExtendedDrive) => void;
  refetch: () => void;
}

export type { DriveContext };
