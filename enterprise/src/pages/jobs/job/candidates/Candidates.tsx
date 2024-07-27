import Filter from "./Filter";
import { DataTable } from "./DataTable";
import { Card } from "@nextui-org/react";
import { FolderOutputIcon } from "lucide-react";

const stages = ["ATS", "Problem Solving", "Technical", "Interview", "Evaluation"];
const assignees = ["John Doe", "Jane Smith", "Mike Johnson", "Emily Brown", "Alex Lee", "Sarah Wilson"];
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
    <div className="w-full h-full flex flex-col p-6">
      <div className="w-full flex flex-row items-start justify-between gap-4 mb-6">
        <div className="flex flex-row items-start gap-4">
          <p className="text-lg font-bold pt-2">Candidates for the Job of</p>
          <div className="items-center justify-center border-2 border-blue-500 text-blue-500 rounded-full p-2 whitespace-nowrap h-12">
            <p className="text-lg font-semibold">Software Engineer</p>
          </div>
        </div>
        <Card
          isPressable
          className="flex flex-row h-18 mt-1 p-2 rounded-xl gap-3 items-center justify-center border-2 shadow-md ml-auto"
        >
          <FolderOutputIcon size={24} />
          <p className="text-neutral-400 text-sm">Export to CSV</p>
        </Card>
      </div>
      <div className="w-full bg-slate-700 h-[1px] rounded-full mb-6"></div>
      <div className="w-full flex flex-row gap-4">
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