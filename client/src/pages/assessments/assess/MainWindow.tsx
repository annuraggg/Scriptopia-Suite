import { Button, Card, CardBody, Tabs, Tab, Textarea } from "@nextui-org/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check, CompassIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMcq } from "@shared-types/Assessment";
import { IProblem } from "@shared-types/Problem";
import secureLocalStorage from "react-secure-storage";

const Main = ({
  mcqs,
  problems,
  setUpdateFlag,
  languages,
  solvedProblems,
}: {
  mcqs: IMcq[];
  problems: IProblem[];
  setUpdateFlag: (flag: boolean | ((prevState: boolean) => boolean)) => void;
  languages: string[];
  solvedProblems: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("name") as string;
    const email = localStorage.getItem("email") as string;

    if (!name || !email) {
      const redirectPath = window.location.pathname.split("/").slice(0, -1);
      window.location.href = redirectPath.join("/");
    }

    const submissions =
      (secureLocalStorage.getItem("mcqSubmissions") as string) || "[]";
    const parsedSubmissions = JSON.parse(submissions);
    const answers = parsedSubmissions.map(
      (item: { answer: string }) => item.answer
    );
    setMcqAnswers(answers);
  }, []);

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

  const [mcqAnswers, setMcqAnswers] = useState<(string | string[] | undefined)[]>([]);

  const navigate = useNavigate();

  const saveAnswer = (value: string | string[], index: number) => {
    const saveObj = {
      id: mcqs[index]._id,
      answer: value,
    };


    setMcqAnswers((prev) => {
      const updatedAnswers = [...prev];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        updatedAnswers[index] = undefined;
      } else {
        updatedAnswers[index] = value;
      }
      return updatedAnswers;
    });

    const submissionArray =
      (secureLocalStorage.getItem("mcqSubmissions") as string) || "[]";
    const submissions = JSON.parse(submissionArray);

    const exists = submissions.findIndex(
      (item: { id: string }) => item.id === mcqs[index]._id
    );

    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (exists !== -1) {
        submissions.splice(exists, 1);
      }
    } else {
      if (exists !== -1) {
        submissions[exists] = saveObj;
      } else {
        submissions.push(saveObj);
      }
    }
    secureLocalStorage.setItem("mcqSubmissions", JSON.stringify(submissions));
    setUpdateFlag((prev) => !prev);
  };

  return (
    <div className="w-[75%] h-full">
      <Tabs aria-label="Options">
        {mcqs?.length > 0 && (
          <Tab key="mcq" title="MCQs" className="h-[96%]">
            <Card className="h-full">
              <CardBody>
                <div>
                  <div className="sticky -top-2 w-full flex gap-2 justify-between backdrop-blur-md px-5 py-2">
                    <Button isIconOnly onClick={() => setIsOpen(true)}>
                      <CompassIcon />
                    </Button>
                  </div>
                  {mcqs?.map((mcq, index) => (
                    <div
                      className="flex flex-col border p-5 mt-3 rounded-xl bg-gray-100 bg-opacity-5 min-h-[30vh]"
                      id={`mcq-${index}`}
                      key={index}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex gap-3 items-center">
                          {mcq.question}{" "}
                          {mcqAnswers[index] && (
                            <Check size={16} className="text-green-500" />
                          )}
                        </div>
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
                          {/* @ts-expect-error - Types are not available for this library */}
                          <ToggleGroup
                            type={
                              mcq.type == "multiple" ? "single" : "multiple"
                            }
                            className="w-full flex-wrap gap-3 mt-2"
                            value={mcqAnswers[index] as string | string[]}
                            onValueChange={(value: string | string[]) =>
                              saveAnswer(value, index)
                            }
                          >
                            {mcq.type === "multiple" &&
                              mcq?.mcq?.options?.map((option) => (
                                <ToggleGroupItem
                                  key={option}
                                  value={option}
                                  className="w-[48%] data-[state=on]:bg-green-6 data-[state=on]:bg-green-600 data-[state=on]:bg-opacity-20 data-[state=on]:text-green-500 border-2 p-5 py-7 bg-gray-100 bg-opacity-10"
                                >
                                  {option}
                                </ToggleGroupItem>
                              ))}

                            {mcq.type === "checkbox" &&
                              mcq?.checkbox?.options?.map((option) => (
                                <ToggleGroupItem
                                  key={option}
                                  value={option}
                                  className="w-[48%] data-[state=on]:bg-green-6 data-[state=on]:bg-green-600 data-[state=on]:bg-opacity-20 data-[state=on]:text-green-500 border-2 p-5 py-7 bg-gray-100 bg-opacity-10"
                                >
                                  {option}
                                </ToggleGroupItem>
                              ))}
                          </ToggleGroup>
                        </div>
                      )}

                      {mcq.type === "text" && (
                        <div className="flex flex-col">
                          <Textarea
                            variant="bordered"
                            type="text"
                            placeholder="Write your answer here"
                            className="w-full mt-5 rounded-xl bg-gray-100 bg-opacity-5 min-h-full"
                            value={(mcqAnswers[index] as string) || ""}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setMcqAnswers((prev) => {
                                const updatedAnswers = [...prev];
                                updatedAnswers[index] = newValue;
                                return updatedAnswers;
                              });
                            }}
                          />
                          <div className="flex justify-end mt-3">
                            <Button
                              color="success"
                              variant="flat"
                              className="items-center"
                              onClick={() =>
                                saveAnswer(mcqAnswers[index] as string, index)
                              }
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
        )}
        {problems?.length > 0 && (
          <Tab key="code" title="Coding" className="h-[96%]">
            <Card className="w-full h-full">
              <CardBody>
                <div>
                  <h5>Coding Challenges</h5>
                  {problems?.map((problem) => (
                    <div
                      key={problem._id}
                      className="flex justify-between px-5 py-2 items-center border mt-3 rounded-xl bg-gray-100 bg-opacity-5 hf"
                    >
                      <div>{problem.title}</div>
                      <div className="flex gap-3 items-center">
                        {solvedProblems.includes(problem._id) && (
                          <Check size={16} className="text-green-500" />
                        )}
                        <Button
                          onClick={() =>
                            navigate(`${problem._id}`, {
                              state: { languages: languages },
                            })
                          }
                          isDisabled={solvedProblems.includes(problem._id)}
                        >
                          Attempt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Questions</SheetTitle>
            <SheetDescription>
              {mcqs?.map((mcq, index) => (
                <div key={index}>
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
