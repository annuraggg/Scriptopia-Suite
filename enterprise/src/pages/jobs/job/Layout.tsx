import { Outlet } from "react-router-dom";
import ParentSidebar from "@/components/Sidebar";
import Sidebar from "./Sidebar";
import { Posting } from "@shared-types/Posting";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Layout = () => {
  const [posting, setPosting] = useState<Posting>({} as Posting);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    axios
      .get("/postings/" + window.location.pathname.split("/")[2])
      .then((res) => {
        setPosting(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
  }, []);

  return (
    <div className="">
      <div className="flex w-full">
        <ParentSidebar />
        <Sidebar posting={posting} />
        <div className="h-full w-full overflow-x-auto">
          <Outlet context={{ posting }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
