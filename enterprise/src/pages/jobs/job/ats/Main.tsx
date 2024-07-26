import {
  Accordion,
  AccordionItem,
  Button,
  Input,
} from "@nextui-org/react";
import ResumeChart from "./ResumeChart";
import { SelectionChart } from "./SelectionChart";
import { Tabs, Tab } from "@nextui-org/react";
import { DataTable } from "./DataTable";

const Main = ({ save }: { save: () => void }) => {
  const chartData = [
    { day: "5th July", resumes: 130 },
    { day: "6th July", resumes: 60 },
    { day: "7th July", resumes: 70 },
    { day: "9th July", resumes: 56 },
    { day: "10th July", resumes: 100 },
    { day: "11th July", resumes: 110 },
    { day: "12th July", resumes: 120 },
    { day: "13th July", resumes: 65 },
    { day: "14th July", resumes: 140 },
    { day: "15th July", resumes: 150 },
    { day: "16th July", resumes: 60 },
    { day: "17th July", resumes: 170 },
    { day: "18th July", resumes: 32 },
    { day: "19th July", resumes: 190 },
  ];

  const selectionChartData = [{ candidates: 1260 }];

  const tableData = [
    {
      name: "Anurag Sawant",
      email: "anurag@example.com",
      received: "5th July",
      match: "60%",
    },
  ];

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
    <div className="p-10 py-5">
      <Tabs aria-label="Options" variant="light">
        <Tab key="dashboard" title="Dashboard">
          <div>
            <Accordion variant="splitted">
              <AccordionItem key="config" aria-label="config" title="Config">
                <div className="flex items-center w-[50%] gap-5">
                  <p>Match Threshold</p>
                  <Input placeholder="In %" className="w-[50%]" />
                </div>
                <Button
                  className="mt-5 float-right mb-5"
                  variant="flat"
                  color="success"
                  onClick={save}
                >
                  Save
                </Button>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-5 flex gap-5">
            <SelectionChart chartData={selectionChartData} />
            <ResumeChart chartData={chartData} />
          </div>
        </Tab>
        <Tab key="candidates" title="Candidates">
          <DataTable data={tableData} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Main;
