import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Candidate } from "@shared-types/Candidate";

const Layout = () => {
  const { user, setUser } = useOutletContext() as { user: Candidate, setUser: (user: Candidate) => void };

  return (
    <>
      <div className="">
        <div className="flex w-full">
          <Sidebar />

          <div className="h-full w-full">
            <Outlet context={{ user, setUser }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
