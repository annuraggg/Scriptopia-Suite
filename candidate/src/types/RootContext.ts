import { ExtendedCandidate } from "@shared-types/ExtendedCandidate";

interface RootContext {
  user: ExtendedCandidate;
  setUser: (user: ExtendedCandidate) => void;
}

export default RootContext;
