import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ax from "@/config/axios";
import { toast } from "sonner";
import Loader from "./Loader";
import { Candidate } from "@shared-types/Candidate";

const Layout = () => {
  const { getToken } = useAuth();
  const [user, setUser] = useState<Candidate>({} as Candidate);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const axios = ax(getToken);
    axios
      .get("candidates/candidate")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          navigate("/onboarding");
          return;
        }
        toast.error(err.response.data.message || "An error occurred");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <SignedIn>
        <div className="">
          <div className="flex w-full">
            <Sidebar />

            <div className="h-full w-full">
              <Outlet context={{ user, setUser }} />
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Layout;
