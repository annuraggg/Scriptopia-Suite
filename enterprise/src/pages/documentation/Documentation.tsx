import { RootState } from "@/@types/reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Documentation = () => {
  const org = useSelector((state: RootState) => state.organization);
  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/documentation"}>
            Documentation
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-10 flex items-center justify-center flex-col">
        <div className="p-5 border rounded-xl text-center font-neue">
          <h4>Page Under Construction</h4>
          <p>We are working on this page. Thankyou for your patience.</p>
        </div>
      </div>
    </>
  );
};

export default Documentation;
