import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import {
  Phone,
  Mail,
  FileText,
  Calendar,
  Users,
  ChevronRight,
  ArrowUpRight,
  MoreHorizontal,
  Download,
} from "lucide-react";
import ax from "@/config/axios";
import Loader from "@/components/Loader";
import { PostingContext } from "@/types/PostingContext";
import { ExtendedAppliedPosting } from "@shared-types/ExtendedAppliedPosting";

const Pipeline = () => {
  const [appliedPostings, setAppliedPostings] = useState<
    ExtendedAppliedPosting[]
  >([]);
  const { posting } = useOutletContext<PostingContext>();
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const postingId = window.location.pathname.split("/")[2];

    axios
      .get(`/postings/${postingId}/applied`)
      .then((res) => {
        setAppliedPostings(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error fetching applied postings"
        );
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const downloadCSV = () => {
    if (!posting?.workflow?.steps?.length) return;

    const headers = posting.workflow.steps.map((step) => {
      const status = step.status === "in-progress" ? "inprogress" : step.status;
      return `${step.name} (${status})`;
    });

    const csvRows = [headers.join(",")];

    const candidatesByStep: Record<number, string[]> = {};

    posting.workflow.steps.forEach((_, index) => {
      candidatesByStep[index] = [];
    });

    appliedPostings.forEach((applied) => {
      let stepIndex;
      if (applied.status === "inprogress") {
        stepIndex =
          posting.workflow?.steps?.findIndex(
            (step) => step.status === "in-progress"
          ) ?? -1;
      } else {
        stepIndex = applied.disqualifiedStage;
      }

      if (
        posting.workflow &&
        typeof stepIndex === "number" &&
        stepIndex >= 0 &&
        stepIndex < posting.workflow.steps.length
      ) {
        candidatesByStep[stepIndex].push(applied.user.name);
      }
    });

    const maxCandidates = Math.max(
      ...Object.values(candidatesByStep).map((candidates) => candidates.length)
    );

    for (let i = 0; i < maxCandidates; i++) {
      const rowData = [];

      for (let j = 0; j < posting.workflow.steps.length; j++) {
        const candidatesInStep = candidatesByStep[j];
        rowData.push(
          i < candidatesInStep.length
            ? `"${candidatesInStep[i].replace(/"/g, '""')}"`
            : ""
        );
      }

      csvRows.push(rowData.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${posting?.title || "job-posting"}-pipeline.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CandidateCard = ({ applied }: { applied: ExtendedAppliedPosting }) => {
    const isSelected = selectedCandidate === applied._id;

    return (
      <div
        key={applied._id}
        className={`p-4 mb-3 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
          isSelected
            ? "bg-indigo-50 border-indigo-300"
            : "bg-white border-gray-200"
        }`}
        onClick={() =>
          setSelectedCandidate(isSelected ? null : applied._id || null)
        }
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {applied.user.name.charAt(0)}
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">
                {applied.user.name}
              </h5>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  Applied{" "}
                  {formatDate(
                    typeof applied.createdAt === "string"
                      ? applied.createdAt ?? ""
                      : applied.createdAt?.toISOString() ?? ""
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center text-xs text-gray-600">
                <Mail className="w-3 h-3 mr-1 text-gray-400" />
                <span className="truncate">{applied.user.email}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                <span>{applied.user.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <Users className="w-3 h-3 mr-1 text-gray-400" />
                <span>{applied.user.gender || "Not specified"}</span>
              </div>
              {applied.user.resumeUrl && (
                <div className="flex items-center text-xs text-indigo-600 hover:text-indigo-800">
                  <FileText className="w-3 h-3 mr-1" />
                  <a
                    href={applied.user.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 mt-2">
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="w-3 h-3 mr-1" />
                Options
              </Button>
              <Button size="sm" variant="solid" className="flex items-center">
                View Profile
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Candidate Pipeline
            </h1>
            <p className="text-gray-500 mt-1">
              {posting?.title || "Job Posting"} · {appliedPostings.length}{" "}
              candidate{appliedPostings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="bordered"
              className="flex items-center"
              onClick={downloadCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="solid" className="flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              View Job Post
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {posting?.workflow?.steps?.map((step, index) => {
          const stageApplicants = appliedPostings.filter((applied) => {
            return step.status === "in-progress"
              ? applied.status === "inprogress" || applied.disqualifiedStage?.toString() === step._id?.toString()
              : applied.disqualifiedStage?.toString() === step._id?.toString();
          });

          return (
            <Card
              key={index}
              className="min-w-72 max-w-72 h-[calc(100vh-12rem)] flex flex-col border-t-4 shadow-sm"
              style={{ borderTopColor: getStepColor(index) }}
            >
              <CardHeader className="bg-white border-b pb-3">
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-between w-full mb-2">
                    <h3 className="font-semibold text-gray-900">{step.name}</h3>
                    <Badge
                      color={getStepBadgeColor(index)}
                      className="text-xs px-2 py-1 ml-2"
                    >
                      {step.status === "in-progress"
                        ? "In Progress"
                        : step.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {stageApplicants.length} candidate
                    {stageApplicants.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardHeader>
              <CardBody className="overflow-y-auto flex-1 bg-gray-50 p-3">
                {stageApplicants.length > 0 ? (
                  stageApplicants.map((applied) => (
                    <CandidateCard key={applied._id} applied={applied} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                    <Users className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm">No candidates in this stage</p>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const getStepColor = (index: number) => {
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#14b8a6",
    "#0ea5e9",
  ];
  return colors[index % colors.length];
};

const getStepBadgeColor = (
  index: number
):
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | undefined => {
  const colors: (
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
  )[] = ["primary", "secondary", "success", "warning", "danger", "default"];
  return colors[index % colors.length];
};

export default Pipeline;
