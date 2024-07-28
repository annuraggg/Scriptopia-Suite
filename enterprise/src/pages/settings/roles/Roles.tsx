import { RootState } from "@/@types/reducer";
import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Role from "@/@types/Roles";

const Roles = () => {
  const org = useSelector((state: RootState) => state.organization);
  const [builtInRoles, setBuiltInRoles] = useState<Role[]>([]);
  const [customRoles, setCustomRoles] = useState<Role[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .post("organizations/get/settings")
      .then((res) => {
        setBuiltInRoles(res.data.data.roles.filter((role: Role) => role.default));
        setCustomRoles(res.data.data.roles.filter((role: Role) => !role.default));
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
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/settings"}>
            Settings
          </BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/settings/roles"}>
            Roles
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 items-center h-[94vh] ">
        <Sidebar builtInRoles={builtInRoles} customRoles={customRoles} />
      </div>
    </div>
  );
};

export default Roles;
