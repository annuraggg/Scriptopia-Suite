import Sidebar from "../Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { TrashIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useOutletContext } from "react-router-dom";
import { SettingsContext } from "@/types/SettingsContext";

const Data = () => {
  const { organization } = useOutletContext() as SettingsContext;
  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{organization.name}</BreadcrumbItem>
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
