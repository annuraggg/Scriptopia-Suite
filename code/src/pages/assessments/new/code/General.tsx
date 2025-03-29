import { Input, Textarea } from "@heroui/react";
import { motion } from "framer-motion";
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";
import {
  TimeInput,
  TimeInputValue,
  RangeCalendar,
  Button,
  ButtonGroup,
} from "@heroui/react";
import {
  startOfWeek,
  startOfMonth,
  getLocalTimeZone,
  today,
  endOfWeek,
  endOfMonth,
  CalendarDate,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

const General = ({
  assessmentName,
  setAssessmentName,
  assessmentDescription,
  setAssessmentDescription,
  timeLimit,
  setTimeLimit,
  passingPercentage,
  setPassingPercentage,
  testOpenRange,
  setTestOpenRange,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  focusedValue,
  setFocusedValue,
}: {
  assessmentName: string;
  setAssessmentName: (name: string) => void;
  assessmentDescription: string;
  setAssessmentDescription: (description: string) => void;
  timeLimit: number;
  setTimeLimit: (timeLimit: number) => void;
  passingPercentage: number;
  setPassingPercentage: (passingPercentage: number) => void;
  testOpenRange: RangeValue<DateValue>;
  setTestOpenRange: (testOpenRange: RangeValue<DateValue>) => void;
  startTime: TimeInputValue;
  setStartTime: (startTime: TimeInputValue) => void;
  endTime: TimeInputValue;
  setEndTime: (endTime: TimeInputValue) => void;
  focusedValue: CalendarDate;
  setFocusedValue: (focusedValue: CalendarDate) => void;
}) => {
  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let nextMonth = now.add({ months: 1 });

  let nextWeek = {
    start: startOfWeek(now.add({ weeks: 1 }), locale),
    end: endOfWeek(now.add({ weeks: 1 }), locale),
  };
  let thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };
  let nextMonthValue = {
    start: startOfMonth(nextMonth),
    end: endOfMonth(nextMonth),
  };

  const isPosting = new URLSearchParams(window.location.search).get(
    "isPosting"
  );

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
      </motion.div>{" "}
      {!isPosting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="max-w-[22%] w-[22%] min-w-[22%]"
        >
          <p className="text-sm mb-3">Test Open Range</p>
          <RangeCalendar
            classNames={{
              content: "w-full",
            }}
            className="w-full "
            focusedValue={focusedValue}
            topContent={
              <ButtonGroup
                fullWidth
                className="px-3 max-w-full pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                radius="full"
                size="sm"
                variant="light"
              >
                <Button
                  onPress={() => {
                    setTestOpenRange(nextWeek);
                    setFocusedValue(nextWeek.end);
                  }}
                >
                  Next week
                </Button>
                <Button
                  onPress={() => {
                    setTestOpenRange(thisMonth);
                    setFocusedValue(thisMonth.start);
                  }}
                >
                  This month
                </Button>
                <Button
                  onPress={() => {
                    setTestOpenRange(nextMonthValue),
                      setFocusedValue(nextMonthValue.start);
                  }}
                >
                  Next month
                </Button>
              </ButtonGroup>
            }
            value={testOpenRange}
            onChange={setTestOpenRange}
            onFocusChange={setFocusedValue}
          />

          <div className="flex gap-3 w-full">
            <TimeInput
              label="From Time"
              className="mt-3 w-full"
              size="sm"
              value={startTime}
              onChange={setStartTime as any}
              hideTimeZone
            />
            <TimeInput
              label="To Time"
              className="mt-3 w-full"
              size="sm"
              value={endTime}
              onChange={setEndTime as any}
              hideTimeZone
            />
          </div>

          <p className="text-xs my-2 opacity-50 mt-3">
            Test will be open from{" "}
            {testOpenRange.start?.toDate("GMT")?.toDateString()},{" "}
            {startTime.hour % 12 || 12}:
            {startTime.minute.toString().padStart(2, "0")}{" "}
            {startTime.hour < 12 ? "AM" : "PM"} to{" "}
            {testOpenRange.end?.toDate("GMT")?.toDateString()},{" "}
            {endTime.hour % 12 || 12}:
            {endTime.minute.toString().padStart(2, "0")}{" "}
            {endTime.hour < 12 ? "AM" : "PM"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default General;
