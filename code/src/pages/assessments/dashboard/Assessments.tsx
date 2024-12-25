import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import AssessmentsTaken from "./AssessmentsTaken";
import { useQueries } from "@tanstack/react-query";
import ax from "@/config/axios";
import Loader from "@/components/Loader";
import ErrorPage from "@/components/ErrorPage";
import { useAuth } from "@clerk/clerk-react";
import MCQAssess from "./MCQAssess";
import CodeAssess from "./CodeAssess";

const Assessments = () => {
  const [active, setActive] = useState(0);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const data = useQueries({
    queries: [
      {
        queryKey: ["taken-assessments"],
        queryFn: async () => (await axios.get("/assessments/taken/1")).data,
      },
      {
        queryKey: ["mcq-created-assessments"],
        queryFn: async () =>
          (await axios.get("/assessments/mcq/created/1")).data,
      },
      {
        queryKey: ["code-created-assessments"],
        queryFn: async () =>
          (await axios.get("/assessments/code/created/1")).data,
      },
      {
        queryKey: ["mcqcode-created-assessments"],
        queryFn: async () =>
          (await axios.get("/assessments/mcqcode/created/1")).data,
      },
    ],
  });

  useEffect(() => {
    const hash = window.location.hash;
    switch (hash) {
      case "#taken":
        setActive(0);
        break;
      case "#mcqcreated":
        setActive(1);
        break;
      case "#codecreated":
        setActive(2);
        break;
      default:
        setActive(0);
    }
  }, []);

  if (data[0].isLoading || data[1].isLoading || data[2].isLoading)
    return <Loader />;
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
        {active === 0 && (
          <AssessmentsTaken takenAssessments={data[0]?.data.data || []} />
        )}
        {active === 1 && (
          <MCQAssess createdAssessments={data[1]?.data.data || []} />
        )}
        {active === 2 && (
          <CodeAssess createdAssessments={data[2]?.data.data || []} />
        )}
      </div>
    </motion.div>
  );
};

export default Assessments;
