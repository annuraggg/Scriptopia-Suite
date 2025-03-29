import { Card, Code, Spinner, Tab, Tabs } from "@heroui/react";
import { FlaskConical } from "lucide-react";

interface RunResponseResult {
  input: string[];
  output: string;
  expected: string;
  passed: boolean;
  error: string;
  consoleOutput: string[];
  isSample: boolean;
}

const InfoPanel = ({
  cases,
  runningCode,
}: {
  cases: RunResponseResult[];
  runningCode: boolean;
}) => {
  if (runningCode)
    return (
      <div className="min-h-full flex items-center justify-center">
        <Spinner size="md" className="text-gray-400 mt-20" />
      </div>
    );

  return (
    <Card className="min-h-[39vh] mt-2 p-2 overflow-auto">
      <Tabs>
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
                  (c.isSample || (!c.isSample && !c.passed)) && (
                    <Tab
                      key={i}
                      title={
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1 h-1 rounded-full ${
                              c.passed ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <p>{c.isSample ? `Case ${i + 1}` : "Hidden Case"}</p>
                        </div>
                      }
                      className="h-full"
                    >
                      <div className="overflow-auto h-full">
                        {c?.error && (
                          <Code className="border p-2 rounded-lg w-full mt-2 bg-red-500 bg-opacity-20 text-red-300">
                            <p className="mb-2">Stderr</p>
                            <Code className="w-full min-h-7 text-red-300">
                              <pre>{c?.error}</pre>
                            </Code>
                          </Code>
                        )}
                        <Code className="border p-2 rounded-lg w-full mt-2">
                          <p className="mb-2">Input</p>
                          <Code className="w-full min-h-7">
                            <pre>{c?.input?.join(", ")}</pre>
                          </Code>
                        </Code>
                        <Code className="border p-2 rounded-lg w-full mt-2">
                          <p className="mb-2">Expected Output</p>
                          <Code className="w-full min-h-7">
                            <pre>{c?.expected}</pre>
                          </Code>
                        </Code>
                        <Code className="border p-2 rounded-lg w-full mt-2">
                          <p className="mb-2">Output</p>
                          <Code className="w-full min-h-7">
                            <pre>{c?.output}</pre>
                          </Code>
                        </Code>
                        <Code className="border p-2 rounded-lg w-full mt-2">
                          <p className="mb-2">Stdout</p>
                          <Code className="w-full min-h-7">
                            <pre>{c?.consoleOutput?.join("\n")}</pre>
                          </Code>
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
      </Tabs>
    </Card>
  );
};

export default InfoPanel;
