import { motion } from "framer-motion";
import { RootState } from "@/types/Reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Documentation = () => {
  const org = useSelector((state: RootState) => state.institute);
  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/documentation"}>Documentation</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <div className="p-10 flex items-center justify-center flex-col">
          <div className="p-5 border rounded-xl text-center font-neue">
            <h4>Page Under Construction</h4>
            <p>We are working on this page. Thankyou for your patience.</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Documentation;
