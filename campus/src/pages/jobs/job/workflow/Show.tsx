import { motion } from "framer-motion";
import { DataTable } from "./DataTable";
import { Card } from "@nextui-org/react";
import { FolderOutputIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useState, useEffect } from "react";

interface WorkflowData {
  stepName: string;
  startDate: string;
  endDate: string;
}

const Show = () => {
  const [workflowData, setWorkflowData] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .get("/:id/workflow")
      .then((res) => {
        setWorkflowData(res.data); 
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "Failed to fetch workflow data.";
        setError(errorMessage);
        console.log(err);
        setLoading(false);
      });
  }, [getToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full flex flex-row items-center justify-between gap-4 mb-3">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold">Workflow for</p>
          <div className="items-center justify-center rounded-full whitespace-nowrap">
            <p className="text-lg font-semibold">React Developer</p>
          </div>
        </div>
        <Card
          isPressable
          className="flex flex-row h-18 mt-1 py-2 px-3 rounded-xl gap-3 items-center justify-center border-2 shadow-md ml-auto bg-success-400 text-success-foreground"
        >
          <FolderOutputIcon size={20} />
          <p className="text-xs">Export to CSV</p>
        </Card>
      </div>
      <div className="w-full bg-slate-700 h-[1px] rounded-full mb-4"></div>
      <div className="w-full flex flex-row gap-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[100%]"
        >
          <DataTable data={workflowData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Show;
