import { Checkbox, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Security = ({
  codePlayback,
  setCodePlayback,
  tabChangeDetection,
  setTabChangeDetection,
  copyPasteDetection,
  setCopyPasteDetection,
  syntaxHighlighting,
  setSyntaxHighlighting,
}: {
  codePlayback: boolean;
  setCodePlayback: (codePlayback: boolean) => void;
  tabChangeDetection: boolean;
  setTabChangeDetection: (tabChangeDetection: boolean) => void;
  copyPasteDetection: boolean;
  setCopyPasteDetection: (copyPasteDetection: boolean) => void;
  syntaxHighlighting: boolean;
  setSyntaxHighlighting: (syntaxHighlighting: boolean) => void;
}) => {
  const [allChecked, setAllChecked] = useState(false);

  // Add useEffect to check if all options are selected
  useEffect(() => {
    const areAllChecked =
      codePlayback &&
      tabChangeDetection &&
      copyPasteDetection &&
      syntaxHighlighting;

    setAllChecked(areAllChecked);
  }, [
    codePlayback,
    tabChangeDetection,
    copyPasteDetection,
    syntaxHighlighting,
  ]);

  const toggleAll = () => {
    if (allChecked) {
      setAllChecked(false);
      setCodePlayback(false);
      setTabChangeDetection(false);
      setCopyPasteDetection(false);
      setSyntaxHighlighting(false);
    } else {
      setAllChecked(true);
      setCodePlayback(true);
      setTabChangeDetection(true);
      setCopyPasteDetection(true);
      setSyntaxHighlighting(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>Security Features</p>

      <Checkbox
        size="md"
        color="success"
        className="mt-5"
        isSelected={allChecked}
        onClick={toggleAll}
      >
        Select All
      </Checkbox>
      <Divider className="my-5" />
      <div className="flex flex-col gap-5">
        <Checkbox
          size="md"
          color="success"
          isSelected={codePlayback}
          onValueChange={(e) => setCodePlayback(e)}
        >
          Enable Code Playback
        </Checkbox>
        <Checkbox
          size="md"
          color="success"
          isSelected={tabChangeDetection}
          onValueChange={(e) => setTabChangeDetection(e)}
        >
          Enable Tab Change Detection
        </Checkbox>
        <Checkbox
          size="md"
          color="success"
          isSelected={copyPasteDetection}
          onValueChange={(e) => setCopyPasteDetection(e)}
        >
          Enable Copy Paste Detection
        </Checkbox>
        <Checkbox
          size="md"
          color="success"
          isSelected={syntaxHighlighting}
          onValueChange={(e) => setSyntaxHighlighting(e)}
        >
          Enable Syntax Highlighting
        </Checkbox>
      </div>
    </motion.div>
  );
};

export default Security;
