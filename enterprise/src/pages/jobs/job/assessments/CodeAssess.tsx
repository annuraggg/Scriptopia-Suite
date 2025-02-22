import { motion } from "framer-motion";
import { Button, Card } from "@heroui/react";
import {
  Eye,
  Link,
  Clock,
  Code2,
  BarChart2,
  Terminal,
  PieChart,
  LineChart,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { CodeAssessment } from "@shared-types/CodeAssessment";
import { Posting } from "@shared-types/Posting";

const copyLink = (assessmentId: string) => {
  navigator.clipboard.writeText(
    `${import.meta.env.VITE_CODE_URL}/assessments/c/${assessmentId}`
  );
  toast.success("Link copied to clipboard");
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    return (
      <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium">Active</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
      <div className="w-2 h-2 rounded-full bg-amber-500" />
      <span className="font-medium">Inactive</span>
    </div>
  );
};

interface CodeAssessProps {
  createdAssessments: CodeAssessment[];
}

const CodeAssess = ({ createdAssessments }: CodeAssessProps) => {
  const navigate = useNavigate();
  const { posting } = useOutletContext() as { posting: Posting };

  const calculateStatus = (createdAssessment: CodeAssessment) => {
    const currentStep = posting?.workflow?.steps?.findIndex(
      (step) => step.status === "in-progress"
    );

    if (
      currentStep === undefined ||
      !posting?.workflow?.steps ||
      !posting?.workflow?.steps[currentStep]
    )
      return "Inactive";

    const currentStepId = posting?.workflow?.steps[currentStep]._id;
    return currentStepId?.toString() === createdAssessment?._id?.toString()
      ? "Active"
      : "Inactive";
  };

  // Rotate through chart icons for variety
  const getChartIcon = (index: number) => {
    const icons = [Terminal, BarChart2, PieChart, LineChart];
    const Icon = icons[index % icons.length];
    return <Icon className="w-6 h-6" />;
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-6 lg:p-10 min-h-[89vh]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Code Assessments
            </h2>
            <p className="text-gray-600">
              Manage your {createdAssessments.length} coding challenges
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {createdAssessments.map((assessment, index) => {
            const isActive = calculateStatus(assessment) === "Active";
            const staggerDelay = index * 0.1;

            return (
              <motion.div
                key={assessment._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: staggerDelay }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className="flex-grow p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-lg ${
                              isActive ? "text-emerald-500" : "text-amber-500"
                            }`}
                          >
                            {getChartIcon(index)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                              {assessment.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {assessment.description}
                            </p>
                          </div>
                        </div>
                        <StatusBadge isActive={isActive} />
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {assessment.timeLimit} minutes
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Code2 className="w-4 h-4" />
                          <span className="text-sm">
                            {assessment.problems?.length || 0} problems
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Terminal className="w-4 h-4" />
                          <span className="text-sm">
                            {assessment.languages.length} languages
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {assessment.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3 p-6 lg:border-l border-gray-200">
                      <Button
                        onPress={() => navigate(`${assessment._id}/view`)}
                        color="success"
                        variant="flat"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>

                      <Button
                        onPress={() => copyLink(assessment._id ?? "")}
                        variant="flat"
                        className="bg-blue-300 bg-opacity-50 text-blue-900"
                      >
                        <Link className="w-4 h-4" />
                        <span>Share</span>
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

export default CodeAssess;
