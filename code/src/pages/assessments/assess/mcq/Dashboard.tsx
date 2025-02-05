import { useState } from "react";
import Sidebar from "./Sidebar";
import Sections from "./Sections";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import { MCQAssessmentSubmission as MASS } from "@shared-types/MCQAssessmentSubmission";

interface DashboardProps {
  timer: number;
  loading: boolean;
  assessment: MA;
  setAssessment: (assessment: MA) => void;
  assessmentSub: MASS;
  setAssessmentSub: (assessmentSub: MASS) => void;
  submitAssessment: () => void;
}

const Dashboard = ({
  timer,
  assessment,
  assessmentSub,
  setAssessmentSub,
  submitAssessment,
}: DashboardProps) => {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <div className="flex px-10 py-5 gap-5 relative overflow-hidden">
      <Sidebar
        timer={timer}
        assessment={assessment}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        submitAssessment={submitAssessment}
      />
      <Sections
        assessment={assessment}
        currentSection={currentSection}
        assessmentSub={assessmentSub}
        setAssessmentSub={setAssessmentSub}
      />
    </div>
  );
};

export default Dashboard;
