import { Card, CardHeader, CardBody, Link, Divider } from "@heroui/react";
import { Clock } from "lucide-react";
import {
  AlignVerticalDistributeCenter,
  EarIcon,
  Scissors,
  ArrowLeftRight,
  Play,
} from "lucide-react";
import { MCQAssessment } from "@shared-types/MCQAssessment";
import { MCQAssessmentSubmission } from "@shared-types/MCQAssessmentSubmission";

interface ViewUserAssessmentTopProps {
  submission: MCQAssessmentSubmission;
  assessment: MCQAssessment;
}

const ViewUserAssessmentTop = ({
  submission,
  assessment,
}: ViewUserAssessmentTopProps) => {
  const getTimeTaken = () => {
    const totalTime = assessment?.timeLimit * 60;
    const time = totalTime - (submission?.timer ?? 0);

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // const getMCQCompletion = () => {
  //   const totalQuestions = assessment?.sections?.length || 0;
  //   const completedQuestions = submission?.mcqSubmissions?.length ?? 0;
  //   const percentage = (completedQuestions / totalQuestions) * 100;
  //   return `${percentage}%`;
  // };

  const getPercentage = (number: number = 0, total: number = 0) => {
    return parseInt(((number / total) * 100).toFixed(2));
  };

  const calculateTotalCopies = () => {
    return submission?.offenses?.copyPaste ?? 0;
  };

  const calculateTotalWindowSwitch = () => {
    return submission?.offenses?.tabChange ?? 0;
  };

  return (
    <div className="flex flex-col w-full h-fit gap-3">
      <div className="w-full flex flex-row gap-3">
        <Card className="min-w-[50%] h-fit flex flex-row justify-between items-center p-6">
          <CardBody className="flex justify-center items-start gap-1 flex-col">
            <p className="text-xl">{submission?.name}</p>
            <Link isExternal showAnchorIcon href="#" className="text-sm">
              {submission?.email}
            </Link>
          </CardBody>
          <CardBody className="max-w-[35%]">
            <p className="text-xs opacity-50">Assessment Submitted On</p>
            <p className="mt-1 leading-4 text-xs">
              {submission?.createdAt
                ? new Date(submission.createdAt).toString()
                : "N/A"}
            </p>
          </CardBody>
        </Card>

        <Card className="py-3 h-fit w-full">
          <CardHeader className="text-center flex justify-center text-gray-400">
            Time Taken
          </CardHeader>
          <CardBody className="flex justify-center items-center gap-2 flex-row">
            <Clock size={20} className="text-blue-500" />
            <p>{getTimeTaken()}</p>
          </CardBody>
        </Card>
      </div>
      <div className="w-full h-40 flex flex-row gap-3">
        <Card className="h-40 w-full">
          <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
            <AlignVerticalDistributeCenter className="text-white" size={20} />
            <p>Total Average</p>
          </CardHeader>
          <CardBody className="flex flex-row justify-between items-start gap-1">
            <div className="w-full">
              <p className="text-xs opacity-50 text-center">Qualifying Score</p>
              <p className="text-center mt-5 text-2xl">
                {assessment?.passingPercentage}%
              </p>
            </div>
            <Divider orientation="vertical" />
            <div className="w-full">
              <p className="text-xs opacity-50 text-center">Acquired Score</p>
              <p className="text-center mt-5 text-2xl">
                {getPercentage(
                  submission?.obtainedGrades?.total ?? 0,
                  assessment?.obtainableScore ?? 0
                )}
                %
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="h-40 w-full">
          <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
            <EarIcon className="text-red-500" size={20} />
            <p>Cheating Status: {submission?.cheatingStatus ?? "No Data"}</p>
          </CardHeader>
          <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
            <div className="flex justify-between items-center gap-3 flex-row w-full">
              <div className="flex gap-2">
                <Scissors className="text-white" size={20} />
                <p className="text-sm">Pasted Code</p>
              </div>
              <p
                className={`text-sm ml-[90px] ${
                  calculateTotalCopies() === 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {calculateTotalCopies() === 0 ? "NO" : calculateTotalCopies()}
              </p>
            </div>
            <div className="flex justify-between items-center gap-3 flex-row w-full">
              <div className="flex gap-2">
                <ArrowLeftRight className="text-white" size={20} />
                <p className="text-sm">Window Switch</p>
              </div>
              <p
                className={`text-sm ml-[68px] ${
                  calculateTotalWindowSwitch() === 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {calculateTotalWindowSwitch() === 0
                  ? "NO"
                  : calculateTotalWindowSwitch()}
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="flex h-40 flex-row gap-3 w-[100%]">
          <Card className="w-full">
            <CardHeader className="text-center flex items-center justify-center text-gray-400">
              Candidate's Status
            </CardHeader>
            <CardBody className="flex justify-center items-center pb-5">
              <p
                className={`text-xl ${
                  (assessment?.passingPercentage ?? 0) <
                  getPercentage(
                    submission?.obtainedGrades?.total ?? 0,
                    assessment?.obtainableScore ?? 0
                  )
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {(assessment?.passingPercentage ?? 0) <
                getPercentage(
                  submission?.obtainedGrades?.total ?? 0,
                  assessment?.obtainableScore ?? 0
                )
                  ? "PASSED"
                  : "FAILED"}
              </p>
            </CardBody>
          </Card>

          <Card className="w-full">
            <CardHeader className="text-center flex items-center justify-center text-gray-400">
              Watch Session Rewind
            </CardHeader>
            <CardBody
              className="flex justify-center items-center pb-5 cursor-pointer hover:bg-gray-700 hover:bg-opacity-20 transition-all duration-300"
              onClick={() => {
                if (submission?.sessionRewindUrl) {
                  window.open(submission.sessionRewindUrl, "_blank");
                }
              }}
            >
              <Play size={20} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewUserAssessmentTop;
