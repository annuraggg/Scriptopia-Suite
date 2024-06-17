import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { Eye, Link, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const AssessmentsCreated = () => {
  const navigate = useNavigate();

  const assessments = [
    {
      name: "Assessment 1",
      date: "12/12/2021",
      status: "Active",
      participants: 10,
      duration: 60,
      mcqs: 10,
      codes: 5,
      totalMarks: 100,
    },

    {
      name: "Assessment 2",
      date: "12/12/2021",
      status: "Active",
      participants: 10,
      duration: 60,
      mcqs: 10,
      codes: 5,
      totalMarks: 100,
    },

    {
      name: "Assessment 3",
      date: "12/12/2021",
      status: "Expired",
      participants: 10,
      duration: 60,
      mcqs: 10,
      codes: 5,
      totalMarks: 100,
    },
  ];
  return (
    <div className="w-full p-10 h-[90vh]">
      <div>
        <Input placeholder="Search Assessments" />
      </div>
      <div>
        <Button className="mt-5" variant="flat" onClick={() => navigate("/assessments/standard/new")}>
         + Create Assessment
        </Button>
      </div>
      <div className="mt-5 flex gap-5 flex-wrap">
        {assessments.map((assessment) => (
          <Card className="w-[32%]">
            <CardHeader>{assessment.name}</CardHeader>
            <CardBody>
              {" "}
              <p className="text-xs text-gray-500">
                Status:{" "}
                <span
                  className={`${
                    assessment.status === "Active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {assessment.status}
                </span>
              </p>
              <p className="text-xs text-gray-500">Date: {assessment.date}</p>
              <p className="text-xs text-gray-500">
                Duration: {assessment.duration} minutes
              </p>
              <p className="text-xs text-gray-500">
                MCQs: {assessment.mcqs}, Codes: {assessment.codes}
              </p>
              <p className="text-xs mt-5">
                Participants: {assessment.participants}
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
  );
};

export default AssessmentsCreated;
