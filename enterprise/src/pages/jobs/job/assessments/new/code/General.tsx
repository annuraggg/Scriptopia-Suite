import { Input, Textarea } from "@heroui/input";
import type { DateValue } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";

import { motion } from "framer-motion";

const General = ({
  assessmentName,
  assessmentDescription,
  setAssessmentDescription,
  timeLimit,
  setTimeLimit,
  passingPercentage,
  setPassingPercentage,
}: {
  assessmentName: string;
  setAssessmentName?: (name: string) => void;
  assessmentDescription: string;
  setAssessmentDescription: (description: string) => void;
  timeLimit: number;
  setTimeLimit: (timeLimit: number) => void;
  passingPercentage: number;
  setPassingPercentage: (passingPercentage: number) => void;
  testOpenRange: RangeValue<DateValue>;
}) => {
  return (
    <div className="flex gap-10 h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col justify-start h-full"
      >
        <Input
          label="Assessment Name"
          value={assessmentName}
          isDisabled={true}
        />
        <Textarea
          className="mt-5"
          minRows={5} // Adjusted minRows for better UI
          label="Assessment Description"
          value={assessmentDescription}
          onChange={(e) => setAssessmentDescription(e.target.value)}
        />
        <div className="flex gap-5 mt-10">
          <Input
            labelPlacement="outside"
            label="Time Limit"
            placeholder="(In Minutes)"
            endContent={<div className="text-sm text-gray-400">mins.</div>}
            className="w-[200px]"
            type="number"
            value={timeLimit.toString()}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
          <Input
            labelPlacement="outside"
            label="Passing Percentage"
            placeholder="(In Percentage)"
            endContent={<div className="text-sm text-gray-400">%</div>}
            className="w-[200px]"
            type="number"
            value={passingPercentage.toString()}
            onChange={(e) => setPassingPercentage(Number(e.target.value))}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default General;
