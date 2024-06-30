import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AssessmentsCreated from "./AssessmentsCreated";
import LiveAssessmentsCreated from "./LiveAssessmentsCreated";
import AssessmentsTaken from "./AssessmentsTaken";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import Loader from "@/components/Loader";
import ErrorPage from "@/components/ErrorPage";

const Assessments = () => {
  const [active, setActive] = useState(0);

  const data = useQueries({
    queries: [
      {
        queryKey: ["all-assessments"],
        queryFn: async () => (await axios.get("/assesments/all/1")).data,
      },
      {
        queryKey: ["created-assessments"],
        queryFn: async () => (await axios.get("/assesments/created/1")).data,
      },
      {
        queryKey: ["live-assessments"],
        queryFn: async () => (await axios.get("/assesments/live-created/1")).data,
      },
      {
        queryKey: ["taken-assessments"],
        queryFn: async () => (await axios.get("/assesments/taken/1")).data,
      },
    ],
  });



  useEffect(() => {
    const hash = window.location.hash;
    switch (hash) {
      case "#created":
        setActive(1);
        break;
      case "#live":
        setActive(2);
        break;
      case "#taken":
        setActive(3);
        break;
      default:
        setActive(0);
    }
  }, []);
  
  if (data[0].isLoading || data[1].isLoading || data[2].isLoading) return <Loader />;
  if (data[0].error || data[1].error || data[2].error) return <ErrorPage />;

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
      {active === 1 && <AssessmentsCreated createdAssessments = {data[1]?.data.data || []}/>}
      {active === 2 && <LiveAssessmentsCreated liveAssessments = {data[2]?.data.data || []}/>}
      {active === 3 && <AssessmentsTaken takenAssessments = {[]}/>}
    </div>
    </motion.div>
  );
};

export default Assessments;