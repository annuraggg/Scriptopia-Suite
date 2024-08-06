/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@nextui-org/react";
import { useState } from "react";
import CodeSolutionModal from "./CodeSolutionModal";
import McqReportModal from "./McqReportModal";
import IAssessSub from "@/@types/AssessmentSubmission";

const ViewUserAssessmentBottom = ({
}: {
  submission: IAssessSub;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const codeResult = [
    {
      problem: "Two Sum",
      difficulty: "Easy",
      timeTaken: "10m:32s",
      status: "Accepted",
    },
    {
      problem: "Add Two Numbers",
      difficulty: "Medium",
      timeTaken: "10m:32s",
      status: "Accepted",
    },
    {
      problem: "Longest Substring Without Repeating Characters",
      difficulty: "Hard",
      timeTaken: "10m:32s",
      status: "Rejected",
    },
    {
      problem: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      timeTaken: "10m:32s",
      status: "Accepted",
    },
    {
      problem: "Longest Palindromic Substring",
      difficulty: "Hard",
      timeTaken: "10m:32s",
      status: "Rejected",
    },
  ];

  const mcqResult = [
    {
      assessmentName: "Test 01",
      accessTo: "All",
      time: "60 Minutes",
      status: "Completed",
    },
    {
      assessmentName: "Test 02",
      accessTo: "All",
      time: "60 Minutes",
      status: "Completed",
    },
    {
      assessmentName: "Test 03",
      accessTo: "Specific",
      time: "60 Minutes",
      status: "Completed",
    },
    {
      assessmentName: "Test 04",
      accessTo: "All",
      time: "60 Minutes",
      status: "Completed",
    },
    {
      assessmentName: "Test 05",
      accessTo: "All",
      time: "60 Minutes",
      status: "Completed",
    },
  ];

  return (
    <div className="mt-3">
      <div className="w-full h-screen flex flex-row gap-3">
        <div className="w-full h-screen flex flex-col">
          <Tabs aria-label="Options" className="w-full" variant="bordered">
            <Tab key="mcq" title="MCQs" className="">
              <Table isStriped aria-label="Mcq Results">
                <TableHeader>
                  <TableColumn className="text-sm">Assessment Name</TableColumn>
                  <TableColumn className="text-sm">Access to</TableColumn>
                  <TableColumn className="text-sm">Time</TableColumn>
                  <TableColumn className="text-sm">Status</TableColumn>
                  <TableColumn className="text-sm">Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {mcqResult.map((mcqResult: any) => (
                    <TableRow className="h-14" key={mcqResult.assessmentName}>
                      <TableCell className="w-full md:w-auto">
                        {mcqResult.assessmentName}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        {mcqResult.accessTo}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        {mcqResult.time}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        {mcqResult.status}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        <Button
                          variant="light"
                          color="success"
                          onPress={handleOpen}
                        >
                          View Sol
                        </Button>
                        {isOpen && (
                          <McqReportModal
                            isOpen={isOpen}
                            onClose={handleClose}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>
            <Tab key="coding" title="Coding" className="">
              <Table isStriped aria-label="Code Results">
                <TableHeader>
                  <TableColumn className="text-sm">Problem</TableColumn>
                  <TableColumn className="text-sm">Difficulty</TableColumn>
                  <TableColumn className="text-sm">Time</TableColumn>
                  <TableColumn className="text-sm">Status</TableColumn>
                  <TableColumn className="text-sm">Action</TableColumn>
                </TableHeader>
                <TableBody>
                  {codeResult.map((codeResult: any) => (
                    <TableRow className="h-14" key={codeResult.problem}>
                      <TableCell className="w-full md:w-auto">
                        {codeResult.problem}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        {codeResult.difficulty}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        {codeResult.timeTaken}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        {codeResult.status}
                      </TableCell>
                      <TableCell className="w-full md:w-auto">
                        <Button
                          variant="light"
                          color="success"
                          onPress={handleOpen}
                        >
                          View Sol
                        </Button>
                        <CodeSolutionModal
                          isOpen={isOpen}
                          onClose={handleClose}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewUserAssessmentBottom;
