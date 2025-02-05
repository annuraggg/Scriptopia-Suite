import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { ExtendedCandidate } from "@shared-types/ExtendedCandidate";
import { Posting } from "@shared-types/Posting";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

const Apply = () => {
  const [posting, setPosting] = useState<Posting>({} as Posting);
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const candidate = useOutletContext() as { user: ExtendedCandidate };

  useEffect(() => {
    const postingId = window.location.pathname.split("/")[2];
    axios
      .get(`/postings/slug/${postingId}`)
      .then((res) => setPosting(res.data.data))
      .catch((err) => {
        toast.error("Failed to fetch posting details");
        console.error(err);
      });
  }, []);

  return (
    <div>

    </div>
  );
};

export default Apply;
