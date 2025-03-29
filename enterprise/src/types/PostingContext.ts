import { ExtendedPosting } from "@shared-types/ExtendedPosting";

interface PostingContext {
  posting: ExtendedPosting;
  setPosting: (posting: ExtendedPosting) => void;
  refetch: () => void;
}

export type { PostingContext };
