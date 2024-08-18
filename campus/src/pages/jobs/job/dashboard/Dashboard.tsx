import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CardBody, Switch, CardFooter } from "@nextui-org/react";
import {
  MapPinIcon,
  BriefcaseIcon,
  BanknoteIcon,
  ThumbsUpIcon,
  FileTextIcon,
  Ban,
  FolderOutputIcon,
} from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";

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
  const { drive } = useOutletContext();

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
                    ? "text-danger-400"
                    : participant.percentage <= 50
                    ? "text-warning-400"
                    : "text-success-400"
                }`}
              >
                {participant.percentage}%
              </p>
            </div>
            <div className="flex flex-row items-center text-blue-500 cursor-pointer">
              <FileTextIcon size={14} />
              <p className="text-xs">&nbsp;Resume</p>
            </div>
            <Ban size={14} className="text-danger" />
          </CardFooter>
        </Card>
      ));
  };

  if (!drive?.candidates || drive?.candidates?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[100vh]">
        <p className="text-slate-400 text-xl">No Analytics Just Yet</p>
        <p className="text-slate-400 text-sm mt-2">
          Analytics will be available once the workflow is started and
          candidates have applied.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start p-10 pt-8 h-scroll w-full">
      <div className="flex flex-row items-center justify-start gap-4 w-full">
        <ChevronLeftIcon
          size={40}
          className="text-slate-400 mt-6"
          onClick={() => navigate("/drives/drive")}
        />
        <div className="flex flex-row items-center justify-center gap-3 w-full mt-6 overflow-y-auto">
          <Card className="w-fit h-18 py-4 px-8 flex items-center justify-center border-none bg-zinc-800/25">
            <div className="flex items-center gap-8 w-full">
              <div className="flex items-center gap-2">
                <p className="text-lg">{drive?.title}</p>
                <span
                  className={`text-xs rounded-full whitespace-nowrap ${
                    drive.category === "IT"
                      ? "text-success-500"
                      : drive.category === "Operations"
                      ? "text-warning-500"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {drive.category}
                </span>
                <span
                  className={`text-xs px-2 rounded-full whitespace-nowrap ${
                    drive.status === "active"
                      ? "text-success-500 bg-success-100"
                      : "text-danger-500 bg-danger-100"
                  }`}
                >
                  {drive.status === "active" ? "Active" : "Closed"}
                </span>
              </div>
              <div className="flex items-center gap-7 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon size={18} />
                  <p>{drive?.jobprofile}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon size={18} />
                  <p>{drive?.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <BanknoteIcon size={18} />
                  <p>
                    {drive?.salaryFrom} - {drive?.salaryUpto}
                  </p>
                </div>
                <div className="ml-auto text-xs text-gray-300 bg-secondary bg-opacity-5 rounded-full px-2 py-1">
                  {drive.status === "active"
                    ? `Open Until ${drive.openUntil}`
                    : `Closed at ${drive.openUntil}`}
                </div>
              </div>
            </div>
          </Card>
          <Card
            isPressable
            className="flex flex-row h-10 py-2 px-3 rounded-xl gap-3 items-center justify-center border-2 shadow-md ml-auto bg-success-400 text-success-foreground"
          >
            <FolderOutputIcon size={20} />
            <p className="text-xs">Export to CSV</p>
          </Card>
        </div>
      </div>

      <div className="flex flex-row items-center  gap-4 w-full pt-6 pl-14">
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
                    <span className="text-xs text-success-500 items-center justify-between mt-1">
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
