import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Posting } from "@shared-types/Posting";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@heroui/react";

const Layout = () => {
  const [posting, setPosting] = useState<Posting>({} as Posting);
  const [postingLoading, setPostingLoading] = useState(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    setPostingLoading(true);
    axios
      .get("/postings/" + window.location.pathname.split("/")[2])
      .then((res) => {
        setPosting(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      })
      .finally(() => {
        setPostingLoading(false);
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
        <Sidebar posting={posting} loading={postingLoading} />
        <div className="h-full w-full overflow-x-auto">
          {postingLoading ? <Loader /> : <Outlet context={{ posting, setPosting }} />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
