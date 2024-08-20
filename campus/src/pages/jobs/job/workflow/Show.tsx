import { motion } from "framer-motion";
import {
  Card,
  Table,
  TableCell,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Button,
} from "@nextui-org/react";
import { FolderOutputIcon } from "lucide-react";

interface WorkflowStep {
  name: string;
  startDate: string;
  endDate: string;
}

interface ShowProps {
  workflowData: WorkflowStep[];
  driveTitle: string;
  behavior: string;
}

const Show = ({ workflowData, driveTitle, behavior }: ShowProps) => {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="w-full flex flex-row items-center justify-between gap-4 mb-3">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold">Workflow for</p>
          <div className="items-center justify-center rounded-full whitespace-nowrap">
            <p className="text-lg font-semibold">{driveTitle}</p>
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
          <Table aria-label="Workflow Steps" className="w-full">
            <TableHeader>
              <TableColumn>Step Name</TableColumn>
              <TableColumn>Start Date</TableColumn>
              <TableColumn>End Date</TableColumn>
              <TableColumn className={behavior === "manual" ? "" : "hidden"}>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {workflowData.map((step, index) => (
                <TableRow key={index}>
                  <TableCell>{step.name}</TableCell>
                  <TableCell>{step.startDate}</TableCell>
                  <TableCell>{step.endDate}</TableCell>
                  {behavior === "manual" ? (
                    <TableCell>
                      <Button variant="flat" size="sm" color="primary">
                        Advance
                      </Button>
                    </TableCell>
                  ) : <TableCell>&nbsp;</TableCell>}
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
