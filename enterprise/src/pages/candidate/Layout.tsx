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
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/candidates/postings/${
          window.location.pathname.split("/")[2]
        }`
      )
      .then((res) => {
        setPosting(res.data.data.postings);
        setOrganization(res.data.data.organization);
      })
      .catch((err) => {
        toast.error(err.response.data);
        console.log(err);
      });
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
