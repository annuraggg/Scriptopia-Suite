import { useOutletContext } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import {
  IconBuilding,
  IconMapPin,
  IconUsers,
  IconCalendar,
  IconMoneybag,
  IconBriefcase,
  IconLoader3,
  IconCode,
  IconWriting,
  IconUserCheck,
  IconTemplate,
  IconDeviceLaptop,
  IconCertificate,
  IconMessage,
} from "@tabler/icons-react";
import { WorkflowStep } from "@shared-types/Posting";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";
import getSymbolFromCurrency from "currency-symbol-map";

const Info = () => {
  const { posting } = useOutletContext() as { posting: ExtendedPosting };

  const isActive = () => {
    const now = new Date();
    const start = new Date(posting.applicationRange.start);
    const end = new Date(posting.applicationRange.end);
    return now >= start && now <= end;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStepProgress = () => {
    if (!posting.workflow?.steps) return 0;
    const completed = posting.workflow.steps.filter(
      (step: WorkflowStep) => step.status === "completed"
    ).length;
    return (completed / posting.workflow.steps.length) * 100;
  };

  enum StatusColor {
    active = "success",
    inactive = "danger",
    pending = "warning",
    completed = "success",
    "in-progress" = "primary",
    failed = "danger",
  }

  const getStatusColor = (status: string): StatusColor => {
    const statusColors = {
      active: "success",
      inactive: "danger",
      pending: "warning",
      completed: "success",
      "in-progress": "primary",
      failed: "danger",
    };
    return (statusColors[status as keyof typeof statusColors] ||
      "default") as StatusColor;
  };

  const getTitleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="gap-6 p-6 grid grid-cols-1 lg:grid-cols-2">
      {/* Main Info Card */}
      <Card className="col-span-2">
        <CardHeader className="flex justify-between items-center px-6 py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{posting.title}</h1>
            <div className="flex gap-2">
              <Chip
                color={posting.published ? "success" : "warning"}
                variant="flat"
                size="sm"
              >
                {posting.published ? "Published" : "Draft"}
              </Chip>
              <Chip
                color={isActive() ? "success" : "danger"}
                variant="flat"
                size="sm"
              >
                {isActive() ? "Active" : "Inactive"}
              </Chip>
            </div>
          </div>
          <Button
            variant="ghost"
            className="hidden"
            startContent={<IconTemplate size={20} />}
          >
            Save as Template
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-2">
              <IconBuilding className="text-default-500" size={20} />
              <div>
                <p className="text-sm text-default-500">Department</p>
                <p>
                  {posting?.organizationId?.departments?.find(
                    (d) => d._id === posting?.department
                  )?.name || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconMapPin className="text-default-500" size={20} />
              <div>
                <p className="text-sm text-default-500">Location</p>
                <p className="font-medium">{posting.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconMoneybag className="text-default-500" size={20} />
              <div>
                <p className="text-sm text-default-500">Salary Range</p>
                <p className="font-medium">
                  {posting.salary.currency
                    ? getSymbolFromCurrency(posting.salary.currency)
                    : "$"}{" "}
                  {posting.salary.min} - {posting.salary.max}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconBriefcase className="text-default-500" size={20} />
              <div>
                <p className="text-sm text-default-500">Employment Type</p>
                <p className="font-medium">
                  {getTitleCase(posting.type.replace("_", " "))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconUsers className="text-default-500" size={20} />
              <div>
                <p className="text-sm text-default-500">Openings</p>
                <p className="font-medium">{posting.openings}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconCalendar className="text-default-500" size={20} />
              <div>
                <p className="text-sm text-default-500">Application Period</p>
                <p className="font-medium">
                  {formatDate(posting.applicationRange.start)} -{" "}
                  {formatDate(posting.applicationRange.end)}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Workflow Progress Card */}
      <Card>
        <CardHeader className="px-6 py-4">
          <h2 className="text-xl font-semibold">Workflow Progress</h2>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <IconLoader3 className="text-default-500" size={20} />
                <span className="font-medium">
                  {posting.workflow?.steps.length || 0} Steps
                </span>
              </div>
              <Progress
                value={getStepProgress()}
                className="w-1/2"
                color="primary"
              />
            </div>
            <div className="space-y-2">
              {posting.workflow?.steps.map((step, index) => (
                <div
                  key={step._id || index}
                  className="flex justify-between items-center p-2 rounded-lg bg-default-100"
                >
                  <div className="flex items-center gap-2">
                    {step.type === "CODING_ASSESSMENT" && (
                      <IconCode size={18} />
                    )}
                    {step.type === "MCQ_ASSESSMENT" && (
                      <IconWriting size={18} />
                    )}
                    {step.type === "INTERVIEW" && <IconUserCheck size={18} />}
                    {step.type === "RESUME_SCREENING" && (
                      <IconCertificate size={18} />
                    )}
                    {step.type === "ASSIGNMENT" && (
                      <IconDeviceLaptop size={18} />
                    )}
                    <span>{step.name}</span>
                  </div>
                  <Chip
                    color={getStatusColor(step.status)}
                    variant="flat"
                    size="sm"
                  >
                    {step.status}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader className="px-6 py-4">
          <h2 className="text-xl font-semibold">Statistics</h2>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconUsers className="text-default-500" size={20} />
                <div>
                  <p className="text-sm text-default-500">Total Candidates</p>
                  <p className="font-medium">
                    {posting.candidates?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconDeviceLaptop className="text-default-500" size={20} />
                <div>
                  <p className="text-sm text-default-500">Assessments</p>
                  <p className="font-medium">
                    {(posting.mcqAssessments?.length || 0) +
                      (posting.codeAssessments?.length || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconMessage className="text-default-500" size={20} />
                <div>
                  <p className="text-sm text-default-500">
                    Interviews Scheduled
                  </p>
                  <p className="font-medium">
                    {posting.interviews?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconCertificate className="text-default-500" size={20} />
                <div>
                  <p className="text-sm text-default-500">ATS Status</p>
                  <Chip
                    color={getStatusColor(posting.ats?.status || "pending")}
                    variant="flat"
                    size="sm"
                  >
                    {posting.ats?.status || "Not Configured"}
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Info;
