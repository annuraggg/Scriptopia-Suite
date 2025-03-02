import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardFooter, CardBody } from "@heroui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Badge } from "@heroui/badge";
import { CodeAssessment } from "@shared-types/CodeAssessment";
import { CodeAssessmentSubmission } from "@shared-types/CodeAssessmentSubmission";

interface ResultsProp {
  assessment: CodeAssessment;
  submissions: CodeAssessmentSubmission[];
}

const Results = ({ assessment, submissions }: ResultsProp) => {
  const navigate = useNavigate();

  const handleViewCandidate = (candidateId: string) => {
    navigate(`${window.location.pathname}/${candidateId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Colors for charts
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

  // Color scale function for score-based coloring
  const getScoreColor = (score: number, passingPercentage: number) => {
    if (score >= passingPercentage + 15) return CHART_COLORS.success;
    if (score >= passingPercentage) return CHART_COLORS.info;
    if (score >= passingPercentage - 15) return CHART_COLORS.warning;
    return CHART_COLORS.danger;
  };

  const getCheatingStatusColor = (status: string | undefined) => {
    if (!status) return CHART_COLORS.warning;
    if (status === "No Copying") return CHART_COLORS.success;
    if (status === "Light Copying") return CHART_COLORS.warning;
    return CHART_COLORS.danger;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardHeader>Assessment Results</CardHeader>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn>Candidate</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Score</TableColumn>
              <TableColumn>Time Taken</TableColumn>
              <TableColumn>Cheating Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow
                  key={submission._id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        submission.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {submission.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {submission.obtainedGrades?.total !== undefined ? (
                      <span
                        className="font-medium"
                        style={{
                          color: getScoreColor(
                            (submission.obtainedGrades.total /
                              assessment.obtainableScore) *
                              100,
                            assessment.passingPercentage
                          ),
                        }}
                      >
                        {submission.obtainedGrades.total}/
                        {assessment.obtainableScore}
                      </span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{formatTime(submission.timer)}</TableCell>
                  <TableCell>
                    {submission.cheatingStatus ? (
                      <span
                        style={{
                          color: getCheatingStatusColor(
                            submission.cheatingStatus
                          ),
                        }}
                      >
                        {submission.cheatingStatus}
                      </span>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewCandidate(submission._id || "")}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter className="justify-between">
          <div className="text-sm text-gray-500">
            Showing {submissions.length} candidates
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Results;
