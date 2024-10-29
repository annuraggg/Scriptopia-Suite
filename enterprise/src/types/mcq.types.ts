export type QuestionType = 
  | "single-select" 
  | "true-false" 
  | "multi-select"
  | "fill-in-blanks" 
  | "short-answer" 
  | "long-answer"
  | "case-study"
  | "scenario"
  | "written-code"
  | "peer-review"
  | "output"
  | "matching"
  | "visual";

export interface Option {
  id: number;
  text: string;
  isCorrect?: boolean;
  matchText?: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: Option[];
  code?: string;
  imageUrl?: string;
  maxLimit?: number;
  blankText?: string;
  blanksAnswers?: string[];
}

export interface Section {
  id: number;
  name: string;
}

export interface McqContentProps {
  selectedSection: Section | null;
}

export interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  editingQuestion: Question | null;
}