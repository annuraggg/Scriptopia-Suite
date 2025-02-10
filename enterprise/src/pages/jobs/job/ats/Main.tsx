import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Input, Textarea } from "@heroui/react";
import { SelectionChart } from "./SelectionChart";
import { Tabs, Tab } from "@heroui/react";
import { DataTable } from "./DataTable";
import { Posting } from "@shared-types/Posting";
import { useEffect, useState } from "react";
import { ExtendedCandidate as Candidate } from "@shared-types/ExtendedCandidate";
import { AppliedPosting } from "@shared-types/AppliedPosting";

interface CandidateTable {
  _id: string;
  name: string;
  email: string;
  received: string;
  match: string;
  status: string;
}

const Main = ({ posting }: { posting: Posting }) => {
  const [tableData, setTableData] = useState<CandidateTable[]>([]);
  const [stepNo, setStepNo] = useState<number>(-1);
  const [selectionData, setSelectionData] = useState<{
    total: number;
    selected: number;
  }>({ total: 0, selected: 0 });

  useEffect(() => {
    if (posting && posting.candidates) {
      const tableDataTemp: CandidateTable[] = (
        posting.candidates as unknown as Candidate[]
      ).map((candidate) => {
        const currentPosting = candidate.appliedPostings.find(
          (appliedPosting: AppliedPosting) =>
            appliedPosting.posting === posting._id
        );
        return {
          _id: candidate._id || "",
          name: candidate.name,
          email: candidate.email,
          received: new Date(
            currentPosting?.createdAt || Date.now()
          ).toLocaleDateString(),
          match:
            (currentPosting?.scores?.find((s) => s.stageId === "rs")?.score ??
              0) + "%",
          status: currentPosting?.status || "Applied",
        };
      });
      setTableData(tableDataTemp);
    }

    if (posting && posting.candidates) {
      const minimumScore = posting.ats?.minimumScore ?? 0;

      const selectedCandidates = (
        posting.candidates as unknown as Candidate[]
      ).filter((candidate) => {
        return candidate.appliedPostings.some(
          (appliedPosting: AppliedPosting) => {
            const score =
              appliedPosting.scores?.find((s) => s.stageId === "rs")?.score ??
              0;
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

      const stepNumber = posting?.workflow?.steps?.findIndex(
        (step) => step.type === "RESUME_SCREENING"
      ) as number;

      setStepNo(stepNumber);
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
              <Card>
                <CardHeader>Config</CardHeader>
                <CardBody>
                  <div className="flex items-center w-[100%]">
                    <div className="w-full">
                      <p>Match Threshold (Min %)</p>
                      <p className="text-sm opacity-50">
                        Minimum percentage to match candidates
                      </p>
                    </div>
                    <Input
                      placeholder="In %"
                      className="w-[50%]"
                      isDisabled
                      value={posting?.ats?.minimumScore?.toString()}
                    />
                  </div>
                  <div className="flex items-center w-[100%] mt-3">
                    <div className="w-full">
                      <p>Negative Prompts</p>
                      <p className="text-sm opacity-50">
                        Things you don't want to see in resumes
                      </p>
                    </div>
                    <Textarea
                      placeholder="No negative prompts"
                      isDisabled
                      value={posting.ats?.negativePrompts?.join(", ")}
                    />
                  </div>
                  <div className="flex items-center w-[100%] mt-3">
                    <div className="w-full">
                      <p>Positive Prompts</p>
                      <p className="text-sm opacity-50">
                        Things you want to see in resumes
                      </p>
                    </div>
                    <Textarea
                      placeholder="No positive prompts"
                      isDisabled
                      value={posting.ats?.positivePrompts?.join(", ")}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
            {posting?.candidates?.length && posting?.candidates?.length > 0 ? (
              <div className="mt-5 flex gap-5">
                <SelectionChart chartData={selectionData} />
              </div>
            ) : (
              <div className="mt-5 flex justify-center items-center">
                <p className="text-center text-lg opacity-50">
                  No analytics available yet. Please wait for candidates to
                  apply for this posting.
                </p>
              </div>
            )}
          </Tab>
          <Tab key="candidates" title="Candidates">
            <DataTable
              data={tableData}
              postingId={posting._id!}
              matchThreshold={posting?.ats?.minimumScore ?? 0}
              stepNo={stepNo}
              setData={setTableData}
            />
          </Tab>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Main;
