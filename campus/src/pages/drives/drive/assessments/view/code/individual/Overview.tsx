import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Alert } from "@heroui/alert";
import { Tooltip } from "@heroui/tooltip";
import { useDisclosure } from "@heroui/modal";
import Loader from "@/components/Loader";

import {
  IconAppWindow,
  IconCamera,
  IconClipboardCopy,
  IconExternalLink,
  IconFileDescription,
  IconInfoCircle,
  IconUserHexagon,
} from "@tabler/icons-react";
import { ExtendedCodeAssessmentSubmission as ECAS } from "@shared-types/ExtendedCodeAssessmentSubmission";
import ViewCaptures from "./ViewCaptures";

interface OverviewProps {
  submission: ECAS | null;
  loading: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Overview = ({ submission, loading }: OverviewProps) => {
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [totalProblems, setTotalProblems] = useState<number>(0);

  useEffect(() => {
    if (!submission) return;

    const obtainedScore = submission.obtainedGrades?.total || 0;
    const maxScore = submission.assessmentId.obtainableScore;
    const scorePercentage = Math.round((obtainedScore / maxScore) * 100);
    const isPassed =
      scorePercentage >= submission.assessmentId.passingPercentage;
    const totalProblems = submission.assessmentId.problems.length;

    setIsPassed(isPassed);
    setTotalProblems(totalProblems);
  }, [submission]);

  const {
    isOpen: isViewCapturesOpen,
    onOpen: openViewCaptures,
    onOpenChange: onViewCaptureOpenChange,
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

  if (loading) return <Loader />;

  if (!submission)
    return <div className="p-10">Assessment Submission not found</div>;

  const post60days =
    new Date(submission.createdAt!).getTime() + 60 * 24 * 60 * 60 * 1000 <
    new Date().getTime();

  const renderProblemPerformance = () => {
    return submission.submissions?.map((problemSubmission: any) => {
      const obtainedMarks =
        submission.obtainedGrades?.problem?.find(
          (p) => p.problemId === problemSubmission.problemId
        )?.obtainedMarks || 0;

      return (
        <div
          key={problemSubmission.problemId}
          className="flex justify-between items-center mt-2 p-3 bg-card rounded-xl"
        >
          <div>
            <p>Problem: {problemSubmission.problemId.title}</p>
            <p>Language: {problemSubmission.language}</p>
          </div>
          <div>
            <p>Score: {obtainedMarks} </p>
            <div className="flex gap-2 mt-1"></div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <Alert
        title="Code Assessment Submission"
        hideIcon
        description={`Assessment Id: ${submission.assessmentId._id}`}
        color="secondary"
      />
      <div className="flex gap-5 mt-5">
        <Card className="w-full">
          <CardHeader>
            <IconUserHexagon className="mr-3" />
            Candidate Information
          </CardHeader>
          <CardBody className="gap-5">
            <div className="flex justify-between items-center">
              <p>Name</p>
              <p className="font-semibold">{submission.name}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Email</p>
              <p className="font-semibold">{submission.email}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Status</p>
              <p className="font-semibold">{titleCase(submission.status)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Started At</p>
              <p className="font-semibold">
                {new Date(submission.createdAt!).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Submitted At</p>
              <p className="font-semibold">
                {new Date(submission.updatedAt!).toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <IconFileDescription className="mr-3" />
            Assessment Overview
          </CardHeader>
          <CardBody className="gap-5">
            <div className="flex justify-between items-center">
              <p className="flex items-center gap-1">
                Total Time Spent{" "}
                <Tooltip content="Total time spent on assessment, excluding the time when the candidate was not active">
                  <IconInfoCircle size={16} className="cursor-pointer" />
                </Tooltip>
              </p>
              <p className="font-semibold">
                {getClockTime(
                  submission.assessmentId.timeLimit * 60 - submission.timer
                )}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Time Limit</p>
              <p className="font-semibold">
                {getClockTime(submission.assessmentId.timeLimit * 60, false)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p>Total Problems</p>
              <p className="font-semibold">{totalProblems}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Total Score</p>
              <p className="font-semibold">
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

      <Card className="mt-5">
        <CardHeader>Proctoring Summary</CardHeader>
        <CardBody className="flex-row gap-5">
          <div className="flex items-center w-full p-5 justify-center flex-col bg-card rounded-xl">
            <p className="font-semibold text-3xl mb-2">
              {submission.offenses?.tabChange?.reduce(
                (total, offense) => total + offense.times,
                0
              ) || 0}
            </p>
            <div className="flex">
              <IconAppWindow className="mr-3" />
              <p>Total Window Changes</p>
            </div>
          </div>
          <div className="flex items-center w-full p-5 justify-center flex-col bg-card rounded-xl">
            <p className="font-semibold text-3xl mb-2">
              {submission.offenses?.copyPaste?.reduce(
                (total, offense) => total + offense.times,
                0
              ) || 0}
            </p>
            <div className="flex">
              <IconClipboardCopy className="mr-3" />
              <p>Total Copy Paste Detected</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardHeader>Problem Performance</CardHeader>
        <CardBody>{renderProblemPerformance()}</CardBody>
      </Card>

      <div
        onClick={() => window.open(submission.sessionRewindUrl, "_blank")}
        className="float-right flex gap-2 mt-3 text-secondary cursor-pointer hover:text-secondary-700 transition-colors"
      >
        <IconExternalLink />
        <p>View Session Rewind</p>
      </div>

      <div
        onClick={() => {
          if (post60days) return;
          openViewCaptures();
        }}
        className="float-right pb-5 flex gap-2 mt-3 mr-5 text-secondary cursor-pointer hover:text-secondary-700 transition-colors"
      >
        <IconCamera />

        {post60days ? (
          <Tooltip
            content="Camera captures are only available for 60 days. You cannot view captures now"
            color="danger"
          >
            <p> View Camera Captures</p>
          </Tooltip>
        ) : (
          <p> View Camera Captures</p>
        )}
      </div>

      <ViewCaptures
        isOpen={isViewCapturesOpen}
        onOpenChange={onViewCaptureOpenChange}
        email={submission.email}
      />
    </div>
  );
};

export default Overview;
