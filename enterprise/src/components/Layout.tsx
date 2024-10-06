import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ax from "@/config/axios";

const Layout = () => {
  const [notifications, setNotifications] = useState([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios.get("/organizations/notifications").then((res) => {
      console.log(res.data.data);
      setNotifications(res.data.data);
    });
  }, []);

  return (
    <>
      <SignedIn>
        <div className="">
          <div className="flex w-full">
            <Sidebar notifications={notifications} />

            <div className="h-full w-full">
              <Outlet context={notifications} />
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
