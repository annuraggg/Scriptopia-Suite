import { Textarea } from "@heroui/react";
import { motion } from "framer-motion";

const Instructions = ({
  instructions,
  setInstructions,
}: {
  instructions: string;
  setInstructions: (instructions: string) => void;
}) => {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>
        Defaut Instructions will be provided to the candidates. However, you can
        add your own instructions here.
      </p>
      <Textarea
        label="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="mt-5"
      />
    </motion.div>
  );
};

export default Instructions;
