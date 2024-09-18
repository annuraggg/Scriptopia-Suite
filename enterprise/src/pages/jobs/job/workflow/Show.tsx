import { motion } from "framer-motion";
import {
  Table,
  TableCell,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Button,
} from "@nextui-org/react";
import { Posting, WorkflowStep } from "@shared-types/Posting";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useState } from "react";

interface ShowProps {
  workflowData: WorkflowStep[];
  postingTitle: string;
  behavior: string;
}

const stepTypeMap = {
  rs: "Resume Screening",
  mcqa: "MCQ Assessment",
  ca: "Coding Assessment",
  mcqca: "MCQ + Coding Assessment",
  as: "Assignment",
  pi: "Interview",
  cu: "Custom",
};

const Show = ({ workflowData, postingTitle, behavior }: ShowProps) => {
  const { posting } = useOutletContext() as { posting: Posting };
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const advance = async (step: number) => {
    setLoading(true);
    axios
      .post("/postings/advance-workflow", { _id: posting._id, step })
      .then(() => {
        toast.success("Workflow advanced successfully");
        setTimeout(() => {
          window.location.reload();
          setLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to advance workflow");
        setLoading(false);
      });
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full flex flex-row items-center justify-between gap-4 mb-3">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold">Workflow for</p>
          <div className="items-center justify-center rounded-full whitespace-nowrap">
            <p className="text-lg font-semibold">{postingTitle}</p>
          </div>
        </div>
        {/* <Card
          isPressable
          className="flex flex-row h-18 mt-1 py-2 px-3 rounded-xl gap-3 items-center justify-center border-2 shadow-md ml-auto bg-success-400 text-success-foreground"
        >
          <FolderOutputIcon size={20} />
          <p className="text-xs">Export to CSV</p>
        </Card> */}
      </div>
      <div className="w-full bg-slate-700 h-[1px] rounded-full mb-4"></div>
      <div className="w-full flex flex-row gap-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[100%]"
        >
          <Table aria-label="Workflow Steps" className="w-full">
            <TableHeader>
              <TableColumn>Step Name</TableColumn>
              <TableColumn>Step Type</TableColumn>
              <TableColumn className={behavior === "manual" ? "" : "hidden"}>
                Action
              </TableColumn>
            </TableHeader>
            <TableBody>
              {workflowData.map((step, index) => (
                <TableRow key={index}>
                  <TableCell>{step.name}</TableCell>
                  <TableCell>{stepTypeMap[step.type]}</TableCell>

                  {behavior === "manual" &&
                  posting.workflow?.currentStep === index - 1 ? (
                    <TableCell className="h-16">
                      <Button
                        variant="flat"
                        size="sm"
                        color="primary"
                        onClick={() => advance(index)}
                        isLoading={loading}
                      >
                        Advance
                      </Button>
                    </TableCell>
                  ) : (posting.workflow?.currentStep ?? -1) > index ? (
                    <TableCell className="h-16 text-success-500">Step Completed</TableCell>
                  ) : (posting.workflow?.currentStep ?? -1) > index - 1 ? (
                    <TableCell className="h-16 text-warning-500">Ongoing</TableCell>
                  ) : (
                    <TableCell className="h-16">&nbsp;</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </div>
  );
};

export default Show;
