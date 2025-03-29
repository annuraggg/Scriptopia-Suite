import { AppliedPosting } from "./AppliedPosting";
import { ExtendedPosting } from "./ExtendedPosting";

interface ExtendedAppliedPosting extends Omit<AppliedPosting, "posting"> {
  posting: ExtendedPosting;
}

export type { ExtendedAppliedPosting };
