import { RootState } from "@/@types/reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Notifications = () => {
  const notifications = [
    {
      id: "1",
      type: "success",
      message: "Your profile has been updated successfully.",
      timestamp: "15/07/2024 10:30:00",
    },
    {
      id: "2",
      type: "error",
      message: "Failed to save your changes. Please try again.",
      timestamp: "15/07/2024 11:00:00",
    },
    {
      id: "3",
      type: "info",
      message: "A new version of the app is available. Please update.",
      timestamp: "15/07/2024 12:15:00",
    },
    {
      id: "4",
      type: "warning",
      message: "Your password will expire in 5 days. Please update it.",
      timestamp: "15/07/2024 13:45:00",
    },
    {
      id: "5",
      type: "success",
      message: "You have successfully logged out.",
      timestamp: "15/07/2024 14:00:00",
    },
    {
      id: "6",
      type: "info",
      message: "You have a new message in your inbox.",
      timestamp: "15/07/2024 15:30:00",
    },
    {
      id: "7",
      type: "error",
      message:
        "Unable to fetch data from the server. Please check your connection.",
      timestamp: "15/07/2024 16:00:00",
    },
    {
      id: "8",
      type: "warning",
      message: "Your account is nearing its storage limit.",
      timestamp: "15/07/2024 17:15:00",
    },
    {
      id: "9",
      type: "success",
      message: "Your payment was processed successfully.",
      timestamp: "15/07/2024 18:00:00",
    },
    {
      id: "10",
      type: "info",
      message: "New features have been added to your dashboard.",
      timestamp: "15/07/2024 19:00:00",
    },
    {
      id: "11",
      type: "error",
      message: "An error occurred while updating your profile.",
      timestamp: "16/07/2024 08:00:00",
    },
    {
      id: "12",
      type: "success",
      message: "Your subscription has been renewed successfully.",
      timestamp: "16/07/2024 09:30:00",
    },
    {
      id: "13",
      type: "warning",
      message: "Your session is about to expire. Save your work.",
      timestamp: "16/07/2024 10:15:00",
    },
    {
      id: "14",
      type: "info",
      message: "Maintenance scheduled for tomorrow from 2 PM to 4 PM.",
      timestamp: "16/07/2024 11:00:00",
    },
    {
      id: "15",
      type: "success",
      message: "Your file has been uploaded successfully.",
      timestamp: "16/07/2024 12:30:00",
    },
    {
      id: "16",
      type: "error",
      message: "Access denied. You do not have permission to view this page.",
      timestamp: "16/07/2024 13:00:00",
    },
    {
      id: "17",
      type: "warning",
      message:
        "High memory usage detected. Consider closing some applications.",
      timestamp: "16/07/2024 14:30:00",
    },
    {
      id: "18",
      type: "info",
      message: "A new comment has been posted on your article.",
      timestamp: "16/07/2024 15:00:00",
    },
    {
      id: "19",
      type: "success",
      message: "Your changes have been saved successfully.",
      timestamp: "16/07/2024 16:00:00",
    },
    {
      id: "20",
      type: "error",
      message: "Failed to connect to the server. Please try again later.",
      timestamp: "16/07/2024 17:30:00",
    },
  ];
  const org = useSelector((state: RootState) => state.organization);

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/notifications"}>
            Notifications
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-5 flex flex-col items-center justify-center w-full">
        {notifications?.map((notif) => (
          <div
            key={notif.id}
            className="border py-3 px-5 mt-3 rounded-xl w-[50%] text-gray-400"
          >
            {notif.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default Notifications;
