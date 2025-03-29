import { Card, CardHeader, CardBody } from "@heroui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { CodeAssessment } from "@shared-types/CodeAssessment";
import { CodeAssessmentSubmission } from "@shared-types/CodeAssessmentSubmission";

interface AnalyticsProp {
  assessment: CodeAssessment;
  submissions: CodeAssessmentSubmission[];
}

const Analytics = ({ assessment, submissions }: AnalyticsProp) => {
  // Calculate derived metrics
  const completedSubmissions = submissions.filter(
    (sub) => sub.status === "completed"
  );

  const completionRate =
    submissions.length > 0
      ? (completedSubmissions.length / submissions.length) * 100
      : 0;

  const averageScore =
    completedSubmissions.length > 0
      ? completedSubmissions.reduce(
          (sum, sub) => sum + (sub.obtainedGrades?.total || 0),
          0
        ) / completedSubmissions.length
      : 0;

  const passingSubmissions = completedSubmissions.filter(
    (sub) => (sub.obtainedGrades?.total || 0) >= assessment.passingPercentage
  );

  const passingRate =
    completedSubmissions.length > 0
      ? (passingSubmissions.length / completedSubmissions.length) * 100
      : 0;

  const averageCompletionTime =
    completedSubmissions.length > 0
      ? completedSubmissions.reduce(
          (sum, sub) => sum + (assessment.timeLimit * 60 - sub.timer || 0),
          0
        ) / completedSubmissions.length
      : 0;

  // Problem-specific metrics
  const problemIds = assessment.problems;
  const problemPerformance = problemIds.map((problemId) => {
    const scores = completedSubmissions.map(
      (sub) =>
        sub.obtainedGrades?.problem?.find((p) => p.problemId === problemId)
          ?.obtainedMarks || 0
    );

    const avgScore =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0;

    return {
      problemId,
      avgScore,
      maxPossibleScore: assessment.obtainableScore / problemIds.length, // Assuming equal distribution
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Language distribution data
  const languageDistribution = () => {
    const langCounts: { [key: string]: number } = {};

    completedSubmissions.forEach((sub) => {
      sub.submissions?.forEach((probSub) => {
        const lang = probSub.language;
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      });
    });

    return Object.entries(langCounts).map(([name, value]) => ({ name, value }));
  };

  // Cheating status distribution data
  const cheatingStatusDistribution = () => {
    const statusCounts: { [key: string]: number } = {
      "No Copying": 0,
      "Light Copying": 0,
      "Heavy Copying": 0,
      Unknown: 0,
    };

    completedSubmissions.forEach((sub) => {
      const status = sub.cheatingStatus || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Score distribution data
  const scoreDistribution = () => {
    const ranges = [
      { range: "0-20%", count: 0 },
      { range: "21-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ];

    completedSubmissions.forEach((sub) => {
      const score =
        ((sub.obtainedGrades?.total || 0) / assessment.obtainableScore) * 100;
      if (score <= 20) ranges[0].count++;
      else if (score <= 40) ranges[1].count++;
      else if (score <= 60) ranges[2].count++;
      else if (score <= 80) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  };

  // Time taken distribution
  const timeDistribution = () => {
    const totalTimeLimit = assessment.timeLimit;
    const ranges = [
      { range: `0-${Math.floor(totalTimeLimit * 0.25)}min`, count: 0 },
      {
        range: `${Math.floor(totalTimeLimit * 0.25)}-${Math.floor(
          totalTimeLimit * 0.5
        )}min`,
        count: 0,
      },
      {
        range: `${Math.floor(totalTimeLimit * 0.5)}-${Math.floor(
          totalTimeLimit * 0.75
        )}min`,
        count: 0,
      },
      {
        range: `${Math.floor(totalTimeLimit * 0.75)}-${totalTimeLimit}min`,
        count: 0,
      },
    ];

    completedSubmissions.forEach((sub) => {
      const timeTaken = assessment.timeLimit * 60 - sub.timer || 0;
      const finalLimit = assessment.timeLimit * 60;
      const percentage = timeTaken / finalLimit;
      console.log("Time Taken: ", timeTaken, "Percentage: ", percentage);
      console.log("Final Limit: ", finalLimit);


      if (percentage <= 0.25) ranges[0].count++;
      else if (percentage <= 0.5) ranges[1].count++;
      else if (percentage <= 0.75) ranges[2].count++;
      else ranges[3].count++;
    });

    return ranges;
  };

  // Offense metrics
  const tabChangeOffenses = completedSubmissions.reduce(
    (sum, sub) =>
      sum + (sub.offenses?.tabChange?.reduce((s, tc) => s + tc.times, 0) || 0),
    0
  );

  const copyPasteOffenses = completedSubmissions.reduce(
    (sum, sub) =>
      sum + (sub.offenses?.copyPaste?.reduce((s, cp) => s + cp.times, 0) || 0),
    0
  );

  const CHART_COLORS = {
    primary: "#4f46e5",
    secondary: "#06b6d4",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    purple: "#8b5cf6",
    pink: "#ec4899",
    accent1: "#6366f1",
    accent2: "#8b5cf6",
    accent3: "#d946ef",
    accent4: "#f43f5e",
  };

  const CHART_COLORS_ARRAY = Object.values(CHART_COLORS);

  return (
    <>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardHeader className="text-sm font-medium text-gray-500">
              Completion Rate
            </CardHeader>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">
              {completionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {completedSubmissions.length} of {submissions.length} candidates
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardHeader className="text-sm font-medium text-gray-500">
              Average Score
            </CardHeader>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">
              {averageScore.toFixed(1)}/{assessment.obtainableScore}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {((averageScore / assessment.obtainableScore) * 100).toFixed(1)}%
              average
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardHeader className="text-sm font-medium text-gray-500">
              Passing Rate
            </CardHeader>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">{passingRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-500 mt-1">
              {passingSubmissions.length} of {completedSubmissions.length}{" "}
              passed
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardHeader className="text-sm font-medium text-gray-500">
              Avg. Completion Time
            </CardHeader>
          </CardHeader>
          <CardBody>
            <div className="text-3xl font-bold">
              {formatTime(averageCompletionTime)} min
            </div>
            <p className="text-sm text-gray-500 mt-1">
              of {assessment.timeLimit} min limit
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Score Distribution Chart */}
      <Card className="mb-6 mt-5">
        <CardHeader>
          <CardHeader>Score Distribution</CardHeader>
        </CardHeader>
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartTooltip
                  formatter={(value) => [`${value} candidates`, "Count"]}
                  labelFormatter={(label) => `Score Range: ${label}`}
                />
                <Bar
                  dataKey="count"
                  name="Candidates"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Problem Performance and Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Problem Performance */}
        <Card>
          <CardHeader>
            <CardHeader>Problem Performance</CardHeader>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={problemPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[0, assessment.obtainableScore / problemIds.length]}
                  />
                  <YAxis dataKey="problemId" type="category" />
                  <RechartTooltip
                    formatter={(value, name) => [
                      `${value} / ${
                        assessment.obtainableScore / problemIds.length
                      }`,
                      name,
                    ]}
                  />
                  <Bar
                    dataKey="avgScore"
                    name="Average Score"
                    fill={CHART_COLORS.secondary}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardHeader>Time Distribution</CardHeader>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <RechartTooltip
                    formatter={(value) => [`${value} candidates`, "Count"]}
                    labelFormatter={(label) => `Time Range: ${label}`}
                  />
                  <Bar
                    dataKey="count"
                    name="Candidates"
                    fill={CHART_COLORS.info}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Language and Cheating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardHeader>Language Distribution</CardHeader>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {languageDistribution().map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length]
                        }
                      />
                    ))}
                  </Pie>
                  <RechartTooltip
                    formatter={(value, name) => [`${value} submissions`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Cheating Status Distribution */}
        <Card>
          <CardHeader>
            <CardHeader>Cheating Status Distribution</CardHeader>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cheatingStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {cheatingStatusDistribution().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "No Copying"
                            ? CHART_COLORS.success
                            : entry.name === "Light Copying"
                            ? CHART_COLORS.warning
                            : entry.name === "Heavy Copying"
                            ? CHART_COLORS.danger
                            : CHART_COLORS.info
                        }
                      />
                    ))}
                  </Pie>
                  <RechartTooltip
                    formatter={(value, name) => [`${value} candidates`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Offenses Summary */}
      <Card>
        <CardHeader>
          <CardHeader>Security Violations Summary</CardHeader>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{tabChangeOffenses}</span>
              <span className="text-sm text-gray-500">Total Tab Changes</span>
              <span className="text-sm text-gray-500 mt-1">
                Avg.{" "}
                {(tabChangeOffenses / completedSubmissions.length).toFixed(1)}{" "}
                per candidate
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{copyPasteOffenses}</span>
              <span className="text-sm text-gray-500">
                Total Copy-Paste Events
              </span>
              <span className="text-sm text-gray-500 mt-1">
                Avg.{" "}
                {(copyPasteOffenses / completedSubmissions.length).toFixed(1)}{" "}
                per candidate
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Analytics;
