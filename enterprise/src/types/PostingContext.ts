import { ExtendedPosting } from "@shared-types/ExtendedPosting";

interface PostingContext {
  posting: ExtendedPosting;
  setPosting: (posting: ExtendedPosting) => void;
}

export type { PostingContext };
