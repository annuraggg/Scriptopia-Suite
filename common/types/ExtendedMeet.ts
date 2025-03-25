import { Candidate } from "./Candidate";
import { Meet } from "./Meet";
import { User } from "./User";

interface ExtendedMeet
  extends Omit<Meet, "candidates" | "interviewers" | "completed" | "current"> {
  candidates: Candidate[];
  interviewers: User;
  completed: Candidate[];
  current: Candidate;
}

export type { ExtendedMeet };
