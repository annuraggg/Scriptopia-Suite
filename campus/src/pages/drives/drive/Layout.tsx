import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Drive } from "@shared-types/Drive";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@heroui/spinner";

const Layout = () => {
  const [drive, setDrive] = useState<Drive>({} as Drive);
  const [driveLoading, setDriveLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    setDriveLoading(true);
    axios
      .get("/drives/" + window.location.pathname.split("/")[2])
      .then((res) => {
        console.log(res.data.data);
        setDrive(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Something went wrong");
        console.log(err);
      })
      .finally(() => {
        setDriveLoading(false);
      });
  }, [refetch]);

  const refetchData = () => {
    setRefetch((prev) => !prev);
  };

  const Loader = () => {
    return (
      <div className="flex items-center justify-center h-[100vh] w-full z-50">
        <Spinner color="danger" />
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex w-full h-screen">
        <Sidebar drive={drive} loading={driveLoading} />
        <div className="h-full w-full overflow-x-auto overflow-y-auto">
          {driveLoading ? (
            <Loader />
          ) : (
            <Outlet context={{ drive, setDrive, refetch: refetchData }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
