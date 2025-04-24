import { useOutletContext } from "react-router-dom";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";
import {
  IconMapPin,
  IconUsers,
  IconCalendar,
  IconMoneybag,
  IconBriefcase,
  IconCode,
  IconWriting,
  IconUserCheck,
  IconDeviceLaptop,
  IconCertificate,
  IconMessage,
  IconBuildingSkyscraper,
  IconUserPlus,
  IconChecks,
  IconAlertCircle,
  IconInfoCircle,
  IconChartBar,
  IconLink,
  IconCalendarTime,
  IconFilter,
  IconCheckbox,
} from "@tabler/icons-react";
import { WorkflowStep, StepStatus, StepType } from "@shared-types/Drive";
import { ExtendedDrive } from "@shared-types/ExtendedDrive";
import { Company } from "@shared-types/Company";
import { PlacementGroup } from "@shared-types/PlacementGroup";
import getSymbolFromCurrency from "currency-symbol-map";

type ChipColors = "default" | "primary" | "success" | "warning" | "danger";

const Info = () => {
  const { drive } = useOutletContext() as { drive: ExtendedDrive };
  console.log(drive); // Debugging line to check the drive object
  // Current date and time: 2025-04-12 17:20:56

  const isActive = () => {
    const now = new Date();
    const start = new Date(drive.applicationRange.start);
    const end = new Date(drive.applicationRange.end);
    return now >= start && now <= end;
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const end = new Date(drive.applicationRange.end);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStepProgress = () => {
    if (!drive.workflow?.steps) return 0;
    const completed = drive.workflow.steps.filter(
      (step: WorkflowStep) => step.status === "completed"
    ).length;
    return (completed / drive.workflow.steps.length) * 100;
  };

  const statusColors = {
    active: "success",
    inactive: "danger",
    pending: "warning",
    completed: "success",
    "in-progress": "primary",
    failed: "danger",
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "default";
  };

  const getTitleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case "CODING_ASSESSMENT":
        return <IconCode size={20} className="text-indigo-500" />;
      case "MCQ_ASSESSMENT":
        return <IconWriting size={20} className="text-blue-500" />;
      case "INTERVIEW":
        return <IconUserCheck size={20} className="text-emerald-500" />;
      case "RESUME_SCREENING":
        return <IconCertificate size={20} className="text-amber-500" />;
      case "ASSIGNMENT":
        return <IconDeviceLaptop size={20} className="text-purple-500" />;
      default:
        return <IconDeviceLaptop size={20} className="text-gray-500" />;
    }
  };

  const getStepStatusIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return <IconChecks size={16} className="text-emerald-500" />;
      case "in-progress":
        return <IconCalendarTime size={16} className="text-blue-500" />;
      case "pending":
        return <IconCalendarTime size={16} className="text-amber-500" />;
      case "failed":
        return <IconAlertCircle size={16} className="text-red-500" />;
      default:
        return <IconInfoCircle size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section with neutral color */}
      <Card className="shadow-sm overflow-hidden bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {drive.title}
              </h1>
              {drive.url && (
                <Tooltip content="View drive URL">
                  <a
                    href={drive.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <IconLink size={18} />
                  </a>
                </Tooltip>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Chip
                color={drive.published ? "success" : "warning"}
                variant="flat"
                size="sm"
                className="font-medium"
              >
                {drive.published ? "Published" : "Draft"}
              </Chip>
              <Chip
                color={isActive() ? "success" : "danger"}
                variant="flat"
                size="sm"
                className="font-medium"
              >
                {isActive() ? "Active" : "Inactive"}
              </Chip>
              <Chip
                color="default"
                variant="flat"
                size="sm"
                className="font-medium"
              >
                {getTitleCase(drive.type.replace("_", " "))}
              </Chip>
              {isActive() && (
                <Chip
                  color="secondary"
                  variant="flat"
                  size="sm"
                  className="font-medium"
                >
                  {getDaysRemaining()} days remaining
                </Chip>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <IconBuildingSkyscraper
                  className="text-gray-600 dark:text-gray-400"
                  size={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Company
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {drive.company && typeof drive.company === "object"
                    ? (drive.company as Company)?.name || "Name not available"
                    : drive.company || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <IconUserPlus
                  className="text-gray-600 dark:text-gray-400"
                  size={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Placement Group
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {drive.placementGroup &&
                  typeof drive.placementGroup === "object"
                    ? (drive.placementGroup as PlacementGroup)?.name ||
                      "Name not available"
                    : drive.placementGroup || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <IconMapPin
                  className="text-gray-600 dark:text-gray-400"
                  size={20}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {drive.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application period bar */}
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <IconCalendar className="text-gray-500" size={16} />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Application Period: {formatDate(drive.applicationRange.start)} -{" "}
                {formatDate(drive.applicationRange.end)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
              <span className="text-gray-500 dark:text-gray-400">
                Progress:
              </span>
              <div className="w-full sm:w-32 flex items-center gap-2">
                <Progress
                  value={
                    isActive()
                      ? ((new Date().getTime() -
                          new Date(drive.applicationRange.start).getTime()) /
                          (new Date(drive.applicationRange.end).getTime() -
                            new Date(drive.applicationRange.start).getTime())) *
                        100
                      : 100
                  }
                  size="sm"
                  color={isActive() ? "primary" : "default"}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Drive Details and Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Details Card */}
        <Card className="shadow-sm bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 h-auto">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Drive Details
            </h2>
          </div>

          <div className="p-5">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <IconMoneybag
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Salary Range
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {drive.salary.currency
                      ? getSymbolFromCurrency(drive.salary.currency)
                      : "$"}{" "}
                    {drive.salary.min?.toLocaleString()} -{" "}
                    {drive.salary.max?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <IconBriefcase
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Employment Type
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {getTitleCase(drive.type.replace("_", " "))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <IconUsers
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Openings
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {drive.openings}
                    </p>
                    {drive.hiredCandidates &&
                      drive.hiredCandidates.length > 0 && (
                        <Tooltip
                          content={`${drive.hiredCandidates.length} candidates hired`}
                        >
                          <Chip size="sm" color="success" variant="dot">
                            {drive.hiredCandidates.length} hired
                          </Chip>
                        </Tooltip>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <IconFilter
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {drive.skills && drive.skills.length > 0 ? (
                      drive.skills.slice(0, 3).map((skill, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="text-xs"
                        >
                          {skill}
                        </Chip>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        No skills specified
                      </span>
                    )}
                    {drive.skills && drive.skills.length > 3 && (
                      <Tooltip content={drive.skills.slice(3).join(", ")}>
                        <Chip size="sm" variant="flat" className="text-xs">
                          +{drive.skills.length - 3}
                        </Chip>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <IconCertificate
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ATS Status
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip
                      color={
                        getStatusColor(
                          drive.ats?.status || "danger"
                        ) as ChipColors
                      }
                      variant="flat"
                      size="sm"
                    >
                      {drive.ats?.status || "Not Configured"}
                    </Chip>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <IconCheckbox
                    className="text-gray-600 dark:text-gray-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Additional Fields
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {drive.additionalDetails ? (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        className="text-xs"
                      >
                        Configured
                      </Chip>
                    ) : (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="warning"
                        className="text-xs"
                      >
                        Not Configured
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Creation details */}
            <Divider className="my-4" />
            <div className="flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Created:{" "}
                {drive.createdAt ? formatDateTime(drive.createdAt) : "N/A"}
              </span>
              <span>
                Updated:{" "}
                {drive.updatedAt ? formatDateTime(drive.updatedAt) : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Statistics Card */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 h-full">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Statistics
                </h2>
                <IconChartBar size={18} className="text-gray-400 ml-2" />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Candidate stats */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <IconUsers
                        className="text-gray-600 dark:text-gray-400"
                        size={18}
                      />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Total Candidates
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {drive.candidates?.length || 0}
                  </p>
                  <Progress
                    value={
                      drive.candidates?.length && drive.openings
                        ? Math.min(
                            100,
                            (drive.candidates.length / drive.openings) * 100
                          )
                        : 0
                    }
                    color="primary"
                    size="sm"
                    className="mt-2"
                  />
                </div>

                {/* Assessment stats */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <IconDeviceLaptop
                        className="text-gray-600 dark:text-gray-400"
                        size={18}
                      />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Assessments
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {(drive.mcqAssessments?.length || 0) +
                      (drive.codeAssessments?.length || 0)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                      <IconWriting size={12} />
                      <span>MCQ: {drive.mcqAssessments?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                      <IconCode size={12} />
                      <span>Coding: {drive.codeAssessments?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Interview stats */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <IconMessage
                        className="text-gray-600 dark:text-gray-400"
                        size={18}
                      />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Interviews
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {drive.interviews?.length || 0}
                  </p>

                  {drive.offerLetters && drive.offerLetters.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                      <IconCertificate size={12} />
                      <span>Offer Letters: {drive.offerLetters.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Workflow Progress Section */}
      <Card className="shadow-sm bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Workflow Progress
            </h2>
            <Chip
              color={drive.workflow?.steps.length ? "primary" : "warning"}
              variant="flat"
              size="sm"
            >
              {drive.workflow?.steps.length || 0} steps
            </Chip>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {drive.workflow?.steps.filter(
                  (step) => step.status === "completed"
                ).length || 0}{" "}
                of {drive.workflow?.steps.length || 0}
              </span>
              <Progress
                value={getStepProgress()}
                color="primary"
                size="sm"
                className="w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drive.workflow?.steps.map((step, index) => (
              <div
                key={step._id || index}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-white dark:bg-gray-700 rounded-md">
                    {getStepIcon(step.type)}
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {step.name}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <Chip
                    color={getStatusColor(step.status) as ChipColors}
                    variant="flat"
                    size="sm"
                    className="font-medium"
                    startContent={getStepStatusIcon(step.status)}
                  >
                    {getTitleCase(step.status.replace("-", " "))}
                  </Chip>

                  {step.schedule?.startTime && (
                    <Tooltip content={formatDateTime(step.schedule.startTime)}>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <IconCalendarTime size={14} />
                        <span>{formatDate(step.schedule.startTime)}</span>
                      </div>
                    </Tooltip>
                  )}
                </div>

                {/* Schedule timeline visualization */}
                {step.schedule && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      {step.status === "completed" && (
                        <div
                          className="absolute inset-0 bg-green-500"
                          style={{ width: "100%" }}
                        ></div>
                      )}
                      {step.status === "in-progress" && (
                        <div
                          className="absolute inset-0 bg-blue-500"
                          style={{ width: "50%" }}
                        ></div>
                      )}
                    </div>

                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Start</span>
                      {step.status === "completed" &&
                        step.schedule.actualCompletionTime && (
                          <span>
                            Completed{" "}
                            {formatDate(step.schedule.actualCompletionTime)}
                          </span>
                        )}
                      {step.schedule.endTime &&
                        !step.schedule.actualCompletionTime && (
                          <span>Due {formatDate(step.schedule.endTime)}</span>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!drive.workflow?.steps || drive.workflow.steps.length === 0) && (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <IconInfoCircle
                size={24}
                className="mx-auto mb-2 text-gray-400"
              />
              <p className="text-gray-600 dark:text-gray-400">
                No workflow steps configured
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Info;
