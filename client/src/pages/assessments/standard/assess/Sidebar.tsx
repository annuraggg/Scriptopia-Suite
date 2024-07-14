import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Clock } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Button, Progress } from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

const convertToTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${hours}:${minutes}:${seconds}`;
};
const assessmentSteps = [
  {
    title: "Choose Your Path",
    description:
      "You have the flexibility to choose where to begin—either with MCQs or Coding Challenges. The choice is yours!",
  },
  {
    title: "Complete Both Sections",
    description:
      "To get a comprehensive evaluation, it's crucial to complete both the MCQ and Coding sections. Your skills in problem-solving and code implementation will be thoroughly assessed.",
  },
  {
    title: "Time Matters",
    description:
      "Keep an eye on the clock! Your overall time taken will be considered as part of the assessment.",
  },
  {
    title: "Review Your Progress",
    description:
      "Track your progress as you complete the assessment. Keep an eye on your overall completion, MCQ completion, and Code completion.",
  },
];

const Sidebar = ({
  timer,
  problemsSolved,
  mcqsSolved,
  submitAssessment,
}: {
  timer: number;
  problemsSolved: { total: number; solved: number };
  mcqsSolved: { total: number; solved: number };
  submitAssessment: () => void;
}) => {
  const getPercentage = (solved: number, total: number) => {
    if (!solved || !total) return 0;

    if (total === 0) return 0;
    return ((solved / total) * 100).toFixed(2);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[25%] h-full"
    >
      <Card className="w-full h-full">
        <CardHeader className=" border">
          <div className="flex gap-5 items-center justify-center w-full">
            <Clock />
            <div>{convertToTime(timer)}</div>
          </div>
        </CardHeader>
        <CardBody className="px-5 text-xs py-3">
          <div>
            <p className="text-medium">How the Assessment Works:</p>
            <div>
              {assessmentSteps.map((step, index) => (
                <div className="mt-5" key={index}>
                  <p className="font-bold mb-1 text-gray-300">
                    {index + 1}. {step.title}
                  </p>
                  <ul className="pl-4 text-gray-400">
                    <li>{step.description}</li>
                  </ul>
                </div>
              ))}

              <Card className="mt-5 p-3 border">
                <CardTitle className="text-sm">Your Progress</CardTitle>
                <CardBody>
                  <div>
                    <p>
                      Overall Completion:{" "}
                      {getPercentage(
                        problemsSolved?.solved + mcqsSolved?.solved,
                        problemsSolved?.total + mcqsSolved?.total
                      )}
                      %
                    </p>
                    <Progress
                      value={mcqsSolved?.solved + problemsSolved?.solved}
                      maxValue={mcqsSolved?.total + problemsSolved?.total}
                      className="mt-2"
                      size="sm"
                    />
                  </div>
                  <div className="mt-3">
                    <p>
                      MCQ Completion:{" "}
                      {getPercentage(mcqsSolved?.solved, mcqsSolved?.total)}%
                    </p>
                    <Progress
                      value={mcqsSolved?.solved}
                      maxValue={mcqsSolved?.total}
                      className="mt-2"
                      size="sm"
                    />
                  </div>
                  <div className="mt-3">
                    <p>
                      Code Completion:{" "}
                      {getPercentage(
                        problemsSolved?.solved,
                        problemsSolved?.total
                      )}
                      %
                    </p>
                    <Progress
                      value={problemsSolved?.solved}
                      maxValue={problemsSolved?.total}
                      className="mt-2"
                      size="sm"
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
        <Button
          className="mx-5 my-5"
          variant="flat"
          color="success"
          onClick={onOpen}
        >
          Complete Assessment
        </Button>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Do you want to submit the assessment?</ModalHeader>
          <ModalBody>
            You won't be able to make changes after submission.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onOpenChange} variant="flat" color="danger">
              Cancel
            </Button>
            <Button onClick={() => {
              submitAssessment();
              onOpenChange();
            }} variant="flat" color="success">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default Sidebar;
