import { motion } from "framer-motion";
import MainCalendar from "./MainCalendar";
import { RootState } from "@/@types/reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";

const Calendar = () => {
  const org = useSelector((state: RootState) => state.organization);
  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/calendar"}>
            Calendar
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <div className="p-5 px-10">
          <MainCalendar />
        </div>
      </motion.div>
    </>
  );
};

export default Calendar;
