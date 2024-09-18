import {
  Input,
  RangeCalendar,
  Textarea,
  TimeInput,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, Link, Trash2 } from "lucide-react";

interface AssignmentDetails {
  name: string;
  description: string;
  openRange: {
    start: CalendarDate;
    end: CalendarDate;
  };
  fromTime: string;
  toTime: string;
}

const Assignments = () => {
  const [page, setPage] = useState(0);
  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);

  const handleCreateAssignment = () => {
    const timeZone = getLocalTimeZone(); // Get the local time zone

    const assignmentDetails: AssignmentDetails = {
      name: "Sample Assignment", // Replace with actual form data
      description: "This is a sample description.",
      openRange: {
        start: today(timeZone), // Use timeZone argument
        end: today(timeZone),   // Use timeZone argument
      },
      fromTime: "09:00",
      toTime: "17:00",
    };

    setAssignment(assignmentDetails);
    setPage(1);
  };

  return (
    <div className="flex gap-10 h-full p-14">
      {page === 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col justify-start h-full"
          >
            <Input label="Assignment Name" />
            <Textarea
              className="mt-5"
              minRows={10}
              label="Assignment Description"
            />
            <div className="flex gap-5 mt-10">
              {/* Additional inputs if needed */}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p className="text-sm">Assignment Open Range</p>
            <RangeCalendar
              aria-label="Open Range"
              className="mt-2"
              minValue={today(getLocalTimeZone())}
            />
            <TimeInput
              label="From Time"
              className="mt-3"
              size="sm"
            />
            <TimeInput
              label="To Time"
              className="mt-3"
              size="sm"
            />
          </motion.div>
          <Button
            color="success"
            className="absolute bottom-14 right-14 px-6 py-3"
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </Button>
        </>
      )}
      {page === 1 && assignment && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full p-10 h-[90vh]"
        >
          <div>
            <div>
              <Input placeholder="Search MCQ Assessments" />
            </div>
            <div>
              <Button className="mt-5" variant="flat" onClick={() => setPage(0)}>
                + Create Assignment
              </Button>
            </div>
            <div className="mt-5 flex gap-5 flex-wrap">
              <Card className="w-[32%]">
                <CardHeader>{assignment.name}</CardHeader>
                <CardBody>
                  <p className="text-xs text-gray-500">
                    Status:{" "}
                    <span
                      className={`${
                        "text-green-500" // Replace with actual status logic
                      }`}
                    >
                      Active
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-gray-500">Date: </span>
                    <span className="text-xs text-white-200">
                      {new Date().toLocaleString()} {/* Replace with actual date */}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Time Range:</p>
                  <p className="text-xs text-white-200">
                    {assignment.openRange.start.toDate(getLocalTimeZone()).toLocaleString()}{" "}
                    <span className="text-xs text-gray-500 mt-2">to </span>
                    {assignment.openRange.end.toDate(getLocalTimeZone()).toLocaleString()}
                  </p>
                </CardBody>
                <CardFooter className="gap-2 flex-wrap">
                  <Button
                    className="w-[48%] flex items-center justify-center text-xs gap-3"
                    variant="flat"
                  >
                    <Eye size={18} /> <p>View</p>
                  </Button>
                  <Button
                    className="w-[48%] flex items-center justify-center text-xs gap-3 bg-red-900 bg-opacity-40"
                    variant="flat"
                  >
                    <Trash2 size={18} /> <p>Delete</p>
                  </Button>
                  <Button
                    className="flex items-center justify-center text-xs gap-3 w-full"
                    variant="flat"
                  >
                    <Link size={18} /> <p>Copy Link</p>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Assignments;
