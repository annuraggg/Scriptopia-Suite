export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  matchText?: string;
}

export type QuestionType = 
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

export interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  editingQuestion: Question | null;
}

export interface McqContentProps {
  selectedSection: Section | null;
}

export interface Section {
  id: number;
  name: string;
  questions: Question[];
  isEditing?: boolean;
}

export interface McqProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  selectedSection: Section | null;
  setSelectedSection: (section: Section | null) => void;
}