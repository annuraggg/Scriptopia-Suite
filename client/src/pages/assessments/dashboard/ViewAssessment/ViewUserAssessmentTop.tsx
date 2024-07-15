import { Card, CardHeader, CardBody, Link, Divider } from "@nextui-org/react";
import { Clock, CodeXml, SquareStack } from "lucide-react";
import {
  AlignVerticalDistributeCenter,
  EarIcon,
  Scissors,
  ArrowLeftRight,
  Play,
} from "lucide-react";

const ViewUserAssessmentTop = () => {
  const Cards = [
    {
      title: "Time Taken",
      icon: Clock,
      value: "60 Minutes",
      color: "text-blue-500",
    },
    {
      title: "Code Completion",
      icon: CodeXml,
      value: "20%",
      color: "text-green-500",
    },
    {
      title: "MCQ Completion",
      icon: SquareStack,
      value: "70%",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="flex flex-col w-full h-fit gap-3">
      <div className="w-full flex flex-row gap-3">
        <Card className="w-[50%] h-fit flex flex-row justify-between items-center p-6">
          <CardBody className="flex justify-center items-start gap-1 flex-col">
            <p className="text-xl">Assessment I</p>
            <Link isExternal showAnchorIcon href="#" className="text-sm">
              contact@scriptopia.in
            </Link>
          </CardBody>
          <CardBody className="max-w-[35%]">
            <p className="text-xs opacity-50">Assessment Submitted On</p>
            <p className="mt-1 text-lg">20th August, 2021</p>
          </CardBody>
        </Card>
        {Cards.map((card, index) => (
          <Card key={index} className="py-3 h-fit w-56">
            <CardHeader className="text-center flex justify-center text-gray-400">
              {card.title}
            </CardHeader>
            <CardBody className="flex justify-center items-center gap-2 flex-row">
              <card.icon size={20} className={`${card.color}`} />
              <p>{card.value}</p>
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
              <p className="text-center mt-5 text-2xl">60%</p>
            </div>
            <Divider orientation="vertical" />
            <div className="w-full">
              <p className="text-xs opacity-50 text-center">Aquired Score</p>
              <p className="text-center mt-5 text-2xl">60%</p>
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
              <p className="text-sm text-green-500 ml-[90px]">NO</p>
            </div>
            <div className="flex justify-between items-center gap-3 flex-row w-full">
              <div className="flex gap-2">
                <ArrowLeftRight className="text-white" size={20} />
                <p className="text-sm">Window Switch</p>
              </div>
              <p className="text-sm text-green-500 ml-[68px]">NO</p>
            </div>
          </CardBody>
        </Card>

        <div className="flex h-40 flex-row gap-3 w-[100%]">
          <Card className="w-full">
            <CardHeader className="text-center flex items-center justify-center text-gray-400">
              Candidate's Status
            </CardHeader>
            <CardBody className="flex justify-center items-center pb-5">
              <p className="text-xl text-green-500">Selected</p>
            </CardBody>
          </Card>

          <Card className="w-full">
            <CardHeader className="text-center flex items-center justify-center text-gray-400">
              Watch Session Rewind
            </CardHeader>
            <CardBody className="flex justify-center items-center pb-5">
              <Play size={20} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewUserAssessmentTop;
