import { Checkbox } from "@heroui/react";
import { motion } from "framer-motion";

const Security = ({
  codePlayback,
  setCodePlayback,
  tabChangeDetection,
  setTabChangeDetection,
  copyPasteDetection,
  setCopyPasteDetection,
}: {
  codePlayback: boolean;
  setCodePlayback: (codePlayback: boolean) => void;
  tabChangeDetection: boolean;
  setTabChangeDetection: (tabChangeDetection: boolean) => void;
  copyPasteDetection: boolean;
  setCopyPasteDetection: (copyPasteDetection: boolean) => void;
}) => {
  // const [allChecked, setAllChecked] = useState(false);

  // const toggleAll = () => {
  //   if (allChecked) {
  //     setAllChecked(false);
  //     setCodePlayback(false);
  //     setTabChangeDetection(false);
  //     setCopyPasteDetection(false);
  //   } else {
  //     setAllChecked(true);
  //     setCodePlayback(true);
  //     setTabChangeDetection(true);
  //     setCopyPasteDetection(true);
  //   }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="mb-5">Security Features</p>

      {/* <Checkbox size="md" color="success" className="mt-5" onClick={toggleAll}>
        Select All
      </Checkbox>
      <Divider className="my-5" /> */}
      <div className="flex flex-col gap-5">
        <Checkbox
          size="md"
          color="success"
          isSelected={codePlayback}
          onValueChange={(e) => setCodePlayback(e)}
        >
          Enable Session Playback
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
      </div>
    </motion.div>
  );
};

export default Security;
