import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import {
  ArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircle,
} from "lucide-react";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";

interface LogsTabProps {
  posting: ExtendedPosting;
}

const LogsTab: React.FC<LogsTabProps> = ({ posting }) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "finished":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLogLevelBadge = (level: string) => {
    const variants = {
      ERROR: "bg-red-100 text-red-800",
      WARNING: "bg-yellow-100 text-yellow-800",
      INFO: "bg-blue-100 text-blue-800",
    };
    return (
      variants[level as keyof typeof variants] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-screen">
        <Card className="overflow-hidden">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 ">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0. rounded-full text-sm font-medium ${getStatusColor(
                    posting.ats?.status
                  )}`}
                >
                  {posting.ats?.status || "Unknown"}
                </span>
              </div>
              <ArrowUpIcon className="h-5 w-5 text-gray-400 mb-2" />
            </div>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Success Rate
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  {posting.ats?.successCount || 0}
                  <span className="text-sm text-gray-500 ml-1">
                    /{" "}
                    {(posting.ats?.successCount || 0) +
                      (posting.ats?.failedCount || 0)}
                  </span>
                </p>
              </div>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Avg. Processing Time
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {posting.ats?.summary?.averageProcessingTime
                    ? `${(
                        posting.ats.summary.averageProcessingTime / 1000
                      ).toFixed(1)}s`
                    : "—"}
                </p>
              </div>
              <ClockIcon className="h-5 w-5 text-blue-500" />
            </div>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Errors</p>
                <p className="text-2xl font-semibold text-red-600">
                  {posting.ats?.failedCount || 0}
                </p>
              </div>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Logs Section */}
      <Card className="overflow-hidden">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Logs
          </h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-y-auto pr-4 max-h-[55vh]">
            <div className="space-y-4">
              {posting.ats?.logs?.map((log, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogLevelBadge(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {log.stage}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">{log.message}</p>

                  {log.error && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700">
                        {log.error.message}
                      </p>
                      {log.error.stack && (
                        <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-x-auto">
                          {log.error.stack}
                        </pre>
                      )}
                    </div>
                  )}

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Metadata
                      </p>
                      <pre className="text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </div>
                  )}

                  {index < (posting.ats?.logs?.length || 0) - 1 && (
                    <div className="h-px bg-gray-200 my-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LogsTab;
