import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Clock, Award, User, CheckCircle } from "lucide-react";

// Import types
import { MCQAssessment } from "@shared-types/MCQAssessment";
import { MCQAssessmentSubmission } from "@shared-types/MCQAssessmentSubmission";

interface AnalyticsProps {
  submissions: MCQAssessmentSubmission[];
  assessment: MCQAssessment;
}

const calculateAnalytics = (
  submissions: MCQAssessmentSubmission[],
  assessment: MCQAssessment
) => {
  const completedSubmissions = submissions.filter(
    (s) => s.status === "completed"
  );

  // Performance stats
  const averageScore =
    completedSubmissions.reduce(
      (acc, curr) => acc + (curr.obtainedGrades?.total || 0),
      0
    ) / (completedSubmissions.length || 1);

  const passThreshold =
    (assessment.obtainableScore * assessment.passingPercentage) / 100;
  const passCount = completedSubmissions.filter(
    (s) => (s.obtainedGrades?.total || 0) >= passThreshold
  ).length;
  const failCount = completedSubmissions.length - passCount;
  const passRate = (passCount / (completedSubmissions.length || 1)) * 100;

  // Time stats
  const averageTime =
    completedSubmissions.reduce((acc, curr) => acc + curr.timer, 0) /
    (completedSubmissions.length || 1);

  // Question performance
  const questionPerformance = assessment.sections.flatMap((section) =>
    section.questions.map((question) => {
      const attempts = completedSubmissions.filter((s) =>
        s.mcqSubmissions?.some((mcq) => mcq.mcqId === question._id)
      ).length;

      const correctCount = completedSubmissions.filter((s) =>
        s.obtainedGrades?.mcq?.some(
          (mcq) => mcq.mcqId === question._id && mcq.obtainedMarks > 0
        )
      ).length;

      const successRate = (correctCount / (attempts || 1)) * 100;

      return {
        id: question._id,
        question:
          question.question.length > 30
            ? question.question.substring(0, 30) + "..."
            : question.question,
        fullQuestion: question.question,
        section: section.name,
        type: question.type,
        successRate,
        attempts,
      };
    })
  );

  // Score distribution
  const scoreDistribution = [
    {
      range: "0-20%",
      count: completedSubmissions.filter(
        (s) =>
          (s.obtainedGrades?.total || 0) <= assessment.obtainableScore * 0.2
      ).length,
    },
    {
      range: "21-40%",
      count: completedSubmissions.filter(
        (s) =>
          (s.obtainedGrades?.total || 0) > assessment.obtainableScore * 0.2 &&
          (s.obtainedGrades?.total || 0) <= assessment.obtainableScore * 0.4
      ).length,
    },
    {
      range: "41-60%",
      count: completedSubmissions.filter(
        (s) =>
          (s.obtainedGrades?.total || 0) > assessment.obtainableScore * 0.4 &&
          (s.obtainedGrades?.total || 0) <= assessment.obtainableScore * 0.6
      ).length,
    },
    {
      range: "61-80%",
      count: completedSubmissions.filter(
        (s) =>
          (s.obtainedGrades?.total || 0) > assessment.obtainableScore * 0.6 &&
          (s.obtainedGrades?.total || 0) <= assessment.obtainableScore * 0.8
      ).length,
    },
    {
      range: "81-100%",
      count: completedSubmissions.filter(
        (s) => (s.obtainedGrades?.total || 0) > assessment.obtainableScore * 0.8
      ).length,
    },
  ];

  // Section performance
  const sectionPerformance = assessment.sections.map((section) => {
    const sectionQuestions = section.questions;
    const maxScore = sectionQuestions.reduce(
      (acc, q) => acc + (q.grade || 0),
      0
    );

    const averageSectionScore =
      completedSubmissions.reduce((acc, sub) => {
        const sectionScore = sectionQuestions.reduce((qAcc, q) => {
          const questionScore =
            sub.obtainedGrades?.mcq?.find((mcq) => mcq.mcqId === q._id)
              ?.obtainedMarks || 0;
          return qAcc + questionScore;
        }, 0);

        return acc + sectionScore;
      }, 0) / (completedSubmissions.length || 1);

    const sectionSuccessRate = (averageSectionScore / (maxScore || 1)) * 100;

    return {
      name: section.name,
      avgScore: averageSectionScore,
      maxScore,
      successRate: sectionSuccessRate,
    };
  });

  // Cheating analysis
  const cheatingDistribution = [
    {
      status: "No Copying",
      count: completedSubmissions.filter(
        (s) => s.cheatingStatus === "No Copying"
      ).length,
    },
    {
      status: "Light Copying",
      count: completedSubmissions.filter(
        (s) => s.cheatingStatus === "Light Copying"
      ).length,
    },
    {
      status: "Heavy Copying",
      count: completedSubmissions.filter(
        (s) => s.cheatingStatus === "Heavy Copying"
      ).length,
    },
  ];

  // Time distribution
  const timeDistribution = [
    {
      range: "< 50%",
      count: completedSubmissions.filter(
        (s) => s.timer < assessment.timeLimit * 0.5
      ).length,
    },
    {
      range: "50-75%",
      count: completedSubmissions.filter(
        (s) =>
          s.timer >= assessment.timeLimit * 0.5 &&
          s.timer < assessment.timeLimit * 0.75
      ).length,
    },
    {
      range: "75-90%",
      count: completedSubmissions.filter(
        (s) =>
          s.timer >= assessment.timeLimit * 0.75 &&
          s.timer < assessment.timeLimit * 0.9
      ).length,
    },
    {
      range: "90-100%",
      count: completedSubmissions.filter(
        (s) =>
          s.timer >= assessment.timeLimit * 0.9 &&
          s.timer <= assessment.timeLimit
      ).length,
    },
  ];

  // Daily submissions trend
  const submissionDates = completedSubmissions.map(
    (s) => new Date(s.createdAt!)?.toISOString().split("T")[0]
  );
  const uniqueDates = [...new Set(submissionDates)].sort();

  const submissionTrend = uniqueDates.map((date) => {
    return {
      date,
      count: completedSubmissions.filter(
        (s) => new Date(s.createdAt!)?.toISOString().split("T")[0] === date
      ).length,
    };
  });

  return {
    totalSubmissions: submissions.length,
    completedSubmissions: completedSubmissions.length,
    inProgressSubmissions: submissions.filter((s) => s.status === "in-progress")
      .length,
    averageScore,
    passRate,
    passCount,
    failCount,
    averageTime,
    questionPerformance,
    scoreDistribution,
    sectionPerformance,
    cheatingDistribution,
    timeDistribution,
    submissionTrend,
  };
};

