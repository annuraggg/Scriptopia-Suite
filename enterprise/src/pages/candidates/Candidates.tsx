import { DataTable } from "@/components/DataTable";

const Candidates = () => {
  const tableData = [];

  for (let i = 1; i <= 50; i++) {
    const record = {
      name: `Candidate ${i}`,
      email: `candidate${i}@example.com`,
      received: `${Math.floor(Math.random() * 28) + 1}th July`,
      match: `${Math.floor(Math.random() * 100)}%`,
    };

    tableData.push(record);
  }

  return (
    <div className="p-5">
      <DataTable data={tableData} />
    </div>
  );
};

export default Candidates;
