import { motion } from "framer-motion";
import availableLanguages from "@/data/languages";
import { Checkbox } from "@heroui/react";

interface LanguagesProps {
  selectedLanguages: string[];
  setSelectedLanguages: (selectedLanguages: string[]) => void;
}

const Languages: React.FC<LanguagesProps> = ({
  selectedLanguages,
  setSelectedLanguages,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="mb-4">Select allowed languages</p>
      {selectedLanguages.length === 0 && (
        <p className="text-red-500 mb-2">Please select at least one language</p>
      )}
      <div className="grid grid-cols-5 gap-2">
        {availableLanguages.map(
          (language, i) =>
            language.available && (
              <div key={i} className="flex items-center gap-2 mt-5">
                <Checkbox
                  size="lg"
                  color="success"
                  isSelected={selectedLanguages.includes(language.abbr)}
                  onChange={(e) => {
                    const newSelectedLanguages = e.target.checked
                      ? [...selectedLanguages, language.abbr]
                      : selectedLanguages.filter((lang) => lang !== language.abbr);
                    setSelectedLanguages(newSelectedLanguages);
                  }}
                >
                  {language.name}
                </Checkbox>
              </div>
            )
        )}
      </div>
    </motion.div>
  );
};

export default Languages;