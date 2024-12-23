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
import { toast } from "sonner";
import { MemberWithPermission as MWP } from "@shared-types/MemberWithPermission";
import { OrganizationWithPostings as OWP } from "@/types/RootContext";

const Layout = () => {
  const [notifications, setNotifications] = useState([]);
  const [organization, setOrganization] = useState<OWP>({} as OWP);
  const [user, setUser] = useState<MWP>({} as MWP);
  const [rerender, setRerender] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .get("/organizations")
      .then((res) => {
        setOrganization(res.data.data.organization);
        setUser(res.data.data.user);
        setNotifications(res.data.data.notifications);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "An error occurred");
      })
      .finally(() => {
        setRerender(!rerender);
      });
  }, []);

  const updateOrganization = (newOrganization: OWP) => {
    setOrganization(newOrganization);
    setRerender(!rerender);
  }

  return (
    <>
      <SignedIn>
        <div className="">
          <div className="flex w-full">
            <Sidebar
              notifications={notifications}
              org={organization}
              user={user}
            />

            <div className="h-full w-full">
              <Outlet
                context={{
                  notifications,
                  user,
                  organization,
                  setOrganization: updateOrganization,
                  rerender,
                }}
              />
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
