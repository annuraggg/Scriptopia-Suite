import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import axios from "@/config/axios";
import { useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";

const Layout = () => {
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  getToken().then((token) => {
    axios.defaults.headers.common["Authorization"] = token;
    setLoading(false);
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <SignedIn>
        <Toaster />
        <Navbar />
        <div className="h-[90vh] px-10">
          <Outlet />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export default Layout;
