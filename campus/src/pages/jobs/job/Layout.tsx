import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Drive } from "@shared-types/Drive";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/react";

const Layout = () => {
  const [drive, setPosting] = useState<Drive>({} as Drive);
  const [driveLoading, setDriveLoading] = useState(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    setDriveLoading(true);
    axios
      .get("/drives/" + window.location.pathname.split("/")[2])
      .then((res) => {
        setPosting(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      })
      .finally(() => {
        setDriveLoading(false);
      });
  }, []);

  const Loader = () => {
    return (
      <div className="flex items-center justify-center h-[100vh] w-full z-50">
        <Spinner color="danger" />
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex w-full">
        <Sidebar drive={drive} loading={driveLoading} />
        <div className="h-full w-full overflow-x-auto">
          {driveLoading ? <Loader /> : <Outlet context={{ drive }} />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
