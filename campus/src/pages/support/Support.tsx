import { RootState } from "@/types/Reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Support = () => {
  const org = useSelector((state: RootState) => state.institute);
  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/support"}>Support</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-10 flex items-center justify-center flex-col">
        <div className="p-5 border rounded-xl text-center font-neue">
          <h4>Page Under Construction</h4>
          <p>Meanwhile, you can contact us at support@scriptopia.tech</p>
        </div>
      </div>
    </>
  );
};

export default Support;
