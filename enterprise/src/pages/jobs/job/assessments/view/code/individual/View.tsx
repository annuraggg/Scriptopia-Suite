import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "@/config/axios";
import { ExtendedMCQAssessmentSubmission as EMAS } from "@shared-types/ExtendedMCQAssessmentSubmission";

// HeroUI components
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Alert } from "@heroui/alert";
import { Badge } from "@heroui/badge";
import { Progress } from "@heroui/progress";
import { Skeleton } from "@heroui/skeleton";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BarChart2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Share2,
  User,
  Shield,
} from "lucide-react";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";

const AssessmentReport = (): JSX.Element => {
  const [submission, setSubmission] = useState<EMAS | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSubmission = async (): Promise<void> => {
      try {
        const pathParts = window.location.pathname.split("/");
        const assessmentId = pathParts[5];
        const submissionId = pathParts[7];

        const axiosInstance = axios(getToken);
        const response = await axiosInstance.get(
          `/assessments/${assessmentId}/get-mcq-submissions/${submissionId}`
        );

        setSubmission(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch assessment submission");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [getToken]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!submission) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Alert
          description="            We couldn't find the submission data you're looking for. Please
            check the URL or try again later."
          title={`No Data Found`}
          color="danger"
        />
      </div>
    );
  }

  return <AssessmentReportContent submission={submission} />;
};

const LoadingSkeleton = (): JSX.Element => (
  <div className="max-w-7xl mx-auto p-6 space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardBody className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardBody className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
        </CardBody>
      </Card>
    </div>
  </div>
);

interface AssessmentReportContentProps {
  submission: EMAS;
}

const AssessmentReportContent = ({
  submission,
}: AssessmentReportContentProps): JSX.Element => {
  // Calculate statistics
  const totalQuestions = submission.assessmentId.sections.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );

  const obtainedScore = submission.obtainedGrades?.total || 0;
  const maxScore = submission.assessmentId.obtainableScore;
  const scorePercentage = Math.round((obtainedScore / maxScore) * 100);
  const isPassed = scorePercentage >= submission.assessmentId.passingPercentage;

  // Format time helper
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Prepare chart data
  const pieChartData = [
    { name: "Correct", value: obtainedScore },
    { name: "Incorrect", value: maxScore - obtainedScore },
  ];

  const CHART_COLORS = {
    pieChart: ["#10b981", "#f43f5e"],
    barChart: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  };

  const sectionPerformance = submission.assessmentId.sections.map(
    (section, index) => {
      const sectionQuestions = section.questions.map((q) => q._id);
      const sectionSubmissions = submission.obtainedGrades?.mcq?.filter((sub) =>
        sectionQuestions.includes(sub.mcqId)
      );

      const obtainedMarks =
        sectionSubmissions?.reduce((acc, sub) => acc + sub.obtainedMarks, 0) ||
        0;
      const totalMarks = section.questions.reduce(
        (acc, q) => acc + (q.grade || 0),
        0
      );

      return {
        name: section.name,
        score: Math.round((obtainedMarks / totalMarks) * 100),
        color: CHART_COLORS.barChart[index % CHART_COLORS.barChart.length],
      };
    }
  );

  // Calculate time efficiency percentage
  const timeAllocationPercentage = Math.min(
    Math.round(
      (submission.timer / (submission.assessmentId.timeLimit * 60)) * 100
    ),
    100
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with status badge */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <h3 className="text-2xl font-bold">
              {submission.assessmentId.name}
            </h3>
            <p className="mt-1">{submission.assessmentId.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={`px-3 py-1 text-sm ${
                isPassed
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                  : "bg-rose-100 text-rose-800 hover:bg-rose-100"
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="mr-1 h-4 w-4" />
              ) : (
                <XCircle className="mr-1 h-4 w-4" />
              )}
              {isPassed ? "PASSED" : "FAILED"}
            </Badge>
            <div className="text-3xl font-bold">{scorePercentage}%</div>
            <div className="text-sm text-muted-foreground">
              Passing threshold: {submission.assessmentId.passingPercentage}%
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Candidate & Assessment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Candidate Information
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{submission.name}</span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{submission.email}</span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="faded" className="capitalize">
                {submission.status}
              </Badge>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-medium">
                {submission.updatedAt
                  ? new Date(submission.updatedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            {submission.cheatingStatus && (
              <>
                <Divider />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Integrity Analysis
                  </span>
                  <Badge
                    className={
                      submission.cheatingStatus === "No Copying"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                        : submission.cheatingStatus === "Light Copying"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-rose-100 text-rose-800 hover:bg-rose-100"
                    }
                  >
                    {submission.cheatingStatus}
                  </Badge>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Assessment Overview
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                <Clock className="inline mr-1 h-4 w-4" /> Time Spent
              </span>
              <span className="font-medium">
                {formatTime(submission.timer)}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Time Limit</span>
              <span className="font-medium">
                {formatTime(submission.assessmentId.timeLimit * 60)}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Score</span>
              <span className="font-medium">
                {obtainedScore} / {maxScore} points
              </span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Author</span>
              <span className="font-medium">
                {submission.assessmentId.author}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Score Distribution
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          CHART_COLORS.pieChart[
                            index % CHART_COLORS.pieChart.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} points`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Section Performance
            </h3>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectionPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                    tickLine={false}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {sectionPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Security Monitoring */}
      {submission.offenses && (
        <Card>
          <CardHeader>
            <h3 className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security Monitoring
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {submission.offenses.tabChange !== undefined && (
                <Card>
                  <CardBody className="pt-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Tab Changes
                      </span>
                      <span className="text-3xl font-semibold mt-1">
                        {submission.offenses.tabChange}
                      </span>
                      {submission.offenses.tabChange > 3 && (
                        <Badge
                          variant="faded"
                          className="mt-2 w-fit bg-amber-50 text-amber-800 border-amber-200"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Above average
                        </Badge>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}
              {submission.offenses.copyPaste !== undefined && (
                <Card>
                  <CardBody className="pt-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Copy/Paste Attempts
                      </span>
                      <span className="text-3xl font-semibold mt-1">
                        {submission.offenses.copyPaste}
                      </span>
                      {submission.offenses.copyPaste > 0 && (
                        <Badge
                          variant="faded"
                          className="mt-2 w-fit bg-amber-50 text-amber-800 border-amber-200"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Detected
                        </Badge>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
            {submission.sessionRewindUrl && (
              <div className="mt-4">
                <Button variant="faded" className="gap-2">
                  <a
                    href={submission.sessionRewindUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Session Playback
                  </a>
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Section Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Section Breakdown
          </h3>
        </CardHeader>
        <CardBody className="space-y-6">
          {submission.assessmentId.sections.map((section, sectionIndex) => {
            // Calculate section stats
            const sectionQuestions = section.questions.map((q) => q._id);
            const sectionSubmissions = submission.obtainedGrades?.mcq?.filter(
              (sub) => sectionQuestions.includes(sub.mcqId)
            );

            const obtainedMarks =
              sectionSubmissions?.reduce(
                (acc, sub) => acc + sub.obtainedMarks,
                0
              ) || 0;
            const totalMarks = section.questions.reduce(
              (acc, q) => acc + (q.grade || 0),
              0
            );
            const percentageScore = Math.round(
              (obtainedMarks / totalMarks) * 100
            );

            // Determine color based on score
            const getProgressColor = (score: number): string => {
              if (score >= submission.assessmentId.passingPercentage + 10)
                return "success";
              if (score >= submission.assessmentId.passingPercentage)
                return "warning";
              if (score >= submission.assessmentId.passingPercentage - 10)
                return "danger";
              return "danger";
            };

            return (
              <div
                key={section._id || sectionIndex}
                className={sectionIndex > 0 ? "pt-4 border-t" : ""}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-base">{section.name}</h3>
                  <div className="text-right">
                    <span className="font-semibold">
                      {obtainedMarks}/{totalMarks}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({percentageScore}%)
                    </span>
                  </div>
                </div>
                <Progress
                  value={percentageScore}
                  className="h-2"
                  color={
                    getProgressColor(percentageScore) as
                      | "success"
                      | "warning"
                      | "danger"
                  }
                />
                <div className="mt-2 text-sm text-muted-foreground flex justify-between">
                  <span>
                    {section.questions.length} question
                    {section.questions.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {percentageScore >=
                    submission.assessmentId.passingPercentage ? (
                      <span className="text-emerald-600 font-medium flex items-center">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Passed
                      </span>
                    ) : (
                      <span className="text-rose-600 font-medium flex items-center">
                        <XCircle className="mr-1 h-3 w-3" />
                        Below threshold
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* Time Management */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Time Management
          </h3>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Time spent: {formatTime(submission.timer)}
              </span>
              <span className="text-sm font-medium">
                Time allocated:{" "}
                {formatTime(submission.assessmentId.timeLimit * 60)}
              </span>
            </div>
            <Progress
              value={timeAllocationPercentage}
              className="h-2"
              color={
                timeAllocationPercentage < 50
                  ? "success"
                  : timeAllocationPercentage < 80
                  ? "warning"
                  : "danger"
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {timeAllocationPercentage < 50
              ? "Completed significantly faster than the allocated time. This may indicate either strong proficiency or potentially rushed answers."
              : timeAllocationPercentage > 90
              ? "Used almost all available time, which may suggest the assessment was challenging for the candidate."
              : "Used time efficiently, suggesting good time management skills."}
          </p>
        </CardBody>
      </Card>

      {/* Analysis & Recommendations */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Analysis & Recommendations
          </h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Performance Summary</h3>
            <div
              className={`p-4 rounded-lg ${
                isPassed
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-rose-50 border border-rose-100"
              }`}
            >
              <p
                className={`${isPassed ? "text-emerald-700" : "text-rose-700"}`}
              >
                {isPassed
                  ? `Congratulations! The candidate has successfully passed the assessment with a score of ${scorePercentage}%, which is above the passing threshold of ${submission.assessmentId.passingPercentage}%.`
                  : `The candidate did not meet the passing threshold of ${submission.assessmentId.passingPercentage}% with a score of ${scorePercentage}%.`}
              </p>
            </div>
          </div>

          {sectionPerformance.length > 0 && (
            <div>
              <h3 className="font-medium text-lg mb-2">
                Strengths & Areas for Improvement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <Card className="border-emerald-100 bg-emerald-50">
                  <CardHeader className="pb-2">
                    <h3 className="text-sm text-emerald-700">Strengths</h3>
                  </CardHeader>
                  <CardBody>
                    {sectionPerformance
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 2)
                      .map((section, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-emerald-700">
                            {section.name} ({section.score}%)
                          </span>
                        </div>
                      ))}
                  </CardBody>
                </Card>

                {/* Areas for Improvement */}
                <Card className="border-amber-100 bg-amber-50">
                  <CardHeader className="pb-2">
                    <h3 className="text-sm text-amber-700">
                      Areas for Improvement
                    </h3>
                  </CardHeader>
                  <CardBody>
                    {sectionPerformance
                      .sort((a, b) => a.score - b.score)
                      .slice(0, 2)
                      .filter((section) => section.score < 80)
                      .map((section, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                          <span className="text-amber-700">
                            {section.name} ({section.score}%)
                          </span>
                        </div>
                      ))}
                    {sectionPerformance.filter((s) => s.score < 80).length ===
                      0 && (
                      <p className="text-amber-700">
                        No significant improvement areas identified.
                      </p>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {submission.cheatingStatus && (
            <div>
              <h3 className="font-medium text-lg mb-2">Integrity Analysis</h3>
              <Card
                className={`
                ${
                  submission.cheatingStatus === "No Copying"
                    ? "border-emerald-100 bg-emerald-50"
                    : submission.cheatingStatus === "Light Copying"
                    ? "border-amber-100 bg-amber-50"
                    : "border-rose-100 bg-rose-50"
                }
              `}
              >
                <CardBody className="pt-6">
                  <p
                    className={`
                    ${
                      submission.cheatingStatus === "No Copying"
                        ? "text-emerald-700"
                        : submission.cheatingStatus === "Light Copying"
                        ? "text-amber-700"
                        : "text-rose-700"
                    }
                  `}
                  >
                    {submission.cheatingStatus === "No Copying"
                      ? "No integrity issues were detected during this assessment. The candidate demonstrated proper conduct throughout the session."
                      : submission.cheatingStatus === "Light Copying"
                      ? "Minor integrity concerns were flagged during the assessment. We recommend a follow-up discussion to clarify expectations."
                      : "Significant integrity issues were detected. A thorough review and follow-up discussion is strongly recommended."}
                  </p>
                </CardBody>
              </Card>
            </div>
          )}
        </CardBody>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            <p>
              Generated on: {new Date().toLocaleString()} • Assessment ID:{" "}
              {submission.assessmentId._id}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentReport;
