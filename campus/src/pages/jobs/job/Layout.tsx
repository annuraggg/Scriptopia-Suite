import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const Layout = () => {
  const [drive, setDrive] = useState<any[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    axios
      .get("/drives")
      .then((res) => {
        setDrive(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
  }, []);

  return (
    <div className="">
      <div className="flex w-full">
        <Sidebar drive={drive} />
        <div className="h-full w-full overflow-x-auto">
          <Outlet context={{ drive }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
