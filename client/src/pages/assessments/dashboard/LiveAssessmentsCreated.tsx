import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { Eye, Link, Pencil, Trash2 } from "lucide-react";
import IAssessment from "@/@types/Assessment";

interface Assessment extends IAssessment {
  status: string;
  particpants: number;
}

const LiveAssessmentsCreated = ({
  liveAssessments,
}: {
  liveAssessments: Assessment[];
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-10 h-[90vh]"
    >
      <div className="">
        <div>
          <Input placeholder="Search Assessments" />
        </div>{" "}
        <div>
          <Button className="mt-5" variant="flat">
            + Create Live Assessment
          </Button>
        </div>
        <div className="mt-5 flex gap-5 flex-wrap">
          {liveAssessments.map((LiveAssessment) => (
            <Card className="w-[32%]">
              <CardHeader>{LiveAssessment.name}</CardHeader>
              <CardBody>
                {" "}
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={`${
                      LiveAssessment.status === "Live"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {LiveAssessment.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Date: {LiveAssessment.createdAt.toDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Duration: {LiveAssessment.timeLimit} minutes
                </p>
                <p className="text-xs text-gray-500">
                  MCQs: {LiveAssessment.mcqs.length}, Codes:{" "}
                  {LiveAssessment.problems.length}
                </p>
                <p className="text-xs mt-5">
                  Participants: {LiveAssessment.particpants}
                </p>
              </CardBody>
              <CardFooter className="gap-2 flex-wrap">
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3"
                  variant="flat"
                >
                  <Pencil size={18} /> <p>Edit</p>
                </Button>
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3"
                  variant="flat"
                >
                  <Eye size={18} /> <p>View</p>
                </Button>
                <Button
                  className={`${
                    LiveAssessment.status === "Live" ? "w-[48%]" : "w-full"
                  } flex items-center justify-center text-xs gap-3 bg-red-900 bg-opacity-40`}
                  variant="flat"
                >
                  <Trash2 size={18} /> <p>Delete</p>
                </Button>
                <Button
                  className={`${
                    LiveAssessment.status === "Live" ? "flex" : "hidden"
                  } w-[48%] items-center justify-center text-xs gap-3`}
                  variant="flat"
                >
                  <Link size={18} /> <p>Copy Link</p>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveAssessmentsCreated;
