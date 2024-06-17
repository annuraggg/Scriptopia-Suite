import { Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

const Grading = () => {
  const [gradingMetric, setGradingMetric] = useState("");

  return (
    <div>
      <h4>Grading Metrics</h4>
      <Select
        label="Grading Metric"
        size="sm"
        className="w-[400px] mt-5"
        selectedKeys={[gradingMetric]}
        onChange={(e) => setGradingMetric(e.target.value)}
      >
        <SelectItem key="testcase" value="testcase">
          By Test Case Difficulty
        </SelectItem>
        <SelectItem key="questions" value="questions">
          By Questions
        </SelectItem>
      </Select>

      <div className="mt-5">
        {gradingMetric === "testcase" && (
          <div>
            <p className="text-sm text-gray-400 mb-16">
              Evaluate Candidates based on how many test cases they pass and how
              difficult each test case is.
            </p>

            <Input
              type="number"
              label="Score for Easy Test Cases"
              className="w-[200px] mb-10"
              endContent={<div>pts.</div>}
              labelPlacement="outside"
              placeholder="score"
            />
            <Input
              type="number"
              label="Score for Medium Test Cases"
              className="w-[200px] mb-10"
              endContent={<div>pts.</div>}
              labelPlacement="outside"
              placeholder="score"
            />
            <Input
              type="number"
              label="Score for Hard Test Cases"
              className="w-[200px]"
              endContent={<div>pts.</div>}
              labelPlacement="outside"
              placeholder="score"
            />
          </div>
        )}

        {gradingMetric === "questions" && (
          <div>
            <p className="text-sm text-gray-400 mb-16">
              Evaluate Candidates based on the number of questions they answer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grading;
