interface Option {
  _id?: string;
  option: string;
  isCorrect?: boolean;
  matchingPairText?: string;
}

type QuestionType =
  | "single-select"
  | "multi-select"
  | "true-false"
  | "short-answer"
  | "long-answer"
  | "visual"
  | "peer-review"
  | "output"
  | "fill-in-blanks"
  | "matching";

interface Question {
  _id?: string;
  question: string;
  grade?: number;
  type: QuestionType;
  options?: Option[];
  codeSnippet?: string;
  imageSource?: string;
  maxCharactersAllowed?: number;
  fillInBlankAnswers?: string[];
  correct?: string;
}

interface Section {
  _id?: string;
  name: string;
  questions: Question[];
}

interface Candidate {
  _id?: string;
  name: string;
  email: string;
}

interface OpenRange {
  _id?: string;
  start?: Date;
  end?: Date;
}

interface Security {
  _id?: string;
  sessionPlayback?: boolean;
  tabChangeDetection?: boolean;
  copyPasteDetection?: boolean;
}

interface MCQAssessment {
  _id?: string;
  name: string;
  description: string;
  author: string;
  timeLimit: number;
  passingPercentage: number;
  openRange?: OpenRange;
  sections: Section[];
  candidates: Candidate[];
  public?: boolean;
  instructions: string;
  security: Security;
  feedbackEmail: string;
  obtainableScore: number;
  autoObtainableScore?: boolean;
  isEnterprise?: boolean;
  isCampus?: boolean;
  postingId?: string;
  driveId?: string;
  requiresManualReview?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type {
  Option,
  Question,
  Section,
  Candidate,
  OpenRange,
  Security,
  QuestionType,
  MCQAssessment,
};
