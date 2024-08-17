import { Outlet } from "react-router-dom";
import Sidebar from "../sidebars/OrganizationSidebar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

const OrganizationLayout = () => {
  return (
    <>
      <SignedIn>
        <div className="">
          <div className="flex w-full">
            <Sidebar />

            <div className="h-full w-full">
              <Outlet />
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

export default OrganizationLayout;
