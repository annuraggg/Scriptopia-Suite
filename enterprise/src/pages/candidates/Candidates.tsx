import { DataTable } from "./DataTable";
import { RootState } from "@/@types/reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";

import { useSelector } from "react-redux";

const Candidates = () => {
  const org = useSelector((state: RootState) => state.organization);

  const tableData = [];
  const statuses = ["Qualified", "Disqualified", "Hired"];
  for (let i = 1; i <= 50; i++) {
    const record = {
      name: `Candidate ${i}`,
      email: `candidate${i}@example.com`,
      received: `${Math.floor(Math.random() * 28) + 1}th July`,
      status: statuses[Math.floor(Math.random() * 3)],
    };

    tableData.push(record);
  }

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/candidates"}>
            Candidates
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-5">
        <DataTable data={tableData} />
      </div>
    </>
  );
};

export default Candidates;
