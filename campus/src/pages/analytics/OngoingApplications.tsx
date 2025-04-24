import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Progress,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Badge,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";

interface Application {
  driveId: string;
  driveTitle: string;
  applicationDeadline: string;
  totalApplications: number;
  inProgress: number;
  rejected: number;
  hired: number;
  pending: number;
}

interface OngoingApplicationsProps {
  applications: Application[];
}

export default function OngoingApplications({
  applications,
}: OngoingApplicationsProps) {
  const isDeadlineSoon = (deadlineDate: string) => {
    const deadline = new Date(deadlineDate);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800">
            Ongoing Applications
          </h4>
          <span className="text-sm text-gray-500">
            {applications.length} active drives
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              aria-label="Ongoing applications"
              classNames={{
                th: "bg-gray-50 text-gray-600 text-xs uppercase tracking-wider py-3",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>DRIVE</TableColumn>
                <TableColumn>TOTAL</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>DEADLINE</TableColumn>
              </TableHeader>
              <TableBody>
                {applications.map((app, index) => (
                  <TableRow
                    key={app.driveId}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-800">
                        {app.driveTitle}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color="primary" variant="flat">
                        {app.totalApplications}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex justify-between text-xs mb-2 text-gray-600">
                          <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                            In Progress: {app.inProgress}
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            Hired: {app.hired}
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                            Rejected: {app.rejected}
                          </span>
                        </div>
                        <Progress
                          value={
                            app.totalApplications > 0
                              ? (app.hired / app.totalApplications) * 100
                              : 0
                          }
                          color="success"
                          size="sm"
                          radius="sm"
                          classNames={{
                            track: "bg-gray-200",
                            indicator:
                              "bg-gradient-to-r from-blue-400 to-green-500",
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span
                          className={`text-sm ${
                            isDeadlineSoon(app.applicationDeadline)
                              ? "text-red-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {new Date(
                            app.applicationDeadline
                          ).toLocaleDateString()}
                        </span>
                        {isDeadlineSoon(app.applicationDeadline) && (
                          <Tooltip content="Deadline approaching soon">
                            <span>
                              <AlertCircle
                                size={16}
                                className="ml-2 text-red-500"
                              />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
