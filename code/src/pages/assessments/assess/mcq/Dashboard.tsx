import { useState } from "react";
import Sidebar from "./Sidebar";
import Sections from "./Sections";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import { MCQAssessmentSubmissionsSchema as MASS } from "@shared-types/MCQAssessmentSubmission";

interface DashboardProps {
  timer: number;
  loading: boolean;
  assessment: MA;
  setAssessment: (assessment: MA) => void;
  assessmentSub: MASS;
  setAssessmentSub: (assessmentSub: MASS) => void;
}

const Dashboard = ({ timer, assessment }: DashboardProps) => {
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <div className="flex">
      <Sidebar
        timer={timer}
        assessment={assessment}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <Sections assessment={assessment} currentSection={currentSection} />
    </div>
  );
};

export default Dashboard;
