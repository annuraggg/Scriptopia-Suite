import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { Problem } from "@shared-types/Problem";

const Sidebar = ({
  problems,
  currentProblem,
  setCurrentProblem,
  isInsideSheet,
  timer,
}: {
  problems: Problem[];
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem) => void;
  isInsideSheet?: boolean;
  timer: number;
}) => {
  const getTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds}`;
  };

  return (
    <Card
      className={`min-h-full w-full overflow-y-auto
        ${isInsideSheet ? "bg-transparent shadow-none	" : ""}
    `}
    >
      <div className="sticky p-5">
        <Button color="success" variant="flat" className="mb-3 w-full">
          Submit Assessment
        </Button>
        <Progress value={50} label="Progress" />
        <p className="mt-5 text-center">Time Left: {getTime(timer)}</p>
      </div>
      <CardBody
        className={`h-full      ${
          isInsideSheet ? "bg-transparent border-none drop-shadow-none" : ""
        }`}
      >
        <div>
          {problems.map((problem) => (
            <div
              key={problem._id}
              className={`mt-2 bg-card border-2 py-4 px-5 rounded-xl cursor-pointer transition-colors
                ${
                  currentProblem?._id === problem._id
                    ? "bg-foreground-100"
                    : "hover:bg-foreground-100 bg-opacity-50"
                }
                `}
              onClick={() => setCurrentProblem(problem)}
            >
              <p>{problem.title}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
