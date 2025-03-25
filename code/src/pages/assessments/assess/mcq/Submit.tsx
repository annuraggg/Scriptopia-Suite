import { Progress } from "@heroui/react";
import { useEffect, useState } from "react";

const Submit = ({
  assessmentSubmitted,
  submitSuccess,
}: {
  assessmentSubmitted: boolean;
  submitSuccess: boolean;
}) => {
  const [submitProgress, setSubmitProgress] = useState(0);

  useEffect(() => {
    if (assessmentSubmitted) {
      setSubmitProgress(100);
      return;
    }
    
    const interval = setInterval(() => {
      if (submitProgress < 80) {
        setSubmitProgress((prev) => prev + 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [submitProgress, assessmentSubmitted]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-64 transition-all">
      <Progress
        value={submitProgress}
        color={
          assessmentSubmitted
            ? submitSuccess
              ? "success"
              : "danger"
            : "warning"
        }
      />
      <div className="text-center text-lg mt-5">
        {submitProgress < 100
          ? "Submitting Assessment"
          : "Assessment Submitted"}
      </div>
      <p className="mt-5 opacity-50">
        {submitProgress < 100 && "Do not close the tab"}
        {submitProgress === 100 && "You can close the tab now"}
      </p>
    </div>
  );
};

export default Submit;
