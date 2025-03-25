import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import { RootContext } from "@/types/RootContext";

const Layout = () => {
  const { institute, setInstitute, user } = useOutletContext() as RootContext;

  return (
    <div className="">
      <div className="flex w-full">
        <Sidebar />
        <div className="h-full w-full overflow-x-auto">
          <Outlet
            context={{
              institute: institute,
              setInstitute: setInstitute,
              user,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
