import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="flex gap-5 h-full">
        <Sidebar />
        <div className="p-10 h-full w-full pt-0">
        <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
