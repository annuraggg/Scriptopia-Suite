import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import { Eye, Link } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Assessment } from "@shared-types/Assessment";
import { toast } from "sonner";
import { Posting } from "@shared-types/Posting";

const copyLink = (assessmentId: string) => {
  navigator.clipboard.writeText(
    `${import.meta.env.VITE_SCRIPTOPIA_URL}/assessments/${assessmentId}`
  );
  toast.success("Link copied to clipboard");
};

const CodeAssess = ({
  createdAssessments: initialCreatedAssessments,
}: {
  createdAssessments: Assessment[];
}) => {
  const navigate = useNavigate();
  const { posting } = useOutletContext() as { posting: Posting };

  const calculateStatus = (createdAssessment: Assessment) => {
    const currentStep = posting.workflow?.currentStep || 0;
    if (!posting?.workflow?.steps || !posting?.workflow?.steps[currentStep])
      return "Inactive";

    const currentStepId = posting?.workflow?.steps[currentStep].stepId;
    if (currentStepId?.toString() !== createdAssessment._id.toString()) {
      return "Inactive";
    }

    return "Active";
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-10 h-[90vh]"
    >
      <div>
        <div className="mt-5 flex gap-5 flex-wrap">
          {initialCreatedAssessments.map((CreatedAssessment) => (
            <Card key={CreatedAssessment._id} className="w-[32%]">
              <CardHeader>{CreatedAssessment.name}</CardHeader>
              <CardBody>
                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={`${
                      calculateStatus(CreatedAssessment) === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {calculateStatus(CreatedAssessment)}
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Duration: </span>
                  <span className="text-xs text-white-200">
                    {CreatedAssessment.timeLimit} minutes
                  </span>
                </p>
                <p>
                  <span className="text-xs text-gray-500">Codes: </span>
                  <span className="text-xs text-white-200">
                    {CreatedAssessment.problems.length}
                  </span>
                </p>
              </CardBody>
              <CardFooter className="gap-2 flex-wrap">
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3"
                  variant="flat"
                  onClick={() => navigate(`${CreatedAssessment._id}/view`)}
                >
                  <Eye size={18} /> <p>View</p>
                </Button>
                <Button
                  className="w-[48%] flex items-center justify-center text-xs gap-3"
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

export default CodeAssess;
