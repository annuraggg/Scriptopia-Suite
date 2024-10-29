import { useState } from "react";
import { motion } from "framer-motion";
import McqSidebar from "./McqSidebar";
import McqContent from "./McqContent";

interface Section {
  id: number;
  name: string;
  isEditing: boolean;
}

const Mcqs = () => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

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
        onSectionSelect={handleSectionSelect} 
        selectedSectionId={selectedSection?.id ?? null} 
      />
      <McqContent selectedSection={selectedSection} />
    </motion.div>
  );
};

export default Mcqs;