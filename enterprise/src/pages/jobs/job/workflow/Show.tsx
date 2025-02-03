import { motion } from "framer-motion";
import {
  Table,
  TableCell,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Button,
} from "@heroui/react";
import { Posting, WorkflowStep } from "@shared-types/Posting";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useState } from "react";

interface ShowProps {
  workflowData: WorkflowStep[];
  postingTitle: string;
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

const Show = ({ workflowData }: ShowProps) => {
  const { posting } = useOutletContext() as { posting: Posting };
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const advance = async (step: number) => {
    setLoading(true);
    if (!posting.published) {
      toast.error("Posting is not published");
      setLoading(false);
      return;
    }
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
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {workflowData.map((step, index) => (
                <TableRow key={index}>
                  <TableCell>{step.name}</TableCell>
                  <TableCell>{stepTypeMap[step.type]}</TableCell>

                  {posting.workflow?.currentStep === index - 1 ? (
                    <TableCell className="h-16">
                      <Button
                        variant="flat"
                        size="sm"
                        color="primary"
                        className={posting.published ? "" : "hidden"}
                        onClick={() => advance(index)}
                        isLoading={loading}
                      >
                        Advance
                      </Button>
                    </TableCell>
                  ) : (posting.workflow?.currentStep ?? -1) > index ? (
                    <TableCell className="h-16 text-success-500">
                      Step Completed
                    </TableCell>
                  ) : (posting.workflow?.currentStep ?? -1) > index - 1 ? (
                    <TableCell className="h-16 text-warning-500">
                      Ongoing
                    </TableCell>
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