const Analytics = ({ assessment, submissions }: AnalyticsProps) => {
  const analyticsData = calculateAnalytics(submissions, assessment);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex flex-row items-center">
            <div className="mr-4 bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Candidates</p>
              <p className="text-2xl font-bold">
                {analyticsData.totalSubmissions}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center">
            <div className="mr-4 bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">
                {analyticsData.completedSubmissions}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center">
            <div className="mr-4 bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Completion Time</p>
              <p className="text-2xl font-bold">
                {formatTime(analyticsData.averageTime)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center">
            <div className="mr-4 bg-amber-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-2xl font-bold">
                {analyticsData.passRate.toFixed(1)}%
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Score Distribution</h4>
            <p className="text-sm text-gray-500">
              Percentage of total score achieved
            </p>
          </CardHeader>
          <CardBody className="overflow-hidden h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.scoreDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" name="Candidates" fill="#0088FE">
                  {analyticsData.scoreDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Time Utilization</h4>
            <p className="text-sm text-gray-500">
              Time used as percentage of limit
            </p>
          </CardHeader>
          <CardBody className="overflow-hidden h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.timeDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" name="Candidates" fill="#00C49F">
                  {analyticsData.timeDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[(index + 2) % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Section Performance</h4>
            <p className="text-sm text-gray-500">Average scores by section</p>
          </CardHeader>
          <CardBody className="overflow-hidden h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.sectionPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <RechartsTooltip
                  formatter={(value) => [`${value}%`, "Success Rate"]}
                />
                <Legend />
                <Bar
                  dataKey="successRate"
                  name="Success Rate %"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Cheating Detection</h4>
            <p className="text-sm text-gray-500">
              Distribution of detected behaviors
            </p>
          </CardHeader>
          <CardBody className="overflow-hidden h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.cheatingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analyticsData.cheatingDistribution.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#4CAF50"
                          : index === 1
                          ? "#FFC107"
                          : "#F44336"
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Question Performance</h4>
            <p className="text-sm text-gray-500">Success rate by question</p>
          </CardHeader>
          <CardBody className="overflow-hidden">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.questionPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="question"
                    angle={-45}
                    fontSize={12}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip
                    formatter={(value, _name, props) => {
                      const { payload } = props;
                      return [
                        `${value}%`,
                        <>
                          {payload.fullQuestion}
                          <br />
                          Section: {payload.section}
                          <br />
                          Type: {payload.type}
                        </>,
                      ];
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-bold">{data.fullQuestion}</p>
                            <p className="text-sm">Section: {data.section}</p>
                            <p className="text-sm">Type: {data.type}</p>
                            <p className="text-sm font-bold text-blue-600">
                              Success Rate: {data.successRate.toFixed(1)}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="successRate" name="Success Rate" fill="#0088FE">
                    {analyticsData.questionPerformance.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.successRate > 70
                            ? "#4CAF50"
                            : entry.successRate > 40
                            ? "#FFC107"
                            : "#F44336"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Pass/Fail Distribution</h4>
            <p className="text-sm text-gray-500">
              Based on passing threshold of {assessment.passingPercentage}%
            </p>
          </CardHeader>
          <CardBody className="overflow-hidden h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Pass", value: analyticsData.passCount },
                    { name: "Fail", value: analyticsData.failCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  <Cell fill="#4CAF50" />
                  <Cell fill="#F44336" />
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0 pt-4 px-6 flex-col items-start">
            <h4 className="font-bold text-large">Submission Trend</h4>
            <p className="text-sm text-gray-500">Submissions over time</p>
          </CardHeader>
          <CardBody className="overflow-hidden h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.submissionTrend}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <RechartsTooltip
                  formatter={(value) => [value, "Submissions"]}
                  labelFormatter={formatDate}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Analytics;
