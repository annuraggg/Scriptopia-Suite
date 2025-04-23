import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RootContext from "@/types/RootContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle } from "lucide-react";
import { Card, CardBody, Button, Badge, Tabs, Tab } from "@heroui/react";
import { Notification } from "@shared-types/Notification";

const Notifications = () => {
  const { notifications, setNotifications, user } =
    useOutletContext<RootContext>();
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // Function to format date as YYYY-MM-DD HH:MM:SS
  const formatDatetime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const markAsRead = (notificationId: string): void => {
    setNotifications(
      notifications.map((notification: Notification) => {
        if (notification._id === notificationId) {
          return {
            ...notification,
            readBy: [...(notification.readBy || []), user?.userId._id!],
          };
        }
        return notification;
      }),
      notificationId
    );
  };

  const filterNotifications = (tab: string): Notification[] => {
    switch (tab) {
      case "unread":
        return notifications.filter(
          (notification: Notification) =>
            !notification.readBy?.includes(user?.userId._id!)
        );
      case "read":
        return notifications.filter((notification: Notification) =>
          notification.readBy?.includes(user?.userId._id!)
        );
      case "all":
      default:
        return notifications;
    }
  };

  const isNotificationRead = (notification: Notification): boolean => {
    return notification.readBy?.includes(user?.userId._id!) || false;
  };

  const filteredNotifications = filterNotifications(selectedTab);

  return (
    <div className="mt-5 ml-5">
      <div className="flex justify-between items-center mt-6 pr-4">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
        </div>
        <Badge
          content={
            notifications.filter(
              (notification: Notification) =>
                !notification.readBy?.includes(user?.userId._id!)
            ).length
          }
          color="danger"
          shape="circle"
        >
          <Bell className="w-6 h-6" />
        </Badge>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key.toString())}
        aria-label="Notification tabs"
        color="primary"
        variant="underlined"
        className="mb-3 mt-2"
        classNames={{
          tabList: "gap-6",
          cursor: "w-full",
        }}
      >
        <Tab key="all" title="All" />
        <Tab key="unread" title="Unread" />
        <Tab key="read" title="Read" />
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
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification: Notification) => (
              <Card
                key={notification._id}
                className={`w-full ${
                  isNotificationRead(notification)
                    ? "bg-gray-50"
                    : "border-l-4 border-blue-500"
                }`}
                shadow="sm"
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="mb-1">
                        <h3 className="text-lg font-semibold">
                          {notification.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-400">
                          {formatDatetime(notification.createdAt?.toString()!)}
                        </span>
                        {!isNotificationRead(notification) && (
                          <Button
                            color="success"
                            variant="flat"
                            size="sm"
                            onClick={() => markAsRead(notification._id!)}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-gray-500">
                {selectedTab === "all"
                  ? "You don't have any notifications yet"
                  : selectedTab === "unread"
                  ? "You're all caught up!"
                  : "You haven't read any notifications yet"}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
