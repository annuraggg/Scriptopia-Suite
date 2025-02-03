import React from "react";
import { Textarea } from "@heroui/react";
import { motion } from "framer-motion";

interface InstructionsProps {
  instructions: string;
  setInstructions: (instructions: string) => void;
  errors: { [key: string]: string };
}

const Instructions: React.FC<InstructionsProps> = ({
  instructions,
  setInstructions,
  errors,
}) => {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>
        Default Instructions will be provided to the candidates. However, you can
        add your own instructions here.
      </p>
      <Textarea
        label="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="mt-5"
        isInvalid={!!errors.instructions}
      />
      {errors.instructions && (
        <p className="text-red-500 mt-2">{errors.instructions}</p>
      )}
    </motion.div>
  );
};

export default Instructions;