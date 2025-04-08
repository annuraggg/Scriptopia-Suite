import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Button, Spinner } from "@nextui-org/react";
import { useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";
import { toast } from "sonner";
import { Candidate } from "@shared-types/Candidate";

const Candidates = () => {
  const { institute } = useOutletContext<RootContext>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    axios
      .get("/institutes/candidates/pending")
      .then((response) => {
        console.log(response.data.data);
        setCandidates(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch candidates");
        setLoading(false);
      });
  }, []);

  const copyInvite = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_CANDIDATE_URL}/campus?code=${institute?.code}`
    );

    console.log(institute);

    toast.success("Invite link copied to clipboard");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{institute?.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/candidates/pending"}>
            Pending Candidates
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <div className="p-5">
          <Button onPress={copyInvite}>Copy Invite Link</Button>
          <DataTable
            data={candidates}
            type="pending"
            setData={setCandidates}
          />
        </div>
      </motion.div>
    </>
  );
};

export default Candidates;
