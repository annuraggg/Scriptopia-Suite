import { RootContext } from "@/types/RootContext";
import { useOutletContext } from "react-router-dom";
import { Card, CardBody, Avatar, Chip } from "@nextui-org/react";
import { Bell, CheckCircle, UserCheck, Clock } from "lucide-react";

const Dashboard = () => {
  const { notifications, user } = useOutletContext<RootContext>();

  // Count unread notifications
  const unreadCount =
    notifications?.filter((notif) => !notif.readBy?.includes(user?.user!))
      .length || 0;

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            name={user?.email?.charAt(0).toUpperCase()}
            size="lg"
            color="primary"
            className="text-white"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.email}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Chip
                size="sm"
                color="primary"
                variant="flat"
                className="capitalize"
              >
                {user?.role}
              </Chip>
              <Chip
                size="sm"
                color="success"
                variant="flat"
                className="capitalize"
              >
                {user?.status}
              </Chip>
            </div>
          </div>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="shadow-sm border border-gray-100">
          <CardBody className="py-5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-blue-50">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Notifications
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {notifications?.length || 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardBody className="py-5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Permissions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {user?.permissions?.length || 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardBody className="py-5">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-purple-50">
                <UserCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Role</p>
                <p className="text-2xl font-bold text-gray-800 capitalize">
                  {user?.role || "N/A"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Notifications */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Recent Notifications
        </h2>
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <Card
              key={notification._id}
              className="shadow-sm border border-gray-100"
            >
              <CardBody className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt!).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <Chip
                    size="sm"
                    color={
                      notification.readBy?.includes(user?.user!)
                        ? "default"
                        : "warning"
                    }
                    variant={
                      notification.readBy?.includes(user?.user!)
                        ? "flat"
                        : "solid"
                    }
                  >
                    {notification.readBy?.includes(user?.user!)
                      ? "Read"
                      : "Unread"}
                  </Chip>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Your Permissions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Your Permissions
        </h2>
        <Card className="shadow-sm border border-gray-100">
          <CardBody className="p-5">
            <div className="flex flex-wrap gap-2">
              {user?.permissions?.map((permission, index) => (
                <Chip
                  key={index}
                  color="primary"
                  variant="flat"
                  className="capitalize"
                  size="sm"
                >
                  {permission.replace(/_/g, " ")}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
