import Filter from "./Filter";
import { DataTable } from "./DataTable";
import { Button } from "@nextui-org/react";
import { FolderOutputIcon } from "lucide-react";

const stages = [
  "ATS",
  "Problem Solving",
  "Technical",
  "Interview",
  "Evaluation",
];
const assignees = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Emily Brown",
  "Alex Lee",
  "Sarah Wilson",
];
const statuses = ["Qualified", "Disqualified", "Hired"];

const Candidates = () => {
  const tableData = [];
  for (let i = 1; i <= 50; i++) {
    const record = {
      name: `Candidate ${i}`,
      applyDate: `${Math.floor(Math.random() * 28) + 1}th July`,
      avgScore: Math.floor(Math.random() * 100),
      stage: stages[Math.floor(Math.random() * stages.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
    tableData.push(record);
  }

  return (
    <div className="w-full h-full flex flex-col p-5">
      <div className="w-full flex flex-row justify-between gap-4 items-center text-sm">
        <div className="flex flex-row items-start gap-4">
          <p className="font-bold">Viewing Candidates for the job: </p>
          <p>Software Engineer</p>
        </div>
        <Button variant="flat">
          <FolderOutputIcon size={16} />
          <p>Export to CSV</p>
        </Button>
      </div>
      <div className="w-full flex flex-row gap-4 mt-5">
        <div className="w-[20%]">
          <Filter />
        </div>
        <div className="w-[80%]">
          <DataTable data={tableData} />
        </div>
      </div>
    </div>
  );
};

export default Candidates;
