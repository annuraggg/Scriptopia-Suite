import { Card, Code, Tab, Tabs } from "@nextui-org/react";
import { FlaskConical, SquareChevronRight } from "lucide-react";
import { RunResponseResult } from "@shared-types/RunResponse";

const InfoPanel = ({
  consoleOutput,
  cases,
}: {
  consoleOutput: string[];
  cases: RunResponseResult[];
}) => {
  return (
    <Card className="h-[50%] mt-2 p-2 overflow-auto">
      <Tabs>
        {" "}
        <Tab
          title={
            <div className="flex items-center gap-2">
              <FlaskConical size={17} className="text-gray-400" />
              <p>Test Cases</p>
            </div>
          }
          key="cases"
        >
          {cases.length !== 0 ? (
            <Tabs className="overflow-auto">
              {cases?.map(
                (c: RunResponseResult, i: number) =>
                  c.isSample && (
                    <Tab
                      key={i}
                      title={
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1 h-1 rounded-full ${c.passed
                                ? "bg-green-500"
                                : "bg-red-500"
                              }`}
                          ></div>
                          <p>Case {i + 1}</p>
                        </div>
                      }
                      className="h-full"
                    >
                      <div className="overflow-auto h-full">
                        <Code className="border p-2 rounded-lg w-full">
                          <p className="mb-2">Input</p>
                          <Code className="w-full">{c.input}</Code>
                        </Code>
                        <Code className="border p-2 rounded-lg w-full mt-2">
                          <p className="mb-2">Expected Output</p>
                          <Code className="w-full">{c.expected}</Code>
                        </Code>
                        <Code className="border p-2 rounded-lg w-full mt-2">
                          <p className="mb-2">Output</p>
                          <Code className="w-full">{c.output}</Code>
                        </Code>
                      </div>
                    </Tab>
                  )
              )}
            </Tabs>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                Run Code atleast once to see output
              </p>
            </div>
          )}
        </Tab>
        <Tab
          title={
            <div className="flex items-center gap-2">
              <SquareChevronRight size={20} className="text-gray-400" />{" "}
              <p>Console</p>
            </div>
          }
          key="console"
          className="h-full"
        >
          <div className="h-full bg-[#0000008b] p-3 rounded-lg">
            {consoleOutput.length > 0 ? (
              consoleOutput.map((output, index) => (
                <pre key={index} className="text-sm text-gray-500 mb-2">
                  {output}
                </pre>
              ))
            ) : (
              <p className="text-sm text-gray-500 h-full overflow-auto">No Output</p>
            )}
          </div>
        </Tab>
      </Tabs>
    </Card>
  );
};

export default InfoPanel;
