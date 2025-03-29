import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const JobsLayout = () => {
  return (
    <>
      <div className="">
        <div className="flex w-full">
          <Sidebar />

          <div className="h-full w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsLayout;
