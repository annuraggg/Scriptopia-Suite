import { Card, CardBody, CardHeader, Chip, Avatar } from "@nextui-org/react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Clock, BriefcaseBusiness } from "lucide-react";

interface Activity {
  type: string;
  title?: string;
  status?: string;
  timestamp: string;
  publishedOn?: string;
  driveTitle?: string;
  candidateName?: string;
  candidateEmail?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "hired":
        return "success";
      case "rejected":
        return "danger";
      case "inprogress":
        return "primary";
      default:
        return "default";
    }
  };

  const getInitials = (name: string = "Unknown User") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (name: string = "") => {
    const colors = ["primary", "secondary", "success", "warning", "danger"];
    const index = name.length % colors.length;
    return colors[index];
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
            Recent Activity
          </h4>
          <Chip size="sm" variant="flat" color="primary">
            Last 24 hours
          </Chip>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors duration-150"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {activity.type === "drive_created" ? (
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <BriefcaseBusiness
                          size={16}
                          className="text-purple-500"
                        />
                      </div>
                    ) : (
                      <Avatar
                        name={getInitials(activity.candidateName)}
                        size="sm"
                        color={getRandomColor(activity.candidateName) as any}
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div>
                        {activity.type === "drive_created" ? (
                          <p className="text-gray-800">
                            New drive created:{" "}
                            <span className="font-medium">
                              {activity.title}
                            </span>
                          </p>
                        ) : (
                          <p className="text-gray-800">
                            Application submitted for{" "}
                            <span className="font-medium">
                              {activity.driveTitle}
                            </span>{" "}
                            by{" "}
                            <span className="font-medium">
                              {activity.candidateName}
                            </span>
                          </p>
                        )}
                      </div>
                      <Chip
                        size="sm"
                        color={getStatusColor(activity.status || "")}
                        variant="flat"
                        className="capitalize"
                      >
                        {activity.status}
                      </Chip>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
