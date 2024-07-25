import { Outlet } from "react-router-dom";
import ParentSidebar from "@/components/Sidebar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="">
      <div className="flex w-full">
        <ParentSidebar />
        <Sidebar />
        <div className="h-full w-full overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
