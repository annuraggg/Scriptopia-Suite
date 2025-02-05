import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import MCQAssess from "./MCQAssess";
import CodeAssess from "./CodeAssess";
import { toast } from "sonner";
import { Assessment } from "@shared-types/Assessment";

const Assessments = () => {
  const [active, setActive] = useState(0);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const [data, setData] = useState<{
    mcqCreatedAssessments: Assessment[];
    codeCreatedAssessments: Assessment[];
    mcqCodeCreatedAssessments: Assessment[];
  }>({
    mcqCreatedAssessments: [],
    codeCreatedAssessments: [],
    mcqCodeCreatedAssessments: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const postingId = window.location.pathname.split("/")[2];
      try {
        const mcqCreatedAssessments = await axios.get(
          "/assessments/mcq/created/1/enterprise/" + postingId
        );
        const codeCreatedAssessments = await axios.get(
          "/assessments/code/created/1/enterprise/" + postingId
        );
        const mcqCodeCreatedAssessments = await axios.get(
          "/assessments/mcqcode/created/1/enterprise/" + postingId
        );

        setData({
          mcqCreatedAssessments: mcqCreatedAssessments.data.data,
          codeCreatedAssessments: codeCreatedAssessments.data.data,
          mcqCodeCreatedAssessments: mcqCodeCreatedAssessments.data.data,
        });
      } catch (error) {
        toast.error("Failed to fetch assessments");
        console.error("Error fetching assessments:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    switch (hash) {
      case "#mcqcreated":
        setActive(0);
        break;
      case "#codecreated":
        setActive(1);
        break;
      case "#mcqcodecreated":
        setActive(2);
        break;
      default:
        setActive(0);
    }
  }, []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-10"
    >
      <div className="h-full flex gap-5">
        <Sidebar active={active} setActive={setActive} />
        {active === 0 && <MCQAssess createdAssessments={data.mcqCreatedAssessments || []} />}
        {active === 1 && <CodeAssess createdAssessments={data.codeCreatedAssessments || []} />}
      </div>
    </motion.div>
  );
};

export default Assessments;
