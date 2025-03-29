import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import { DriveContext } from "@/types/DriveContext";
import { useState } from "react";

const Layout = () => {
  const { drive, refetch } = useOutletContext<DriveContext>();
  const [active, setActive] = useState("");

  return (
    <div className="">
      <div className="flex w-full h-screen">
        <Sidebar active={active} setActive={setActive} />
        <div className="h-full w-full overflow-x-auto overflow-y-auto">
          <Outlet context={{ drive, active, refetch }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
