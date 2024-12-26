interface Security {
  sessionPlayback: boolean;
  tabChangeDetection: boolean;
  copyPasteDetection: boolean;
}

interface OpenRange {
  start?: Date;
  end?: Date;
}

interface Candidate {
  name: string;
  email: string;
}

interface Section {
  name: string;
  questions: Question[];
}

interface Question {
  _id?: string;
  question: string;
  type: QuestionType;
  options?: Option[];
  codeSnippet?: string;
  imageSource?: string;
  maxCharactersAllowed?: number;
  fillInBlankAnswers?: string[];
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

interface Option {
  option: string;
  isCorrect?: boolean;
  matchingPairText?: string;
}

interface Assessment {
  _id: string;
  name: string;
  description: string;
  author: string;
  timeLimit: number;
  passingPercentage: number;
  openRange?: OpenRange;
  sections: Section[];
  candidates: Candidate[];
  instructions: string;
  security: Security;
  feedbackEmail: string;
  obtainableScore: number;
  isEnterprise: boolean;
  postingId?: string;
  createdAt: Date;
}

export {
  Assessment,
  Candidate,
  Section,
  Question,
  Option,
  Security,
  OpenRange,
  QuestionType,
};
