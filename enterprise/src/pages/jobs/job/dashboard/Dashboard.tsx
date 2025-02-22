import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Avatar } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip";
import {
  MapPin,
  Briefcase,
  Banknote,
  FolderOutput,
  ChevronLeft,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Filter,
  Clock,
} from "lucide-react";

interface Salary {
  min: number;
  max: number;
  currency?: string;
}

interface ApplicationRange {
  start: string;
  end: string;
}

interface Posting {
  title: string;
  department: string;
  type: string;
  location: string;
  salary: Salary;
  applicationRange: ApplicationRange;
  candidates?: any[];
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
  avatarUrl?: string;
  appliedDate: string;
  lastUpdated: string;
  tags?: string[];
}

const ParticipantCard: React.FC<{ participant: Participant }> = ({
  participant,
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage <= 35) return "danger";
    if (percentage <= 50) return "warning";
    return "success";
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-sm">
      <CardBody className="p-4">
        <div className="flex items-start gap-4">
          <Avatar
            src={participant.avatarUrl}
            name={participant.name}
            className="w-10 h-10"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold">{participant.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Mail size={12} />
                  <span>{participant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Phone size={12} />
                  <span>{participant.phone}</span>
                </div>
              </div>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="sm">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key={"view"}>View Profile</DropdownItem>
                  <DropdownItem key={"download"}>Download Resume</DropdownItem>
                  <DropdownItem
                    key={"disqualify"}
                    className="text-danger"
                    color="danger"
                  >
                    Disqualify
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1">
                <Progress
                  value={participant.percentage}
                  color={getProgressColor(participant.percentage)}
                  size="sm"
                  className="max-w-md"
                />
                <span className="text-xs">{participant.percentage}%</span>
              </div>
            </div>

            {participant.tags && (
              <div className="flex gap-1 mt-2">
                {participant.tags.map((tag, index) => (
                  <Badge key={index} size="sm" variant="flat">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Applied: {participant.appliedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Updated: {participant.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const StageColumn: React.FC<{
  stage: string;
  participants: Participant[];
  dateRange: { from: string; to: string };
}> = ({ stage, participants, dateRange }) => {
  return (
    <div className="w-full min-w-[300px] flex flex-col gap-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">{stage}</h3>
            <span className="text-sm text-gray-500">
              {participants.length} Candidates
            </span>
          </div>
          <Button isIconOnly variant="light" size="sm">
            <Filter size={16} />
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <div className="flex gap-2">
            <span>From:</span>
            <span>{dateRange.from}</span>
          </div>
          <div className="flex gap-2">
            <span>To:</span>
            <span>{dateRange.to}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {participants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { posting } = useOutletContext() as { posting: Posting };
  const [showDisqualified, setShowDisqualified] = useState(false);

  // Enhanced mock data with more details
  const participants: Participant[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      stage: "Applied",
      percentage: 25,
      appliedDate: "2024-02-20",
      lastUpdated: "2024-02-21",
      tags: ["JavaScript", "React"],
    },
    // ... other participants
  ];

  const getPostingStatus = (posting: Posting) => {
    const currentDate = new Date();
    const endDate = new Date(posting.applicationRange.end);
    return currentDate < endDate ? "active" : "closed";
  };

  if (!posting?.candidates || posting?.candidates?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh] text-gray-500">
        <img src="/api/placeholder/200/200" alt="No data" className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Analytics Just Yet</h2>
        <p className="text-sm">
          Analytics will be available once the workflow is started and
          candidates have applied.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          isIconOnly
          variant="light"
          onClick={() => navigate("/postings/jobs")}
        >
          <ChevronLeft size={24} />
        </Button>

        <Card className="flex-grow">
          <CardBody className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-lg font-semibold">{posting.title}</h1>
                  <Badge variant="flat" size="sm">
                    {posting.department}
                  </Badge>
                </div>

                <Badge
                  color={
                    getPostingStatus(posting) === "active"
                      ? "success"
                      : "danger"
                  }
                >
                  {getPostingStatus(posting) === "active" ? "Active" : "Closed"}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <Tooltip content="Job Type">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <span>{posting.type}</span>
                  </div>
                </Tooltip>

                <Tooltip content="Location">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{posting.location}</span>
                  </div>
                </Tooltip>

                <Tooltip content="Salary Range">
                  <div className="flex items-center gap-2">
                    <Banknote size={16} />
                    <span>
                      {posting.salary.min.toLocaleString()} -{" "}
                      {posting.salary.max.toLocaleString()}
                      {posting.salary.currency?.toUpperCase() || "USD"}
                    </span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Button color="primary" startContent={<FolderOutput size={18} />}>
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <Switch
          size="sm"
          isSelected={showDisqualified}
          onValueChange={setShowDisqualified}
        >
          Show Disqualified
        </Switch>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[
          "Applied",
          "Problem-Solving",
          "Technical",
          "Interview",
          "Evaluation",
        ].map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            participants={participants.filter((p) => p.stage === stage)}
            dateRange={{
              from: "July 1, 2023",
              to: "July 2, 2023",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
