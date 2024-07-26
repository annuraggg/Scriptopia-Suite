import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="">
      <div className="flex w-full">
        <Sidebar />

        <div className="h-full w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
