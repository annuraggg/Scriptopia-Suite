import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { Eye, Link, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IAssessment from "@/@types/Assessment";
import { toast } from "sonner";

const calculateStatus = (createdAssessment: IAssessment) => {
  const startDate = new Date(createdAssessment.openRange.start);
  const endDate = new Date(createdAssessment.openRange.end);
  const currentDate = new Date();

  if (currentDate < startDate) return "Upcoming";
  if (currentDate > endDate) return "Expired";
  return "Active";
};

const copyLink = (assessmentId: string) => {
  navigator.clipboard.writeText(
    `${window.location.origin}/assessments/${assessmentId}`
  );
  console.log("Link copied to clipboard");
  toast.success("Link copied to clipboard");
};

const MCQAssess = ({
  createdAssessments,
}: {
  createdAssessments: IAssessment[];
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-10 h-[90vh]"
    >
      <div className="">
        <div>
          <Input placeholder="Search MCQ Assessments" />
        </div>
        <div>
          <Button
            className="mt-5"
            variant="flat"
            onClick={() => navigate("/assessments/new/mcq")}
          >
            + Create MCQ Assessment
          </Button>
        </div>
        <div className="mt-5 flex gap-5 flex-wrap">
          {createdAssessments.map((CreatedAssessment) => (
            <Card className="w-[32%]">
              <CardHeader>{CreatedAssessment.name}</CardHeader>
              <CardBody>
                {" "}
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={`${
                      calculateStatus(CreatedAssessment) === "Active"
                        ? "text-green-500"
                        : calculateStatus(CreatedAssessment) === "Upcoming"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {calculateStatus(CreatedAssessment)}
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Date: </span>
                  <span className="text-xs text-white-200">
                    {new Date(CreatedAssessment.createdAt).toLocaleString()}
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Duration: </span>
                  <span className="text-xs text-white-200">
                    {CreatedAssessment.timeLimit} minutes
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">MCQs: </span>
                  <span className="text-xs text-white-200">
                    {CreatedAssessment.mcqs.length}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-2">Time Range:</p>
                <p className="text-xs text-white-200">
                  {new Date(CreatedAssessment.openRange.start).toLocaleString()}{" "}
                  <span className="text-xs text-gray-500 mt-2">to </span>
                  {new Date(CreatedAssessment.openRange.end).toLocaleString()}
                </p>
              </CardBody>
              <CardFooter className="gap-2 flex-wrap">
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3"
                  variant="flat"
                  onClick={() => navigate(`/assessments/${CreatedAssessment._id}/view`)}
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
                  onClick={() => copyLink(CreatedAssessment._id)}
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

export default MCQAssess;
