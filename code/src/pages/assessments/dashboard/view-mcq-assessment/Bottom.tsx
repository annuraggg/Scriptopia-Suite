// @ts-nocheck
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import McqReportModal from "./McqReportModal";
import { AssessmentSubmissionsSchema as IAssessSub } from "@shared-types/AssessmentSubmission";
import { Assessment, Mcq } from "@shared-types/Assessment";

interface MCQ {
  question: string;
  type: string;
  options: string[];
  selected: string[];
  correct: string[];
  grade: number;
}

interface Problem {
  solution: boolean;
  language: string;
  pasted: boolean;
  windowSwitch: boolean;
  code: string;
  testCases: { input: string; output: string; expected: string }[];
}

const ViewUserAssessmentBottom = ({
  submission,
  assessment,
}: {
  submission: IAssessSub;
  assessment: Assessment;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const [mcqIndex, setMcqIndex] = useState(1);
  const [mcqFormat, setMcqFormat] = useState<MCQ[]>([]);
  const [_problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    if (assessment?.mcqs) {
      const allMcqs = assessment?.mcqs?.map((mcq) => {
        const mcqObj: MCQ = {
          question: mcq?.question,
          type: mcq?.type,
          options:
            mcq?.type === "text"
              ? []
              : mcq?.type === "multiple" && mcq?.mcq?.options
              ? mcq?.mcq?.options
              : mcq?.checkbox?.options
              ? mcq?.checkbox?.options
              : [],
          selected:
            submission?.mcqSubmissions?.find(
              (sub) => sub?.mcqId?.toString() === mcq?._id
            )?.selectedOptions || [],
          correct:
            mcq?.type === "text"
              ? []
              : mcq?.type === "multiple" && mcq?.mcq?.options
              ? mcq?.mcq?.options
              : mcq?.checkbox?.options
              ? mcq?.checkbox?.options
              : [],
          grade: mcq?.grade,
        };
        return mcqObj;
      });

      setMcqFormat(allMcqs);
    }

    if (assessment?.problems) {
      const allProblems = assessment?.problems?.map((prob: any) => {
        const supportingSolution = submission?.submissions?.find(
          (sub) => sub.problemId?.toString() === prob?._id
        );
        const copy = submission?.offenses?.copyPaste?.problem?.find(
          (offense) => offense?.problemId === prob?._id
        );

        const window = submission?.offenses?.tabChange?.problem?.find(
          (offense) => offense?.problemId === prob?._id
        );

        const testCases = prob?.testCases?.map((testCase: any) => {
          return {
            input: testCase?.input,
            expected: testCase?.output,
            output: supportingSolution?.results.find(
              (result) => result?.caseId === testCase?._id
            )?.output,
          };
        });

        const problemObj: Problem = {
          solution:
            supportingSolution?.results?.every((result) => result?.passed) ||
            false,
          language: supportingSolution?.language || "",
          pasted: copy ? true : false,
          windowSwitch: window ? true : false,
          code: supportingSolution?.code || "",
          testCases: testCases,
        };
        return problemObj;
      });

      setProblems(allProblems);
    }
  }, [assessment]);

  return (
    <div className="mt-3">
      <div className="w-full h-screen flex flex-row gap-3">
        <div className="w-full h-screen flex flex-col">
          <Tabs aria-label="Options" className="w-full" variant="bordered">
            {assessment?.mcqs?.length > 0 && (
              <Tab key="mcq" title="MCQs" className="">
                <Table isStriped aria-label="Mcq Results">
                  <TableHeader>
                    <TableColumn className="text-sm">
                      Assessment Name
                    </TableColumn>
                    <TableColumn className="text-sm">Status</TableColumn>
                    <TableColumn className="text-sm">Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {assessment?.mcqs?.map((mcqResult: Mcq, i) => (
                      <TableRow className="h-14" key={mcqResult?._id}>
                        <TableCell className="w-full md:w-auto">
                          {mcqResult?.question}
                        </TableCell>
                        <TableCell className="w-full md:w-auto">
                          {submission?.mcqSubmissions?.find(
                            (sub) => sub?.mcqId?.toString() === mcqResult?._id
                          )
                            ? "Completed"
                            : "Not Completed"}
                        </TableCell>
                        <TableCell className="w-full md:w-auto">
                          <Button
                            variant="light"
                            color="success"
                            onPress={() => {
                              setMcqIndex(i + 1);
                              handleOpen();
                            }}
                          >
                            View Report
                          </Button>
                          <McqReportModal
                            isOpen={isOpen}
                            onClose={handleClose}
                            mcqIndex={mcqIndex}
                            setMcqIndex={setMcqIndex}
                            mcqs={mcqFormat}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewUserAssessmentBottom;
