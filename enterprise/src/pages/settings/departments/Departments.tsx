import { RootState } from "@/@types/reducer";
import Sidebar from "./Sidebar";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Departments = () => {
  const org = useSelector((state: RootState) => state.organization);

  const departments = [
    {
      _id: "1",
      name: "Engineering",
      description: "Engineering department",
    },
    {
      _id: "2",
      name: "Marketing",
      description: "Marketing department",
    },
    {
      _id: "3",
      name: "Sales",
      description: "Sales department",
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
          <BreadcrumbItem href={"/" + org._id + "/settings/departments"}>
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
