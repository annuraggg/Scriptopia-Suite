import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, Switch, CardFooter } from "@nextui-org/react";
import {
  MapPinIcon,
  BriefcaseIcon,
  BanknoteIcon,
  Menu,
  ThumbsUpIcon,
  FileTextIcon,
  Ban,
  FileUp,
} from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";

interface Posting {
  id: string;
  title: string;
  createdOn: string;
  status: "active" | "inactive";
  openUntil: string;
  category: "Operations" | "IT";
  location: string;
  salaryFrom: string;
  salaryUpto: string;
  jobprofile: "Full Time" | "Part Time" | "Internship";
}

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage:
    | "Applied"
    | "Problem-Solving"
    | "Technical"
    | "Interview"
    | "Evaluation";
  percentage: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const posting = location.state?.posting as Posting;

  const participants: Participant[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      stage: "Applied",
      percentage: 25,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "234-567-8901",
      stage: "Applied",
      percentage: 40,
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "345-678-9012",
      stage: "Problem-Solving",
      percentage: 55,
    },
    {
      id: "4",
      name: "Bob Brown",
      email: "bob@example.com",
      phone: "456-789-0123",
      stage: "Technical",
      percentage: 70,
    },
    {
      id: "5",
      name: "Charlie Davis",
      email: "charlie@example.com",
      phone: "567-890-1234",
      stage: "Interview",
      percentage: 85,
    },
    {
      id: "6",
      name: "Diana Evans",
      email: "diana@example.com",
      phone: "678-901-2345",
      stage: "Evaluation",
      percentage: 95,
    },
  ];

  const renderParticipantCards = (stage: Participant["stage"]) => {
    return participants
      .filter((participant) => participant.stage === stage)
      .map((participant) => (
        <Card
          key={participant.id}
          className="w-full h-32 flex flex-col bg-zinc-800"
        >
          <CardBody className="flex-grow flex flex-col justify-between overflow-hidden py-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm truncate">{participant.name}</p>
              <p className="text-xs text-slate-400 truncate">
                {participant.email}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {participant.phone}
              </p>
            </div>
            <hr className="w-full border-t border-slate-600 rounded-full" />
          </CardBody>
          <CardFooter className="h-8 flex flex-row items-center justify-center gap-4 mr-1">
            <div className="flex flex-row items-center gap-2">
              <ThumbsUpIcon size={14} />
              <p
                className={`text-xs ${
                  participant.percentage <= 35
                    ? "text-red-400"
                    : participant.percentage <= 50
                    ? "text-orange-400"
                    : participant.percentage <= 70
                    ? "text-yellow-400"
                    : "text-green-500"
                }`}
              >
                {participant.percentage}%
              </p>
            </div>
            <div className="flex flex-row items-center text-blue-500 cursor-pointer">
              <FileTextIcon size={14} />
              <p className="text-xs">&nbsp;Resume</p>
            </div>
            <Ban size={14} className="text-red-500" />
          </CardFooter>
        </Card>
      ));
  };

  return (
    <div className="flex flex-col items-start justify-start p-10 pt-8 h-scroll w-full">
      <div className="flex flex-row items-center justify-start gap-4 w-full">
        <ChevronLeftIcon
          size={50}
          className="text-slate-400 mt-6"
          onClick={() => navigate("/postings/jobs")}
        />
        <div className="flex flex-col gap-3 w-full mt-6 overflow-y-auto">
          <Card className="w-full h-24 border-none p-2 grid grid-cols-2 gap-2">
            <div className="flex flex-col items-start justify-start gap-3 w-full py-2 px-4">
              <div className="flex flex-row items-center justify-start gap-2 w-full">
                <p className="text-lg">{posting?.title}</p>
                <span
                  className={`text-xs px-3 rounded-full whitespace-nowrap ${
                    posting?.category === "IT"
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {posting?.category}
                </span>
                <span
                  className={`text-xs px-3 rounded-full whitespace-nowrap ${
                    posting?.status === "active"
                      ? "bg-green-900 text-green-500"
                      : "bg-red-900 text-red-500"
                  }`}
                >
                  {posting?.status === "active" ? "Active" : "Closed"}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon size={18} />
                  <p>{posting?.jobprofile}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon size={18} />
                  <p>{posting?.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BanknoteIcon size={18} />
                  <p>
                    {posting?.salaryFrom} - {posting?.salaryUpto}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm rounded-full border bg-secondary bg-opacity-5 px-2 py-1">
                <p className="text-gray-300 text-xs">
                  Open Until {posting?.openUntil}
                </p>
              </div>
              <Menu size={28} className="mr-6 cursor-pointer" />
            </div>
          </Card>
        </div>
        <div className="w-[20%] pt-9">
          <Card
            isPressable
            className="flex flex-row w-full h-10 items-center justify-center gap-2 rounded-large bg-slate-50 text-zinc-900 p-5 "
          >
            <FileUp size={24} />
            <p className="text-sm">Export to CSV</p>
          </Card>
        </div>
      </div>

      <div className="flex flex-row items-start justify-start gap-4 w-full pt-6 pl-14">
        <Switch size="sm" defaultSelected color="default">
          Show Disqualified ?
        </Switch>
      </div>

      <div className="flex flex-row items-start justify-between w-full gap-2 pt-10 pl-14">
        {[
          "Applied",
          "Problem-Solving",
          "Technical",
          "Interview",
          "Evaluation",
        ].map((stage) => (
          <div key={stage} className="w-full h-full flex flex-col gap-3">
            <Card className="w-full h-fit bg-blue-500 bg-opacity-10 py-0.5">
              <CardBody className="flex flex-col items-center justify-center p-2">
                <div className="flex flex-col-2 items-start gap-2">
                  <div>
                    <p className="text-xs">from:</p>
                    <p className="text-xs">to: </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      July 1, 2023, 12:00 AM
                    </p>
                    <p className="text-xs text-slate-400">
                      July 2, 2023, 12:00 AM
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="w-full h-fit flex flex-col">
              <CardBody className="flex flex-col items-center justify-center h-fit">
                <div className="flex flex-col items-start">
                  <p className="text-sm">
                    {stage}{" "}
                    {participants.filter((p) => p.stage === stage).length}
                  </p>
                  <div className="flex flex-row gap-1">
                    <p className="text-xs text-slate-400 mt-1">Qualified:</p>
                    <span className="text-xs text-green-500 items-center justify-between mt-1">
                      30
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="w-full h-full flex flex-col gap-2">
              <CardBody className="flex flex-col gap-4">
                {renderParticipantCards(stage as Participant["stage"])}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
