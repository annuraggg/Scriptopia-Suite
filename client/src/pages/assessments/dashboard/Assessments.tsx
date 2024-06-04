import { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AssessmentsCreated from "./AssessmentsCreated";
import LiveAssessmentsCreated from "./LiveAssessmentsCreated";
import AssessmentsTaken from "./AssessmentsTaken";

const Assessments = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="h-full flex gap-5">
      <Sidebar active={active} setActive={setActive} />
      {active === 0 && <Dashboard />}
      {active === 1 && <AssessmentsCreated />}
      {active === 2 && <LiveAssessmentsCreated />}
      {active === 3 && <AssessmentsTaken />}
    </div>
  );
};

export default Assessments;
