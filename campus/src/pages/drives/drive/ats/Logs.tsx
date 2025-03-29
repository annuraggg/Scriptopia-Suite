import React from "react";
import {
  ArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { ExtendedDrive } from "@shared-types/ExtendedDrive";

interface LogsTabProps {
  drive: ExtendedDrive;
}

const LogsTab: React.FC<LogsTabProps> = ({ drive }) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "finished":
        return "bg-green-50 text-green-700 border border-green-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "failed":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getLogLevelBadge = (level: string) => {
    const variants = {
      ERROR: "bg-red-50 text-red-700 border border-red-200",
      WARNING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      INFO: "bg-blue-50 text-blue-700 border border-blue-200",
    };
    return (
      variants[level as keyof typeof variants] ||
      "bg-gray-50 text-gray-700 border border-gray-200"
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <Card className="shadow-sm transition-shadow duration-300">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Status
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    drive.ats?.status
                  )}`}
                >
                  {drive.ats?.status || "Unknown"}
                </span>
              </div>
              <ArrowUpIcon className="h-5 w-5 text-gray-400" />
            </div>
          </CardBody>
        </Card>

        {/* Success Rate Card */}
        <Card className="shadow-sm transition-shadow duration-300">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </p>
                <p className="text-xl font-semibold text-green-600">
                  {drive.ats?.successCount || 0}
                  <span className="text-sm text-gray-500 ml-1">
                    /{" "}
                    {(drive.ats?.successCount || 0) +
                      (drive.ats?.failedCount || 0)}
                  </span>
                </p>
              </div>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
          </CardBody>
        </Card>

        {/* Processing Time Card */}
        <Card className="shadow-sm transition-shadow duration-300">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Processing Time
                </p>
                <p className="text-xl font-semibold text-blue-600">
                  {drive.ats?.summary?.averageProcessingTime
                    ? `${(
                        drive.ats.summary.averageProcessingTime / 1000
                      ).toFixed(1)}s`
                    : "—"}
                </p>
              </div>
              <ClockIcon className="h-5 w-5 text-blue-500" />
            </div>
          </CardBody>
        </Card>

        {/* Errors Card */}
        <Card className="shadow-sm transition-shadow duration-300">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Errors
                </p>
                <p className="text-xl font-semibold text-red-600">
                  {drive.ats?.failedCount || 0}
                </p>
              </div>
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Logs Section */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900">
            Processing Logs
          </h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200">
            {drive.ats?.logs
              ?.slice()
              .reverse()
              .map((log, index) => (
                <div
                  key={index}
                  className="p-4 transition-colors duration-150"
                >
                  {/* Log Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogLevelBadge(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {log.stage}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Log Message */}
                  <p className="text-sm text-gray-800 mb-2">{log.message}</p>

                  {/* Error Details */}
                  {log.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                      <p className="text-sm text-red-800 font-medium">
                        {log.error.message}
                      </p>
                      {log.error.stack && (
                        <pre className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded overflow-x-auto">
                          {log.error.stack}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Metadata
                      </p>
                      <pre className="text-xs text-gray-800 overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LogsTab;
