import { motion } from "framer-motion";
import McqSidebar from "./McqSidebar";
import McqContent from "./McqContent";
import { Section } from "../../../../../../../types/mcq.types";


const Mcqs = ({ sections, setSections, selectedSection, setSelectedSection }: {
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