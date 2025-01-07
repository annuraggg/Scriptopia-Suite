import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { CodeAssessmentSubmissionsSchema as CASS } from "@shared-types/CodeAssessmentSubmission";
import { Problem } from "@shared-types/Problem";

interface SidebarProps {
  problems: Problem[];
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem) => void;
  isInsideSheet?: boolean;
  timer: number;
  assessmentSub: CASS;
  onOpen: () => void;
}

const Sidebar = ({
  problems,
  currentProblem,
  setCurrentProblem,
  isInsideSheet = false,
  timer,
  assessmentSub,
  onOpen,
}: SidebarProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProblemClick = (problem: Problem) => {
    const isSubmitted = assessmentSub?.submissions?.some(
      (submission) => submission.problemId === problem._id
    );

    if (!isSubmitted) {
      setCurrentProblem(problem);
    }
  };

  return (
    <Card
      className={`min-h-full w-full overflow-y-auto
        ${isInsideSheet ? "bg-transparent shadow-none" : ""}
    `}
    >
      <div className="sticky p-5">
        <Button
          color="success"
          variant="flat"
          className="mb-3 w-full"
          onClick={onOpen}
        >
          Submit Assessment
        </Button>
        <Progress value={50} label="Progress" />
        <p className="mt-5 text-center">Time Left: {formatTime(timer)}</p>
      </div>

      <CardBody
        className={`h-full ${
          isInsideSheet ? "bg-transparent border-none drop-shadow-none" : ""
        }`}
      >
        <div>
          {problems.map((problem) => {
            const isSubmitted = assessmentSub?.submissions?.some(
              (submission) => submission.problemId === problem._id
            );
            const isCurrentProblem = currentProblem?._id === problem._id;

            return (
              <div
                key={problem._id}
                className={`mt-2 bg-card border-2 py-4 px-5 rounded-xl cursor-pointer transition-colors
                  ${isCurrentProblem ? "bg-foreground-100" : ""}
                  ${
                    isSubmitted
                      ? "bg-foreground-100 opacity-50"
                      : "hover:bg-foreground-100 bg-opacity-50"
                  }
                `}
                onClick={() => handleProblemClick(problem)}
              >
                <p>{problem?.title}</p>
                {isSubmitted && (
                  <p className="text-sm text-gray-500">Submitted</p>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
