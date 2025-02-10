import { Checkbox, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const Security = ({
  codePlayback,
  setCodePlayback,
  codeExecution,
  setCodeExecution,
  tabChangeDetection,
  setTabChangeDetection,
  copyPasteDetection,
  setCopyPasteDetection,
  autocomplete,
  setAutocomplete,
  runCode,
  setRunCode,
  syntaxHighlighting,
  setSyntaxHighlighting,
}: {
  codePlayback: boolean;
  setCodePlayback: (codePlayback: boolean) => void;
  codeExecution: boolean;
  setCodeExecution: (codeExecution: boolean) => void;
  tabChangeDetection: boolean;
  setTabChangeDetection: (tabChangeDetection: boolean) => void;
  copyPasteDetection: boolean;
  setCopyPasteDetection: (copyPasteDetection: boolean) => void;
  autocomplete: boolean;
  setAutocomplete: (autocomplete: boolean) => void;
  runCode: boolean;
  setRunCode: (runCode: boolean) => void;
  syntaxHighlighting: boolean;
  setSyntaxHighlighting: (syntaxHighlighting: boolean) => void;
}) => {
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) {
      setAllChecked(false);
      setCodePlayback(false);
      setCodeExecution(false);
      setTabChangeDetection(false);
      setCopyPasteDetection(false);
      setAutocomplete(false);
      setRunCode(false);
      setSyntaxHighlighting(false);
    } else {
      setAllChecked(true);
      setCodePlayback(true);
      setCodeExecution(true);
      setTabChangeDetection(true);
      setCopyPasteDetection(true);
      setAutocomplete(true);
      setRunCode(true);
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

      <Checkbox size="md" color="success" className="mt-5" onClick={toggleAll}>
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
          isSelected={codeExecution}
          onValueChange={(e) => setCodeExecution(e)}
        >
          Enable Code Execution
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
          isSelected={autocomplete}
          onValueChange={(e) => setAutocomplete(e)}
        >
          Enable Autocomplete
        </Checkbox>
        <Checkbox
          size="md"
          color="success"
          isSelected={runCode}
          onValueChange={(e) => setRunCode(e)}
        >
          Enable Run Code
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
