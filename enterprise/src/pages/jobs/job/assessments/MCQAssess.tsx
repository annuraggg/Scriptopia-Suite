import { motion } from "framer-motion";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Eye, Link, BarChart2, PieChart, LineChart } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { MCQAssessment } from "@shared-types/MCQAssessment";
import { ExtendedPosting as Posting } from "@shared-types/ExtendedPosting";

interface ExtendedPosting extends Omit<Posting, "mcqAssessments"> {
  mcqAssessments: {
    _id: string;
    assessmentId: MCQAssessment;
    workflowId: string;
  }[];
}

const copyLink = (assessmentId: string) => {
  navigator.clipboard.writeText(
    `${import.meta.env.VITE_CODE_URL}/assessments/m/${assessmentId}`
  );
  toast.success("Link copied to clipboard");
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
      ${
        isActive
          ? "bg-green-500/10 text-green-500 border border-green-500/20"
          : "bg-red-500/10 text-red-500 border border-red-500/20"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
      />
      <span>{isActive ? "Active" : "Inactive"}</span>
    </div>
  );
};

const MCQAssess = ({
  createdAssessments: initialCreatedAssessments,
}: {
  createdAssessments: MCQAssessment[];
}) => {
  const navigate = useNavigate();
  const { posting } = useOutletContext() as { posting: ExtendedPosting };

  const totalQuestions = (assessment: MCQAssessment) => {
    return assessment.sections.reduce(
      (acc, section) => acc + section.questions.length,
      0
    );
  };

  const getChartIcon = (index: number) => {
    const icons = [BarChart2, PieChart, LineChart];
    const Icon = icons[index % icons.length];
    return <Icon size={40} />;
  };

  const getIsActive = (assessment: MCQAssessment) => {
    const currentStep =
      posting.workflow?.steps?.findIndex(
        (step) => step.status === "in-progress"
      ) ?? 0;

    const currentStepId = posting?.workflow?.steps[currentStep]?._id;
    const postingAssessment = posting?.mcqAssessments?.find(
      (a) => a.workflowId.toString() === currentStepId?.toString()
    );

    return (
      postingAssessment?.assessmentId?._id?.toString() ===
      assessment?._id?.toString()
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-6 min-h-[89vh] bg-default-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground">
            MCQ Assessments
          </h2>
          <p className="text-default-600 mt-1">
            Manage your collection of {initialCreatedAssessments.length}{" "}
            assessments
          </p>
        </div>

        <div className="grid gap-4">
          {initialCreatedAssessments.map((assessment, index) => {
            const isActive = getIsActive(assessment);
            if (!assessment) return null;

            return (
              <motion.div
                key={assessment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="w-full">
                  <div className="flex items-center p-6">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-primary/5 ${
                              isActive ? "text-primary" : "text-default-600"
                            }`}
                          >
                            {getChartIcon(index)}
                          </div>
                          <div>
                            <div className="flex gap-5 items-center">
                              <h3 className="text-lg font-medium text-foreground">
                                {assessment.name}
                              </h3>
                              <StatusBadge isActive={isActive} />
                            </div>
                            <div className="flex gap-3 mt-2 items-center">
                              <div className="flex items-center gap-2 text-default-600">
                                <span className="text-sm">
                                  {assessment.timeLimit} minutes
                                </span>
                              </div>
                              <span className=" text-default-600">|</span>
                              <div className="flex items-center gap-2 text-default-600">
                                <span className="text-sm">
                                  {totalQuestions(assessment)} questions
                                </span>
                              </div>
                              <span className=" text-default-600">|</span>
                              <div className="flex items-center gap-2 text-default-600">
                                <span className="text-sm">
                                  {assessment.passingPercentage}% passing score
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-default-600 mt-1 max-w-2xl">
                        {assessment.description}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center flex-col">
                      {posting?.workflow?.steps?.find(
                        (step) =>
                          step._id ===
                          posting?.mcqAssessments?.find(
                            (a) => a.assessmentId?._id === assessment._id
                          )?.workflowId
                      )?.status !== "pending" && (
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={() => navigate(`m/${assessment._id}/view`)}
                          startContent={<Eye className="w-4 h-4" />}
                        >
                          View
                        </Button>
                      )}
                      <Button
                        color="secondary"
                        variant="flat"
                        onPress={() => copyLink(assessment._id ?? "")}
                        startContent={<Link className="w-4 h-4" />}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MCQAssess;
