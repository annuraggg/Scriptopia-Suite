import Sidebar from "../Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { TrashIcon } from "lucide-react";
import { Button, Divider } from "@nextui-org/react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { AuditLog } from "@/@types/Organization";

const Data = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {}, []);

  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/security"}>Security</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/security/data"}>Data</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 gap-5 items-center h-[94vh]">
        <Sidebar />
        <div className="h-[88vh] w-full overflow-y-auto pr-5 bg-card border p-5 rounded-xl">
          <h4>Your Data</h4>
          <Divider className="my-5" />
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <TrashIcon />
              <div>
                <p>Delete Organization</p>
                <p className="text-warning-500 opacity-70 text-sm">
                  Warning: This action cannot be undone
                </p>
              </div>
            </div>
            <Button variant="flat" color="danger">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
