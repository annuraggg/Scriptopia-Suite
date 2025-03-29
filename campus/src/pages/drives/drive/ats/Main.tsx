import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import SelectionChart from "./SelectionChart";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { ExtendedCandidate as Candidate } from "@shared-types/ExtendedCandidate";
import { AppliedDrive } from "@shared-types/AppliedDrive";
import { ExtendedDrive } from "@shared-types/ExtendedDrive";
import Logs from "./Logs";
import DataTableNew from "./DataTable";

interface CandidateTable {
  _id: string;
  name: string;
  email: string;
  received: string;
  match: string;
  status: string;
}

const Main = ({ drive }: { drive: ExtendedDrive }) => {
  const [tableData, setTableData] = useState<CandidateTable[]>([]);
  const [selectionData, setSelectionData] = useState<{
    total: number;
    selected: number;
  }>({ total: 0, selected: 0 });

  useEffect(() => {
    if (drive && drive.candidates) {
      const tableDataTemp: CandidateTable[] = drive.candidates.map(
        (candidate) => {
          const currentDrive = candidate.appliedDrives.find(
            (appliedDrive: AppliedDrive) =>
              appliedDrive.drive === drive._id
          );

          const resumeStageId = drive.workflow?.steps?.find(
            (step) => step.type === "RESUME_SCREENING"
          )?._id;
          const currentScore = currentDrive?.scores?.find(
            (s) => s.stageId === resumeStageId
          );

          return {
            _id: candidate._id || "",
            name: candidate.name,
            email: candidate.email,
            received: new Date(
              currentDrive?.createdAt || Date.now()
            ).toLocaleDateString(),
            match: currentScore?.score?.toString() || "0",
            reason: currentScore?.reason || "No reason",
            status: currentDrive?.status || "Applied",
          };
        }
      );

      setTableData(tableDataTemp);
    }

    if (drive && drive.candidates) {
      const minimumScore = drive.ats?.minimumScore ?? 0;

      const selectedCandidates = (
        drive.candidates as unknown as Candidate[]
      ).filter((candidate) => {
        return candidate.appliedDrives.some(
          (appliedDrive: AppliedDrive) => {
            const score = appliedDrive?.scores?.find(
              (s) => s.stageId === drive.workflow?.steps[0]._id
            )?.score as number;
            return (
              appliedDrive.drive === drive._id && score >= minimumScore
            );
          }
        );
      });

      setSelectionData({
        total: drive.candidates.length,
        selected: selectedCandidates.length,
      });
    }
  }, [drive]);

  return (
    <div className="p-10 py-5">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs aria-label="Options" variant="light">
          <Tab key="dashboard" title="Dashboard">
            <div>
              <Card className="shadow-none">
                <CardHeader>Config</CardHeader>
                <CardBody>
                  <div className="flex items-center w-[100%]">
                    <div className="w-full">
                      <p>Match Threshold (Min %)</p>
                      <p className="text-sm">
                        Minimum percentage to match candidates
                      </p>
                    </div>
                    <Input
                      placeholder="In %"
                      className="w-[50%]"
                      isReadOnly
                      value={drive?.ats?.minimumScore?.toString()}
                    />
                  </div>
                  <div className="flex items-center w-[100%] mt-3">
                    <div className="w-full">
                      <p>Negative Prompts</p>
                      <p className="text-sm">
                        Things you don't want to see in resumes
                      </p>
                    </div>
                    <Textarea
                      placeholder="No negative prompts"
                      isReadOnly
                      value={drive.ats?.negativePrompts?.join(", ")}
                    />
                  </div>
                  <div className="flex items-center w-[100%] mt-3">
                    <div className="w-full">
                      <p>Positive Prompts</p>
                      <p className="text-sm">
                        Things you want to see in resumes
                      </p>
                    </div>
                    <Textarea
                      placeholder="No positive prompts"
                      isReadOnly
                      value={drive.ats?.positivePrompts?.join(", ")}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
            {drive?.candidates?.length &&
            drive?.candidates?.length &&
            drive?.ats?.status === "finished" ? (
              <div className="mt-5 flex gap-5 max-h-[40vh]">
                <SelectionChart chartData={selectionData} />
              </div>
            ) : drive?.ats?.status === "processing" ? (
              <div className="mt-5 flex justify-center items-center">
                <p className="text-center text-lg">
                  No analytics available yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 flex justify-center items-center">
                <p className="text-center text-lg">
                  This step has not yet started
                </p>
              </div>
            )}
          </Tab>
          {drive?.ats?.status === "finished" && (
            <Tab key="results" title="Results" >
              <DataTableNew data={tableData} setData={setTableData} />
            </Tab>
          )}
          <Tab key="logs" title="Logs">
            <Logs drive={drive} />
          </Tab>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Main;
