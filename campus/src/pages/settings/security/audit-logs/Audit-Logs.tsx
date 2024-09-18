import Sidebar from "../Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { Input } from "@nextui-org/react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";
import { AuditLog } from "@shared-types/Institute";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    axios
      .get("campus/settings")
      .then((res) => {
        setAuditLogs(res.data.data.auditLogs);
        setFilteredLogs(res.data.data.auditLogs);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Fetching Settings");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setFilteredLogs(auditLogs);
    } else {
      setFilteredLogs(
        auditLogs.filter((log) =>
          log.action.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/security"}>Security</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/security/audit-logs"}>
            Audit Logs
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 gap-5 items-center h-[94vh]">
        <Sidebar />
        <div className="h-[88vh] w-full overflow-y-auto pr-5">
          <div className="flex gap-3">
            <Input placeholder="Search Logs" onChange={filterInput} />
            <Select
              placeholder="Filter By Type"
              onSelectionChange={(key) => {
                if (key.currentKey === "All") {
                  setFilteredLogs(auditLogs);
                } else {
                  setFilteredLogs(auditLogs.filter((log) => log.type === key.currentKey?.toLowerCase()));
                }
              }}
            >
              <SelectSection>
                <SelectItem value="All" key={"All"}>
                  All
                </SelectItem>
                <SelectItem value="Info" key={"Info"}>
                  Info
                </SelectItem>
                <SelectItem value="Warning" key={"Warning"}>
                  Warning
                </SelectItem>
                <SelectItem value="Error" key={"Error"}>
                  Error
                </SelectItem>
                <SelectItem value="Success" key={"Success"}>
                  Success
                </SelectItem>
              </SelectSection>
            </Select>
          </div>
          {filteredLogs?.length === 0 && (
            <p className="text-center mt-5">No Logs Found</p>
          )}
          {filteredLogs?.map((log) => (
            <div
              className={`flex border py-3 gap-3 px-5 mt-3 rounded-xl w-full relative items-center bg-opacity-10
                ${log.type === "info"
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
              <p className="absolute right-5 text-xs opacity-50">
                {log?.date ? new Date(log.date).toLocaleString() : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
