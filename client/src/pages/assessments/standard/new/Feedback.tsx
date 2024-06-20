import { Button, Input } from "@nextui-org/react";
import { motion } from "framer-motion";

const Feedback = ({
  feedbackEmail,
  setFeedbackEmail,
  handleSubmit,
}: {
  feedbackEmail: string;
  setFeedbackEmail: (feedbackEmail: string) => void;
  handleSubmit: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>Feedback</p>
      <p className="text-sm text-gray-400">
        Where should the candidate contact for feedback/disrepancies?
      </p>

      <div className="mt-5">
        <Input
          label="Feedback Email"
          placeholder="Enter Feedback Email"
          className="w-full"
          type="email"
          value={feedbackEmail}
          onChange={(e) => setFeedbackEmail(e.target.value)}
        />
      </div>
      <Button className="mt-5 absolute right-5 bottom-5" color="success" variant="flat" onClick={handleSubmit}>
        Submit
      </Button>
    </motion.div>
  );
};

export default Feedback;
