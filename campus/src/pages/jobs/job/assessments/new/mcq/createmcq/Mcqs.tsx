import { motion } from "framer-motion";
import McqSidebar from "./McqSidebar";
import McqContent from "./McqContent";

interface Section {
  id: number;
  name: string;
  questions: Question[];
  isEditing: boolean;
}

export type QuestionType =
  | "single-select"
  | "multi-select"
  | "true-false"
  | "short-answer"
  | "long-answer"
  | "fill-in-blanks"
  | "matching"
  | "output"
  | "visual"
  | "peer-review";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { id: number; text: string; isCorrect: boolean }[];
  maxLimit?: number;
  imageUrl?: string;
  code?: string;
  blankText?: string;
  blanksAnswers?: string[];
}
const Mcqs = ({
  sections,
  setSections,
  selectedSection,
  setSelectedSection,
}: {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  selectedSection: Section | null;
  setSelectedSection: React.Dispatch<React.SetStateAction<Section | null>>;
}) => {
  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-row gap-2 w-full h-full overflow-hidden"
    >
      <McqSidebar
        sections={sections}
        setSections={setSections}
        onSectionSelect={handleSectionSelect}
        selectedSectionId={selectedSection?.id ?? null}
      />
      <McqContent selectedSection={selectedSection} />
    </motion.div>
  );
};

export default Mcqs;
