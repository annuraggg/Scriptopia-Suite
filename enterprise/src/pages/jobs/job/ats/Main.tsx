import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, Input, Textarea } from "@nextui-org/react";
import { SelectionChart } from "./SelectionChart";
import { Tabs, Tab } from "@nextui-org/react";
import { DataTable } from "./DataTable";
import { Posting } from "@shared-types/Posting";
import { useEffect, useState } from "react";
import { Candidate } from "@shared-types/Candidate";

interface CandidateTable {
  name: string;
  email: string;
  received: string;
  match: string;
}

const Main = ({ posting }: { posting: Posting }) => {
  const [tableData, setTableData] = useState<CandidateTable[]>([]);
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
          (appliedPosting) => appliedPosting.postingId === posting._id
        );
        return {
          name: candidate.firstName + " " + candidate.lastName,
          email: candidate.email,
          received: new Date(
            currentPosting?.appliedAt || Date.now()
          ).toLocaleDateString(),
          match: (currentPosting?.scores.rs?.score ?? 0) + "%", // Default to 0% if score is undefined
        };
      });
      setTableData(tableDataTemp);
    }

    if (posting && posting.candidates) {
      const minimumScore = posting.ats?.minimumScore ?? 0; // Default to 0 if minimumScore is undefined

      const selectedCandidates = (
        posting.candidates as unknown as Candidate[]
      ).filter((candidate) => {
        return candidate.appliedPostings.some((appliedPosting) => {
          const score = appliedPosting.scores.rs?.score ?? 0;
          return (
            appliedPosting.postingId === posting._id && score >= minimumScore
          );
        });
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
        className=""
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
                      value={posting?.ats?.minimumScore.toString()}
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
                      value={posting.ats?.negativePrompts.join(", ")}
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
                      value={posting.ats?.positivePrompts.join(", ")}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>

            {posting.candidates.length > 0 ? (
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
            <DataTable data={tableData} />
          </Tab>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Main;
