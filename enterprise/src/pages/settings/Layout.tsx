import { Outlet } from "react-router-dom";
import ParentSidebar from "@/components/Sidebar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

const Layout = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const fetchSettings = async () => {
    try {
      const res = await axios.get("organizations/settings");
      setSettings(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex w-full">
        <ParentSidebar />
        <Sidebar />
        <div className="h-full w-full overflow-x-auto">
          {loading ? "Loading..." : <Outlet context={settings} />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
