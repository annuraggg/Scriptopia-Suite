import { RootState } from "@/@types/reducer";
import Sidebar from "../Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { Input } from "@nextui-org/react";

const auditLogs = [
  {
    id: "1",
    action: "User Created",
    type: "info",
    user: "John Doe",
    date: "15/07/2024",
  },
  {
    id: "2",
    action: "Item Deleted",
    type: "warning",
    user: "Jane Smith",
    date: "16/07/2024",
  },
  {
    id: "3",
    action: "Password Changed",
    type: "info",
    user: "Alice Johnson",
    date: "17/07/2024",
  },
  {
    id: "4",
    action: "File Uploaded",
    type: "info",
    user: "Robert Brown",
    date: "18/07/2024",
  },
  {
    id: "5",
    action: "User Deleted",
    type: "error",
    user: "Emily Wilson",
    date: "19/07/2024",
  },
  {
    id: "6",
    action: "Item Updated",
    type: "info",
    user: "Michael Davis",
    date: "20/07/2024",
  },
  {
    id: "7",
    action: "User Logged In",
    type: "info",
    user: "Sophia Clark",
    date: "21/07/2024",
  },
  {
    id: "8",
    action: "User Logged Out",
    type: "info",
    user: "Daniel Lee",
    date: "22/07/2024",
  },
  {
    id: "9",
    action: "File Downloaded",
    type: "info",
    user: "Grace Martinez",
    date: "23/07/2024",
  },
  {
    id: "10",
    action: "Item Created",
    type: "info",
    user: "Olivia Garcia",
    date: "24/07/2024",
  },
  {
    id: "11",
    action: "User Profile Updated",
    type: "info",
    user: "Noah Hernandez",
    date: "25/07/2024",
  },
  {
    id: "12",
    action: "Permission Granted",
    type: "info",
    user: "Liam Martinez",
    date: "26/07/2024",
  },
  {
    id: "13",
    action: "User Role Updated",
    type: "info",
    user: "Ava Wilson",
    date: "27/07/2024",
  },
  {
    id: "14",
    action: "File Deleted",
    type: "warning",
    user: "Ethan White",
    date: "28/07/2024",
  },
  {
    id: "15",
    action: "Item Archived",
    type: "info",
    user: "Mia Thompson",
    date: "29/07/2024",
  },
  {
    id: "16",
    action: "User Suspended",
    type: "error",
    user: "James Harris",
    date: "30/07/2024",
  },
  {
    id: "17",
    action: "Item Restored",
    type: "info",
    user: "Isabella Scott",
    date: "31/07/2024",
  },
  {
    id: "18",
    action: "User Approved",
    type: "info",
    user: "Alexander Green",
    date: "01/08/2024",
  },
  {
    id: "19",
    action: "Item Checked",
    type: "info",
    user: "Charlotte Martin",
    date: "02/08/2024",
  },
  {
    id: "20",
    action: "User Unlocked",
    type: "info",
    user: "William Davis",
    date: "03/08/2024",
  },
];

const AuditLogs = () => {
  const org = useSelector((state: RootState) => state.organization);

  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/settings"}>
            Settings
          </BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/settings/security"}>
            Security
          </BreadcrumbItem>
          <BreadcrumbItem
            href={"/" + org._id + "/settings/security/audit-logs"}
          >
            Audit Logs
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 gap-5 items-center h-[94vh]">
        <Sidebar />
        <div className="h-[88vh] w-full overflow-y-auto pr-5">
          <Input placeholder="Search Logs" />
          {auditLogs?.map((log) => (
            <div
              className={`flex border py-3 gap-3 px-5 mt-3 rounded-xl w-full relative items-center bg-opacity-10
                ${
                  log.type === "info"
                    ? "bg-blue-500"
                    : log.type === "warning"
                    ? "bg-yellow-500"
                    : log.type === "error"
                    ? "bg-red-500"
                    : log.type === "success"
                    ? "bg-success-500"
                    : ""
                }
                `}
            >
              {log.type === "info" && <Info className="text-blue-500" />}
              {log.type === "warning" && (
                <CircleAlert className="text-yellow-500" />
              )}
              {log.type === "error" && <CircleX className="text-red-500" />}
              {log.type === "success" && (
                <CircleCheck className="text-green-500" />
              )}

              <div>
                <p>{log.action}</p>
                <p className="text-xs opacity-50">User: {log.user}</p>
              </div>
              <p className="absolute right-5 text-xs opacity-50">{log.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
