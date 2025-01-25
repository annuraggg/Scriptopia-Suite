import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div>
      <SignedIn>
        <Navbar />
        <div className="h-[88vh] px-10">
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
