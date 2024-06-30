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
import { useNavigate } from "react-router-dom";

interface CreatedAssessment {
  name: string;
  date: string;
  status: string;
  participants: number;
  duration: number;
  mcqs: number;
  codes: number;
  totalMarks: number;
}

interface CreatedAssessmentListProps {
  createdAssessments: CreatedAssessment[];
}

const AssessmentsCreated = ({createdAssessments} : CreatedAssessmentListProps) => {
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
        <Input placeholder="Search Assessments" />
      </div>
      <div>
        <Button className="mt-5" variant="flat" onClick={() => navigate("/assessments/standard/new")}>
         + Create Assessment
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
                    CreatedAssessment.status === "Active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {CreatedAssessment.status}
                </span>
              </p>
              <p className="text-xs text-gray-500">Date: {CreatedAssessment.date}</p>
              <p className="text-xs text-gray-500">
                Duration: {CreatedAssessment.duration} minutes
              </p>
              <p className="text-xs text-gray-500">
                MCQs: {CreatedAssessment.mcqs}, Codes: {CreatedAssessment.codes}
              </p>
              <p className="text-xs mt-5">
                Participants: {CreatedAssessment.participants}
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
                className="w-[48%] flex items-center justify-center text-xs gap-3 bg-red-900 bg-opacity-40"
                variant="flat"
              >
                <Trash2 size={18} /> <p>Delete</p>
              </Button>
              <Button
                className="w-[48%] flex items-center justify-center text-xs gap-3"
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

export default AssessmentsCreated;
