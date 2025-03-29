import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const Feedback = ({
  feedbackEmail,
  setFeedbackEmail,
  buildAssessmentData,
  submitting
}: {
  feedbackEmail: string;
  setFeedbackEmail: (feedbackEmail: string) => void;
  buildAssessmentData: () => void;
  submitting: boolean;
}) => {
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFeedbackEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleClick = async () => {
    if (!feedbackEmail) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(feedbackEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      buildAssessmentData();
    } catch (error) {
      console.error("Error during buildAssessmentData:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>Feedback</p>
      <p className="text-sm text-gray-400">
        Where should the candidate contact for feedback/discrepancies?
      </p>

      <div className="mt-5">
        <Input
          label="Feedback Email"
          placeholder="Enter Feedback Email"
          className="w-full"
          type="email"
          value={feedbackEmail}
          onChange={handleEmailChange}
          errorMessage={emailError}
          isInvalid={!!emailError}
        />
      </div>
      <Button
        className="mt-5 float-right"
        color="success"
        variant="flat"
        onClick={handleClick}
        isDisabled={!!emailError || !feedbackEmail}
        isLoading={submitting}
      >
        Submit
      </Button>
    </motion.div>
  );
};

export default Feedback;
