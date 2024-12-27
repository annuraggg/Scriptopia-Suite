import { motion } from "framer-motion";
import McqSidebar from "./McqSidebar";
import McqContent from "./McqContent";
import { Section } from "@shared-types/MCQAssessment";
import { Dispatch, SetStateAction, useState } from "react";

const Mcqs = ({
  sections,
  setSections,
}: {
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
  selectedSectionIndex: number | null;
  setSelectedSectionIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [selectedSection, setSelectedSection] = useState<number>(0);

  const handleSectionSelect = (index: number) => {
    setSelectedSection(index);
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
        onSectionSelect={(section) =>
          handleSectionSelect(sections.indexOf(section))
        }
        selectedSectionIndex={selectedSection}
      />
      {selectedSection !== null && (
        <McqContent
          selectedSection={sections[selectedSection]}
          sections={sections}
          setSections={setSections}
        />
      )}
    </motion.div>
  );
};

export default Mcqs;
