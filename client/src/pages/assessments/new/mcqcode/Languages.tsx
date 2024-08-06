import { motion } from "framer-motion";
import availableLanguages from "@/data/languages";
import { Checkbox } from "@nextui-org/react";

const Languages = ({
  selectedLanguages,
  setSelectedLanguages,
}: {
  selectedLanguages: string[];
  setSelectedLanguages: (selectedLanguages: string[]) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p> Select allowed languages</p>
      <div className="grid grid-cols-5 gap-2 mt-5">
        {availableLanguages.map((language, i) => (
          <div key={i} className="flex items-center gap-2 mt-5">
            <Checkbox
              size="lg"
              color="success"
              isSelected={selectedLanguages.includes(language)}
              onChange={(e) => {
                const newSelectedLanguages = [...selectedLanguages];
                if (e.target.checked) {
                  newSelectedLanguages.push(language);
                } else {
                  newSelectedLanguages.splice(
                    newSelectedLanguages.indexOf(language),
                    1
                  );
                }
                setSelectedLanguages(newSelectedLanguages);
              }}
            >
              {language.slice(0, 1).toUpperCase() + language.slice(1)}
            </Checkbox>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Languages;
