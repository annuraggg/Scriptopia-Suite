// @ts-nocheck
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Chip,
  Progress,
  Button,
} from "@heroui/react";
import { Clock, Award, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Assessment } from "@shared-types/Assessment";

interface TakenAssessment extends Assessment {
  submissionDetails: {
    score: number;
    maxScore: number;
    status: "completed" | "failed" | "passed";
    timeSpent: number;
    submittedAt: string;
  };
}

const AssessmentsTaken = ({
  takenAssessments,
}: {
  takenAssessments: TakenAssessment[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssessments = takenAssessments.filter((assessment) =>
    assessment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusChip = (status: string) => {
    const statusConfig = {
      passed: { color: "success", icon: CheckCircle },
      failed: { color: "danger", icon: XCircle },
      completed: { color: "primary", icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Chip
        startContent={<Icon size={14} />}
        color={config.color as any}
        variant="flat"
        size="sm"
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Chip>
    );
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full px-10 py-3 h-[90vh] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search Taken assessments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card
              key={assessment._id}
              className="border border-default-200 hover:border-primary transition-all duration-200"
            >
              <CardHeader className="flex flex-col items-start gap-2 px-6 pt-6">
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-lg font-semibold">{assessment.name}</h3>
                  {getStatusChip(assessment.submissionDetails.status)}
                </div>
                <p className="text-sm text-default-500">
                  {assessment.description}
                </p>
              </CardHeader>

              <CardBody className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Calendar size={16} />
                    <span>
                      Submitted:{" "}
                      {new Date(
                        assessment.submissionDetails.submittedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Clock size={16} />
                    <span>
                      Time spent: {assessment.submissionDetails.timeSpent}{" "}
                      minutes
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-default-500">
                    <Award size={16} />
                    <span>
                      Score: {assessment.submissionDetails.score}/
                      {assessment.submissionDetails.maxScore}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score Percentage</span>
                      <span>
                        {(
                          (assessment.submissionDetails.score /
                            assessment.submissionDetails.maxScore) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (assessment.submissionDetails.score /
                          assessment.submissionDetails.maxScore) *
                        100
                      }
                      color={
                        assessment.submissionDetails.status === "passed"
                          ? "success"
                          : assessment.submissionDetails.status === "failed"
                          ? "danger"
                          : "primary"
                      }
                      className="h-2"
                    />
                  </div>

                  <Button
                    className="w-full"
                    color="primary"
                    variant="flat"
                    size="sm"
                    as="a"
                    href={`/assessments/${assessment._id}/review`}
                  >
                    View Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-default-500">No completed assessments found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssessmentsTaken;
