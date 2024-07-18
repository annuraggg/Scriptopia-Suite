import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="flex gap-5 h-full w-full">
        <Sidebar />
        <div className="ml-14 h-full w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
