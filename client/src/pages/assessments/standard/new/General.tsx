import {
  Checkbox,
  Input,
  RangeCalendar,
  Textarea,
  TimeInput,
  TimeInputValue,
} from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { motion } from "framer-motion";
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";

const General = ({
  assessmentName,
  setAssessmentName,
  assessmentDescription,
  setAssessmentDescription,
  timeLimit,
  setTimeLimit,
  passingPercentage,
  setPassingPercentage,
  allowAutocomplete,
  setAllowAutocomplete,
  allowRunCode,
  setAllowRunCode,
  allowSyntaxHighlighting,
  setAllowSyntaxHighlighting,
  testOpenRange,
  setTestOpenRange,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: {
  assessmentName: string;
  setAssessmentName: (name: string) => void;
  assessmentDescription: string;
  setAssessmentDescription: (description: string) => void;
  timeLimit: number;
  setTimeLimit: (timeLimit: number) => void;
  passingPercentage: number;
  setPassingPercentage: (passingPercentage: number) => void;
  allowAutocomplete: boolean;
  setAllowAutocomplete: (allowAutocomplete: boolean) => void;
  allowRunCode: boolean;
  setAllowRunCode: (allowRunCode: boolean) => void;
  allowSyntaxHighlighting: boolean;
  setAllowSyntaxHighlighting: (allowSyntaxHighlighting: boolean) => void;
  testOpenRange: RangeValue<DateValue>;
  setTestOpenRange: (testOpenRange: RangeValue<DateValue>) => void;
  startTime: TimeInputValue;
  setStartTime: (startTime: TimeInputValue) => void;
  endTime: TimeInputValue;
  setEndTime: (endTime: TimeInputValue) => void;
}) => {
  return (
    <div className="flex gap-10 h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col justify-center h-full"
      >
        <Input
          label="Assessment Name"
          value={assessmentName}
          onChange={(e) => setAssessmentName(e.target.value)}
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

        <div className="flex gap-10 mt-10">
          <Checkbox
            size="sm"
            color="success"
            checked={allowAutocomplete}
            onChange={(e) => setAllowAutocomplete(e.target.checked)}
          >
            Allow Autocomplete
          </Checkbox>
          <Checkbox
            size="sm"
            color="success"
            checked={allowRunCode}
            onChange={(e) => setAllowRunCode(e.target.checked)}
          >
            Allow to Run Code
          </Checkbox>
          <Checkbox
            size="sm"
            color="success"
            checked={allowSyntaxHighlighting}
            onChange={(e) => setAllowSyntaxHighlighting(e.target.checked)}
          >
            Allow Syntax Highlighting
          </Checkbox>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }} // Added a delay for staggered animation
      >
        <p className="text-sm">Test Open Range</p>
        <RangeCalendar
          aria-label="Open Range"
          className="mt-2"
          minValue={today(getLocalTimeZone())}
          value={testOpenRange}
          onChange={setTestOpenRange}
        />
        <TimeInput
          label="From Time"
          className="mt-3"
          size="sm"
          value={startTime}
          onChange={setStartTime}
        />
        <TimeInput
          label="To Time"
          className="mt-3"
          size="sm"
          value={endTime}
          onChange={setEndTime}
        />
      </motion.div>
    </div>
  );
};

export default General;
