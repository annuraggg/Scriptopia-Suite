import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import { RootState } from "@/types/Reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Spinner } from "@nextui-org/react";  
import { Candidate } from "@shared-types/Candidate";

const Candidates = () => {
  const org = useSelector((state: RootState) => state.institute);
  const [candidates, setCandidates] = useState<Candidate[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rerender, setRerender] = useState(false);

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    axios
      .get("/institutes/candidates")
      .then((response) => {
        setCandidates(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch candidates");
        setLoading(false);
      });
  }, [rerender]);

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
          <BreadcrumbItem>{org?.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/candidates/active"}>
            Candidates
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
          <DataTable data={candidates} type="active" onDataUpdate={() =>setRerender(!rerender)} />
        </div>
      </motion.div>
    </>
  );
};

export default Candidates;
