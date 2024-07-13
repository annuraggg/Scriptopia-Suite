import {
  Input,
  Card,
  CardHeader,
  CardBody,
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
import { AlignEndHorizontal} from "lucide-react";
import { useState } from "react";
import CodeSolutionModal from "./CodeSolutionModal";
import McqReportModal from "./McqReportModal";

const ViewUserAssessmentBottom = () => {
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
    }
  ]

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
    }
  ]

  return (
    <div className="w-full h-screen flex flex-row pt-20 gap-9">
      <div className="w-full h-screen flex flex-col">
        <Tabs aria-label="Options" className=''>
          <Tab key="mcq" title="MCQs" className="">
            <Table isStriped aria-label="Mcq Results" className="pt-6">
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
                    <TableCell className="w-full md:w-auto">{mcqResult.assessmentName}</TableCell>
                    <TableCell className="w-full md:w-auto">{mcqResult.accessTo}</TableCell>
                    <TableCell className="w-full md:w-auto">{mcqResult.time}</TableCell>
                    <TableCell className="w-full md:w-auto">{mcqResult.status}</TableCell>
                    <TableCell className="w-full md:w-auto">
                    <Button
                        variant="light"
                        color="success"
                        onPress={handleOpen}
                      >
                        View Sol
                      </Button>
                      <McqReportModal isOpen={isOpen} onClose={handleClose} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
          <Tab key="coding" title="Coding" className="">
            <Table isStriped aria-label="Code Results" className="pt-6">
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
                    <TableCell className="w-full md:w-auto">{codeResult.problem}</TableCell>
                    <TableCell className="w-full md:w-auto">{codeResult.difficulty}</TableCell>
                    <TableCell className="w-full md:w-auto">{codeResult.timeTaken}</TableCell>
                    <TableCell className="w-full md:w-auto">{codeResult.status}</TableCell>
                    <TableCell className="w-full md:w-auto">
                      <Button
                        variant="light"
                        color="success"
                        onPress={handleOpen}
                      >
                        View Sol
                      </Button>
                      <CodeSolutionModal isOpen={isOpen} onClose={handleClose} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
      </div>
      <div className="w-full h-screen flex flex-col gap-4">
        <Input type="Search" label="Search Problems" size="sm" />
        <div className="flex flex-row gap-4">
          <Card className="h-56 w-full rounded-3xl">
            <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
              <AlignEndHorizontal className="text-white" size={26} />
              <p>Total Average</p>
            </CardHeader>
            <CardBody className="flex justify-center items-center gap-1 flex-row pt-3 pl-5">
              <div className="flex flex-row gap-4 items-start">
                <div className="flex flex-col gap-2 pt-4 mr-10">
                  <p className="text-lg">MCQ</p>
                  <p className="text-xl">50%</p>
                </div>
                <div className="w-[2px] h-[18vh] bg-gray-600"></div>
                <div className="flex flex-col gap-2 pt-4 mr-10 ml-10">
                  <p className="text-lg">Coding</p>
                  <p className="text-xl">50%</p>
                </div>
                <div className="w-[2px] h-[18vh] bg-gray-600"></div>
                <div className="flex flex-col gap-2 pt-4 ml-10">
                  <p className="text-lg">total</p>
                  <p className="text-xl">50%</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Button variant="bordered" className="flex justify-center items-center h-56 w-[14%] rounded-3xl bg-green-600">
            <p className="text-center text-white text-2xl font-semibold -rotate-90">
              PASS
            </p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ViewUserAssessmentBottom