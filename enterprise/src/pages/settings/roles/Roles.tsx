import { RootState } from "@/@types/reducer";
import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Roles = () => {
  const org = useSelector((state: RootState) => state.organization);
  const builtInRoles = [
    {
      _id: "1",
      name: "Admin",
      description: "Admins can do anything",
    },
    {
      _id: "2",
      name: "Hiring Manager",
      description: "Hiring Managers can view and edit data",
    },
    {
      _id: "3",
      name: "Finance",
      description: "Finance can view and edit financial data",
    },
    { _id: "4", name: "Read Only", description: "Read Only can view data" },
  ];

  const customRoles = [
    {
      _id: "5",
      name: "Custom Role 1",
      description: "Custom Role 1 can do something",
    },
    {
      _id: "6",
      name: "Custom Role 2",
      description: "Custom Role 2 can do something",
    },
  ];

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
