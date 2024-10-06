import { RootState } from "@/types/Reducer";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useSelector } from "react-redux";

const Analytics = () => {
  const org = useSelector((state: RootState) => state.organization);

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/analytics"}>Analytics</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-xl opacity-70">Analytics Not Available Yet.</p>
      </div>
    </>
  );
};

export default Analytics;
