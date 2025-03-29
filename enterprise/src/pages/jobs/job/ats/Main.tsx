import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import SelectionChart from "./SelectionChart";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { ExtendedCandidate as Candidate } from "@shared-types/ExtendedCandidate";
import { AppliedPosting } from "@shared-types/AppliedPosting";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";
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

const Main = ({ posting }: { posting: ExtendedPosting }) => {
  const [tableData, setTableData] = useState<CandidateTable[]>([]);
  const [selectionData, setSelectionData] = useState<{
    total: number;
    selected: number;
  }>({ total: 0, selected: 0 });

  useEffect(() => {
    if (posting && posting.candidates) {
      const tableDataTemp: CandidateTable[] = posting.candidates.map(
        (candidate) => {
          const currentPosting = candidate.appliedPostings.find(
            (appliedPosting: AppliedPosting) =>
              appliedPosting.posting === posting._id
          );

          const resumeStageId = posting.workflow?.steps?.find(
            (step) => step.type === "RESUME_SCREENING"
          )?._id;
          const currentScore = currentPosting?.scores?.find(
            (s) => s.stageId === resumeStageId
          );

          return {
            _id: candidate._id || "",
            name: candidate.name,
            email: candidate.email,
            received: new Date(
              currentPosting?.createdAt || Date.now()
            ).toLocaleDateString(),
            match: currentScore?.score?.toString() || "0",
            reason: currentScore?.reason || "No reason",
            status: currentPosting?.status || "Applied",
          };
        }
      );

      setTableData(tableDataTemp);
    }

    if (posting && posting.candidates) {
      const minimumScore = posting.ats?.minimumScore ?? 0;

      const selectedCandidates = (
        posting.candidates as unknown as Candidate[]
      ).filter((candidate) => {
        return candidate.appliedPostings.some(
          (appliedPosting: AppliedPosting) => {
            const score = appliedPosting?.scores?.find(
              (s) => s.stageId === posting.workflow?.steps[0]._id
            )?.score as number;
            return (
              appliedPosting.posting === posting._id && score >= minimumScore
            );
          }
        );
      });

      setSelectionData({
        total: posting.candidates.length,
        selected: selectedCandidates.length,
      });
    }
  }, [posting]);

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
                      value={posting?.ats?.minimumScore?.toString()}
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
                      value={posting.ats?.negativePrompts?.join(", ")}
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
                      value={posting.ats?.positivePrompts?.join(", ")}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
            {posting?.candidates?.length &&
            posting?.candidates?.length &&
            posting?.ats?.status === "finished" ? (
              <div className="mt-5 flex gap-5 max-h-[40vh]">
                <SelectionChart chartData={selectionData} />
              </div>
            ) : posting?.ats?.status === "processing" ? (
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
          {posting?.ats?.status === "finished" && (
            <Tab key="results" title="Results" >
              <DataTableNew data={tableData} setData={setTableData} />
            </Tab>
          )}
          <Tab key="logs" title="Logs">
            <Logs posting={posting} />
          </Tab>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Main;
