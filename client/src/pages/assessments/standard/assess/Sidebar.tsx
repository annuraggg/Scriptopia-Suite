import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Clock } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Progress } from "@nextui-org/react";

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
  progress,
}: {
  timer: number;
  progress: { overall: number; mcq: number; code: number };
}) => {
  return (
    <div className="w-[25%] h-full">
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
                <div className="mt-5">
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
                    <p>Overall Completion: {progress.overall}%</p>
                    <Progress
                      value={progress.overall}
                      className="mt-2"
                      size="sm"
                    />
                  </div>
                  <div className="mt-3">
                    <p>MCQ Completion: {progress.mcq}%</p>
                    <Progress value={progress.mcq} className="mt-2" size="sm" />
                  </div>
                  <div className="mt-3">
                    <p>Code Completion: {progress.code}%</p>
                    <Progress
                      value={progress.code}
                      className="mt-2"
                      size="sm"
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Sidebar;
