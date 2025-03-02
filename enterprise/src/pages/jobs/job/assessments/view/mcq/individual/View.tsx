import { useAuth } from "@clerk/clerk-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEffect, useState } from "react";
import axios from "@/config/axios";
import { ExtendedMCQAssessmentSubmission as EMAS } from "@shared-types/ExtendedMCQAssessmentSubmission";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { Alert } from "@heroui/alert";
import { Tooltip } from "@heroui/tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import ViewCaptures from "./ViewCaptures";
import Review from "./Review";

const View = () => {
  const [submission, setSubmission] = useState<EMAS | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [refetch, setRefetch] = useState<boolean>(false);

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

        const submission = response.data.data as EMAS;
        const obtainedScore = submission.obtainedGrades?.total || 0;
        const maxScore = submission.assessmentId.obtainableScore;
        const scorePercentage = Math.round((obtainedScore / maxScore) * 100);
        const isPassed =
          scorePercentage >= submission.assessmentId.passingPercentage;
        const totalQuestions = submission.assessmentId.sections.reduce(
          (acc, section) => acc + section.questions.length,
          0
        );

        setIsPassed(isPassed);
        setTotalQuestions(totalQuestions);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch assessment submission");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [getToken, refetch]);

  const {
    isOpen: isViewCapturesOpen,
    onOpen: openViewCaptures,
    onOpenChange: onViewCaptureOpenChange,
  } = useDisclosure();

  const {
    isOpen: isReviewOpen,
    onOpenChange: onReviewOpenChange,
    onOpen: openReview,
  } = useDisclosure();

  const titleCase = (str?: string): string => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getClockTime = (time: number, showSeconds: boolean = true): string => {
    const minutes = Math.floor(time / 60);
    if (!showSeconds) return `${minutes}m`;
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  const onReviewSave = () => {
    setRefetch((prev) => !prev);
  };

  if (loading) return <Loader />;

  if (!submission)
    return <div className="p-10">Assessment Submission not found</div>;

  const post60days =
    new Date(submission.createdAt!).getTime() + 60 * 24 * 60 * 60 * 1000 <
    new Date().getTime();

  return (
    <div className="p-10">
      <Alert
        title="Assessment Submission"
        hideIcon
        description={`Assessment Id: ${submission.assessmentId._id}`}
      />
      {submission.assessmentId.requiresManualReview &&
        !submission.isReviewed && (
          <Alert
            description=" This assessment requires manual review. Please review the submission and mark it as reviewed."
            className="mt-2"
            color="danger"
            endContent={
              <Button color="danger" onPress={openReview}>
                Start Review
              </Button>
            }
            title={"Pending Review"}
          />
        )}
      <div className="flex gap-5 mt-5">
        <Card className="w-full">
          <CardHeader>Candidate Information</CardHeader>
          <CardBody className="gap-5">
            <div className="flex justify-between items-center">
              <p>Name</p>
              <p className=" font-semibold">{submission.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Email</p>
              <p className=" font-semibold">{submission.email}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Status</p>
              <p className=" font-semibold">{titleCase(submission.status)}</p>
            </div>{" "}
            <div className="flex justify-between items-center">
              <p>Started At</p>
              <p className=" font-semibold">
                {new Date(submission.createdAt!).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Submitted At</p>
              <p className=" font-semibold">
                {new Date(submission.updatedAt!).toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="w-full">
          <CardHeader>Assessment Overview</CardHeader>
          <CardBody className="gap-5">
            <div className="flex justify-between items-center">
              <p className="flex items-center gap-1">
                Total Time Spent{" "}
                <Tooltip content="Total time spent on assessment, excluding the time when the candidate was not active">
                  <IconInfoCircle size={16} className="cursor-pointer" />
                </Tooltip>
              </p>
              <p className=" font-semibold">
                {getClockTime(
                  submission.assessmentId.timeLimit * 60 - submission.timer
                )}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Time Limit</p>
              <p className=" font-semibold">
                {getClockTime(submission.assessmentId.timeLimit * 60, false)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Total Questions</p>
              <p className=" font-semibold">
                <span className="font-medium">{totalQuestions}</span>
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Total Score</p>
              <p className=" font-semibold">
                {submission.obtainedGrades?.total} /{" "}
                {submission.assessmentId.obtainableScore} points
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Result</p>
              <p
                className={`font-semibold ${
                  isPassed ? "text-success-500" : "text-danger-500"
                }`}
              >
                {isPassed ? "PASSED" : "FAILED"}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex mt-5 gap-5">
        {post60days ? (
          <Tooltip
            content="Camera captures are only available for 60 days. You cannot view captures now"
            color="danger"
          >
            <Button
              className="w-full hover:none opacity-50 hover:opacity-50 cursor-pointer focus:opacity-50"
              variant="flat"
              disabled={true}
            >
              View Camera Captures
            </Button>
          </Tooltip>
        ) : (
          <Button className="w-full" onPress={openViewCaptures} variant="flat">
            View Camera Captures
          </Button>
        )}
        <Button
          className="w-full"
          onPress={() => window.open(submission.sessionRewindUrl, "_blank")}
          variant="flat"
        >
          View Session Rewind
        </Button>
      </div>

      <ViewCaptures
        isOpen={isViewCapturesOpen}
        onOpenChange={onViewCaptureOpenChange}
        email={submission.email}
      />

      <Review
        isOpen={isReviewOpen}
        onOpenChange={onReviewOpenChange}
        submission={submission}
        onReviewSave={onReviewSave}
      />
    </div>
  );
};

export default View;
