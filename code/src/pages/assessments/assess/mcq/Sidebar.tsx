import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";

interface SidebarProps {
  timer: number;
  assessment: MA;
  currentSection: number;
  setCurrentSection: (index: number) => void;
}

const Sidebar = ({
  timer,
  assessment,
  currentSection,
  setCurrentSection,
}: SidebarProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="min-h-full w-[20%] overflow-y-auto">
      <div className="sticky p-5">
        <Button color="success" variant="flat" className="mb-3 w-full">
          Submit Assessment
        </Button>
        <Progress value={50} label="Progress" />
        <p className="mt-5 text-center">Time Left: {formatTime(timer)}</p>
      </div>

      <CardBody className="h-full">
        <div>
          {assessment?.sections?.map((section, index) => (
            <div
              key={index}
              className={`mt-2 bg-card border-2 py-4 px-5 rounded-xl cursor-pointer transition-colors
                ${
                  currentSection === index
                    ? "bg-foreground-100"
                    : "hover:bg-foreground-100 bg-opacity-50"
                }
                `}
              onClick={() => setCurrentSection(index)}
            >
              <p>{section?.name}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
