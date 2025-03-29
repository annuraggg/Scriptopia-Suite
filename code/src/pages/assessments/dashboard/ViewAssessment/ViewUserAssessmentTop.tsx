// @ts-nocheck
import { Card, CardHeader, CardBody, Link, Divider } from "@heroui/react";
import { Clock, CodeXml, SquareStack } from "lucide-react";
import {
  AlignVerticalDistributeCenter,
  EarIcon,
  Scissors,
  ArrowLeftRight,
  Play,
} from "lucide-react";
import { Assessment } from "@shared-types/Assessment";
import { AssessmentSubmissionsSchema as IAssessSub } from "@shared-types/AssessmentSubmission";

const ViewUserAssessmentTop = ({
  submission,
  assessment,
}: {
  submission: IAssessSub;
  assessment: Assessment;
}) => {
  const getTimeTaken = () => {
    const totalTime = assessment?.timeLimit * 60;
    const time = totalTime - submission?.timer;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getCodeCompletion = () => {
    const totalQuestions = assessment?.mcqs?.length || 0;
    const completedQuestions = submission?.mcqSubmissions?.length ?? 0;
    const percentage = (completedQuestions / totalQuestions) * 100;
    return `${percentage}%`;
  };

  const getMCQCompletion = () => {
    const totalQuestions = assessment?.mcqs?.length || 0;
    const completedQuestions = submission?.mcqSubmissions?.length ?? 0;
    const percentage = (completedQuestions / totalQuestions) * 100;
    return `${percentage}%`;
  };

  const getPercentage = (number: number = 0, total: number = 0) => {
    return parseInt(((number / total) * 100).toFixed(2));
  };

  const calculateTotalCopies = () => {
    let totalCopies = 0;
    if (submission?.offenses?.copyPaste) {
      totalCopies += submission?.offenses?.copyPaste?.mcq;
      submission?.offenses?.copyPaste?.problem?.forEach((problem) => {
        totalCopies += problem?.times;
      });
    }
    return totalCopies;
  };

  const calculateTotalWindowSwitch = () => {
    let totalSwitches = 0;
    if (submission?.offenses?.tabChange) {
      totalSwitches += submission?.offenses?.tabChange?.mcq;
      submission?.offenses?.tabChange?.problem?.forEach((problem) => {
        totalSwitches += problem?.times;
      });
    }

    return totalSwitches;
  };

  const Cards = [
    {
      title: "Time Taken",
      icon: Clock,
      value: getTimeTaken(),
      color: "text-blue-500",
      visible: true,
    },
    {
      title: "Code Completion",
      icon: CodeXml,
      value: getCodeCompletion(),
      color: "text-green-500",
      visible: assessment?.problems?.length > 0,
    },
    {
      title: "MCQ Completion",
      icon: SquareStack,
      value: getMCQCompletion(),
      color: "text-yellow-500",
      visible: assessment?.mcqs?.length > 0,
    },
  ];

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
              {new Date(assessment?.createdAt).toString()}
            </p>
          </CardBody>
        </Card>
        {Cards?.map((card, index) => (
          <Card
            key={index}
            className={`py-3 h-fit w-56 ${card?.visible ? "w-full" : "hidden"}`}
          >
            <CardHeader className="text-center flex justify-center text-gray-400">
              {card?.title}
            </CardHeader>
            <CardBody className="flex justify-center items-center gap-2 flex-row">
              <card.icon size={20} className={`${card?.color}`} />
              <p>{card?.value}</p>
            </CardBody>
          </Card>
        ))}
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
              <p className="text-xs opacity-50 text-center">Aquired Score</p>
              <p className="text-center mt-5 text-2xl">
                {getPercentage(
                  submission?.obtainedGrades?.total,
                  assessment?.obtainableScore
                )}
                %
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="h-40 w-full">
          <CardHeader className="text-center flex flex-row justify-center items-center text-gray-400 gap-2">
            <EarIcon className="text-red-500" size={20} />
            <p>Cheating</p>
          </CardHeader>
          <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
            <div className="flex justify-between items-center gap-3 flex-row w-full">
              <div className="flex gap-2">
                <Scissors className="text-white" size={20} />
                <p className="text-sm">Pasted Code</p>
              </div>
              <p
                className={`text-smml-[90px]
              ${calculateTotalCopies() === 0 ? "text-green-500" : "text-red-500"
                  }
                `}
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
                className={`text-sm  ml-[68px]
              ${calculateTotalWindowSwitch() === 0
                    ? "text-green-500"
                    : "text-red-500"
                  }
                `}
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
                className={`text-xl 
              ${assessment?.passingPercentage <
                    getPercentage(
                      submission?.obtainedGrades?.total,
                      assessment?.obtainableScore
                    )
                    ? "text-green-500"
                    : "text-red-500"
                  }
                `}
              >
                {assessment?.passingPercentage <
                  getPercentage(
                    submission?.obtainedGrades?.total,
                    assessment?.obtainableScore
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
              onClick={() => window.open(submission?.sessionRewindUrl, "_blank")}
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
