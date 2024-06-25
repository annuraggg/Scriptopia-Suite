import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AssessmentsCreated from "./AssessmentsCreated";
import LiveAssessmentsCreated from "./LiveAssessmentsCreated";
import AssessmentsTaken from "./AssessmentsTaken";

const Assessments = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#created") {
      setActive(1);
    } else if (hash === "#live") {
      setActive(2);
    } else if (hash === "#taken") {
      setActive(3);
    } else {
      setActive(0);
    }
  }, []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className=""
    >
    <div className="h-full flex gap-5">
      <Sidebar active={active} setActive={setActive} />
      {active === 0 && <Dashboard />}
      {active === 1 && <AssessmentsCreated />}
      {active === 2 && <LiveAssessmentsCreated />}
      {active === 3 && <AssessmentsTaken />}
    </div>
    </motion.div>
  );
};

export default Assessments;
