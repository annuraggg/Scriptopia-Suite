import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import { PostingContext } from "@/types/PostingContext";
import { useState } from "react";

const Layout = () => {
  const { posting, refetch } = useOutletContext<PostingContext>();
  const [active, setActive] = useState("");

  return (
    <div className="">
      <div className="flex w-full h-screen">
        <Sidebar active={active} setActive={setActive} />
        <div className="h-full w-full overflow-x-auto overflow-y-auto">
          <Outlet context={{ posting, active, refetch }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
