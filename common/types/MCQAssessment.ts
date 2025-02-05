interface Option {
  option: string;
  isCorrect?: boolean;
  matchingPairText?: string;
}

interface Question {
  question: string;
  grade?: number;
  type:
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
  options?: Option[];
  codeSnippet?: string;
  imageSource?: string;
  maxCharactersAllowed?: number;
  fillInBlankAnswers?: string[];
  correct?: string;
}

interface Section {
  name: string;
  questions: Question[];
}

interface Candidate {
  name: string;
  email: string;
}

interface OpenRange {
  start?: Date;
  end?: Date;
}

interface Security {
  sessionPlayback?: boolean;
  tabChangeDetection?: boolean;
  copyPasteDetection?: boolean;
}

interface MCQAssessment {
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
  isEnterprise?: boolean;
  postingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  Option,
  Question,
  Section,
  Candidate,
  OpenRange,
  Security,
  MCQAssessment,
};
