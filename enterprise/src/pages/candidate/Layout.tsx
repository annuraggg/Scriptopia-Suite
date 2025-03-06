import CandidateNavbar from "@/components/CandidateNavbar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Organization } from "@shared-types/Organization";
import { Posting } from "@shared-types/Posting";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";

const Layout = () => {
  const [posting, setPosting] = useState<Posting>({} as Posting);
  const [organization, setOrganization] = useState<Organization>(
    {} as Organization
  );

  useEffect(() => {

  }, []);

  return (
    <div>
      <SignedIn>
        <CandidateNavbar />
        <Outlet context={{ posting, organization }} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export default Layout;
