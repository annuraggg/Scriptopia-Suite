import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  type: string;
  driveTitle: string;
  date: string;
  daysRemaining: number;
}

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getEventTypeLabel = (type: string) => {
    return type === "application_deadline"
      ? "Application Deadline"
      : "Drive Start";
  };

  const getEventColor = (type: string) => {
    return type === "application_deadline" ? "warning" : "primary";
  };

  const getBackgroundColor = (daysRemaining: number) => {
    if (daysRemaining <= 1) return "bg-red-50";
    if (daysRemaining <= 3) return "bg-amber-50";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden h-full">
        <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Upcoming Events
          </h4>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className={`py-4 px-6 flex items-center justify-between ${getBackgroundColor(
                  event.daysRemaining
                )} hover:bg-gray-50 transition-colors duration-150`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-gray-100 rounded-full">
                    <Calendar size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {event.driveTitle}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Chip
                        size="sm"
                        color={getEventColor(event.type)}
                        variant="flat"
                        className="mr-2"
                      >
                        {getEventTypeLabel(event.type)}
                      </Chip>
                      <span>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {event.daysRemaining <= 3 && (
                    <AlertCircle size={16} className="mr-2 text-red-500" />
                  )}
                  <div
                    className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      event.daysRemaining <= 1
                        ? "bg-red-100 text-red-800"
                        : event.daysRemaining <= 3
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <Clock size={12} className="mr-1" />
                    <span>
                      {event.daysRemaining} day
                      {event.daysRemaining !== 1 ? "s" : ""} remaining
                    </span>
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
