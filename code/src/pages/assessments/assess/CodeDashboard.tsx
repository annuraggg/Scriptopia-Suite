import { useState } from "react";
import Sidebar from "./code/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Problem } from "@shared-types/Problem";
import { Card } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";

const CodeDashboard = ({ timer }: { timer: number }) => {
  const [problems, setProblems] = useState([
    {
      _id: 1,
      title: "Problem 1",
    },
    {
      _id: 2,
      title: "Problem 2",
    },
    {
      _id: 3,
      title: "Problem 3",
    },
  ]);

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="h-full p-5">
      <div className="flex gap-5">
        <p>Code Assessment</p>
      </div>
      <div className="mt-5 h-[93%] flex gap-2">
        {currentProblem ? (
          <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="left">
                <Sidebar
                  problems={problems as unknown as Problem[]}
                  currentProblem={currentProblem}
                  setCurrentProblem={setCurrentProblem}
                  isInsideSheet={true}
                />
              </SheetContent>
            </Sheet>
            <Card
              className="h-full flex items-center justify-center px-3"
              isPressable
              onClick={() => setSheetOpen(true)}
            >
              <ChevronRight className=" opacity-70 cursor-pointer" />
            </Card>
          </>
        ) : (
          <div className="w-[20%]">
            <Sidebar
              problems={problems as unknown as Problem[]}
              currentProblem={currentProblem}
              setCurrentProblem={setCurrentProblem}
              timer={timer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeDashboard;
