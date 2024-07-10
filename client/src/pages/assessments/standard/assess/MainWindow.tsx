import { Button, Card, CardBody, Tabs, Tab, Textarea } from "@nextui-org/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CompassIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const problems = [
    { title: "Two Sum", _id: "1" },
    { title: "Add Two Numbers", _id: "2" },
    { title: "Longest Substring Without Repeating Characters", _id: "3" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const mcqs = [
    {
      question: "What is the capital of France?",
      type: "multiple",
      options: ["Paris", "Berlin", "London", "Madrid"],
    },
    {
      question: "Who is CEO of Tesla?",
      type: "checkbox",
      options: ["Jeff Bezos", "Elon Musk", "Bill Gates", "Tony Stark"],
    },
    {
      question: "The iPhone was created by which company?",
      type: "text",
    },
  ];

  const goTo = (id: string) => {
    const item = document.getElementById(id);
    if (item) {
      item.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }

    setIsOpen(false);
  };

  const navigate = useNavigate();

  return (
    <div className="w-[75%] h-full">
      <Tabs aria-label="Options">
        <Tab key="mcq" title="MCQs" className="h-[96%]">
          <Card className="h-full">
            <CardBody>
              <div>
                <div className="sticky -top-2 w-full flex gap-2 justify-between backdrop-blur-md px-5 py-2">
                  <Button isIconOnly onClick={() => setIsOpen(true)}>
                    <CompassIcon />
                  </Button>
                  <Button color="success" variant="flat">
                    Save
                  </Button>
                </div>
                {mcqs.map((mcq, index) => (
                  <div
                    className="flex flex-col border p-5 mt-3 rounded-xl bg-gray-100 bg-opacity-5 min-h-[30vh]"
                    id={`mcq-${index}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>{mcq.question}</div>
                      <div className="opacity-50">
                        {index + 1} of {mcqs.length}
                      </div>
                    </div>

                    {(mcq.type === "multiple" || mcq.type === "checkbox") && (
                      <div>
                        <p className="mt text-xs mt-3">
                          Select{" "}
                          {mcq.type === "checkbox" ? "one or more " : "one "}
                          option:
                        </p>
                        <ToggleGroup
                          type={mcq.type === "multiple" ? "single" : "multiple"}
                          className="w-full flex-wrap gap-3 mt-2"
                        >
                          {mcq?.options?.map((option) => (
                            <ToggleGroupItem
                              key={option}
                              value={option}
                              className="w-[48%] data-[state=on]:bg-green-6 data-[state=on]:bg-green-600 data-[state=on]:bg-opacity-20 data-[state=on]:text-green-500 border-2 p-5 bg-gray-100 bg-opacity-10"
                            >
                              {option}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    )}

                    {mcq.type === "text" && (
                      <div>
                        <Textarea
                          variant="bordered"
                          type="text"
                          placeholder="Write your answer here"
                          className="w-full mt-5 rounded-xl bg-gray-100 bg-opacity-5 min-h-full"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="code" title="Coding" className="h-[96%]">
          <Card className="w-full h-full">
            <CardBody>
              <div>
                <h5>Coding Challenges</h5>
                {problems.map((problem) => (
                  <div
                    key={problem._id}
                    className="flex justify-between px-5 py-2 items-center border mt-3 rounded-xl bg-gray-100 bg-opacity-5 hf"
                  >
                    <div>{problem.title}</div>
                    <Button onClick={() => navigate(`${problem._id}`)}>Attempt</Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Questions</SheetTitle>
            <SheetDescription>
              {mcqs.map((mcq, index) => (
                <div>
                  <a
                    onClick={() => goTo(`mcq-${index}`)}
                    className="block p-4 border rounded-lg mt-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-10"
                  >
                    {index + 1}. {mcq.question}
                  </a>
                </div>
              ))}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Main;
