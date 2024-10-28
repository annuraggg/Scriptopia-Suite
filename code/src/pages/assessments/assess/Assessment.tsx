import { useState } from "react";
import Start from "./Start";
import MCQDashboard from "./MCQDashboard";
import CodeDashboard from "./CodeDashboard";

const Assessment = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "start" | "dashboard" | "problem" | "result"
  >("start");
  const [assessmentType, setAssessmentType] = useState<"mcq" | "code">("code");

  return (
    <div className="h-screen">
      {currentScreen === "start" && (
        <Start
          parentScreen={currentScreen}
          setParentScreen={setCurrentScreen}
          assessmentType={assessmentType}
        />
      )}

      {currentScreen === "dashboard" && (
        <>
          {assessmentType === "mcq" && <MCQDashboard />}
          {assessmentType === "code" && <CodeDashboard />}
        </>
      )}
    </div>
  );
};

export default Assessment;
