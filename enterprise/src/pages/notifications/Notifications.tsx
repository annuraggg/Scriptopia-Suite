import ax from "@/config/axios";
import { RootState } from "@/types/Reducer";
import { useAuth } from "@clerk/clerk-react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Button, Tooltip } from "@nextui-org/react";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const org = useSelector((state: RootState) => state.organization);
  const ogNotifications = useOutletContext() as Notification[];

  useEffect(() => {
    setNotifications(ogNotifications);
  }, [ogNotifications]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const readNotification = (id: string) => {
    const updatedNotifications = notifications.map((notif) => {
      if (notif._id === id) {
        return { ...notif, read: true };
      }
      return notif;
    });

    setNotifications(updatedNotifications);

    axios
      .post("/organizations/notifications/read", { id })
      .then((res) => console.log(res.data.data))
      .catch((err) => {
        toast.error("Failed to mark as read");
        console.error(err);
        setNotifications(notifications);
      });
  };

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/notifications"}>Notifications</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-5 flex flex-col justify-center w-full items-center">
        {notifications
          ?.filter((notif) => !notif.read)
          .map((notif) => (
            <div className="flex justify-between border py-3 px-5 mt-3 rounded-xl w-[50%] items-center">
              <div key={notif._id} className="">
                <p className="text-xs opacity-50">
                  {new Date(notif.date).toLocaleString()}
                </p>
                <p className="text-xl mt-2">{notif.title}</p>
                <p className="text-sm">{notif.description}</p>
              </div>
              <Tooltip content="Mark As Read">
                <Button
                  color="success"
                  isIconOnly
                  variant="flat"
                  onClick={() => readNotification(notif._id)}
                >
                  <Check />
                </Button>
              </Tooltip>
            </div>
          ))}
      </div>
    </>
  );
};

export default Notifications;
