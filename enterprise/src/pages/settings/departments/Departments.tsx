import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Department } from "@/@types/Organization";

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .post("organizations/get/settings")
      .then((res) => {
        setDepartments(res.data.data.departments);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Fetching Settings");
      });
  }, []);

  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/departments"}>
            Departments
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 items-center h-[94vh] ">
        <Sidebar departments={departments} />
      </div>
    </div>
  );
};

export default Departments;
