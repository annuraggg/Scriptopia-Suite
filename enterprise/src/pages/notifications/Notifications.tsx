import { useState } from "react";
import { RootState } from "@/types/Reducer";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "deadline",
    title: "Senior Developer Interview",
    description:
      "Upcoming interview with John Doe for Senior Developer position",
    date: "2024-12-22T10:00:00",
    dueDate: "2024-12-22T10:00:00",
    read: false,
    priority: "high",
    candidateAvatar: "/api/placeholder/32/32",
    candidateName: "John Doe",
  },
  {
    id: "2",
    type: "message",
    title: "New Message from HR",
    description:
      "Review updated job description for Frontend Developer position",
    date: "2024-12-21T15:30:00",
    read: false,
    priority: "medium",
    sender: "Sarah Wilson",
    senderAvatar: "/api/placeholder/32/32",
  },
  {
    id: "3",
    type: "review",
    title: "Candidate Assessment Pending",
    description: "Technical assessment review pending for UI/UX Designer role",
    date: "2024-12-21T09:15:00",
    dueDate: "2024-12-23T23:59:59",
    read: false,
    priority: "low",
    candidateName: "Emma Thompson",
  },
  {
    id: "4",
    type: "deadline",
    title: "Job Posting Expiry",
    description: "Full Stack Developer position expires in 2 days",
    date: "2024-12-20T14:20:00",
    dueDate: "2024-12-23T23:59:59",
    read: false,
    priority: "medium",
  },
];

const Notifications = () => {
  const org = useSelector((state: RootState) => state.organization);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedTab, setSelectedTab] = useState("all");

  const getTimeLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const hours = Math.ceil(diff / (1000 * 60 * 60));

    if (days > 1) return `${days} days left`;
    if (hours > 0) return `${hours} hours left`;
    return "Overdue";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Calendar className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "review":
        return <Clock className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const filterNotifications = (tab: string) => {
    if (tab === "all") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => !n.read && n.type === tab);
  };

  return (
    <div className="mt-5 ml-5">
      <Breadcrumbs>
        <BreadcrumbItem>{org.name}</BreadcrumbItem>
        <BreadcrumbItem>Notifications</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-between items-center mt-6 pr-4">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="text-gray-500 mt-2">
            Stay updated with your latest activities
          </p>
        </div>
        <Badge
          content={notifications.filter((n) => !n.read).length}
          color="danger"
          shape="circle"
        >
          <Bell className="w-6 h-6" />
        </Badge>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        aria-label="Notification tabs"
        color="primary"
        variant="underlined"
        className="mb-3 mt-2"
        classNames={{
          tabList: "gap-6",
          cursor: "w-full",
        }}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>All</span>
            </div>
          }
        />
        <Tab
          key="deadline"
          title={
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Deadlines</span>
            </div>
          }
        />
        <Tab
          key="message"
          title={
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </div>
          }
        />
        <Tab
          key="review"
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Reviews</span>
            </div>
          }
        />
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 pr-3"
        >
          {filterNotifications(selectedTab).map((notification) => (
            <Card key={notification.id} className="w-full" shadow="sm">
              <CardBody className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Chip
                      color={getPriorityColor(notification.priority)}
                      variant="flat"
                      radius="lg"
                      className="p-2"
                    >
                      {getNotificationIcon(notification.type)}
                    </Chip>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">
                        {notification.title}
                      </h3>
                      {notification.dueDate && (
                        <Chip
                          color={
                            getTimeLeft(notification.dueDate).includes(
                              "Overdue"
                            )
                              ? "danger"
                              : "warning"
                          }
                          variant="flat"
                          size="sm"
                        >
                          {getTimeLeft(notification.dueDate)}
                        </Chip>
                      )}
                    </div>

                    <p className="text-gray-600 mb-2">
                      {notification.description}
                    </p>

                    {notification.candidateName && (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar
                          src={notification.candidateAvatar}
                          name={notification.candidateName}
                          size="sm"
                        />
                        <span className="text-sm text-gray-500">
                          {notification.candidateName}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-400">
                        {new Date(notification.date).toLocaleString()}
                      </span>
                      <Tooltip content="Mark as read">
                        <Button
                          color="success"
                          variant="flat"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Read
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {filterNotifications(selectedTab).length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No new notifications</h3>
              <p className="text-sm text-gray-500">You're all caught up!</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
