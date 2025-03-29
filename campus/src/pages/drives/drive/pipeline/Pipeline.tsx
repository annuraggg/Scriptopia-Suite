import Loader from "@/components/Loader";
import ax from "@/config/axios";
import { PostingContext } from "@/types/PostingContext";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ExtendedAppliedPosting } from "@shared-types/ExtendedAppliedPosting";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

const Pipeline = () => {
  const [appliedPostings, setAppliedPostings] = useState<
    ExtendedAppliedPosting[]
  >([]);
  const { posting } = useOutletContext<PostingContext>();

  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const postingId = window.location.pathname.split("/")[2];

    axios
      .get(`/postings/${postingId}/applied`)
      .then((res) => {
        setAppliedPostings(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error fetching applied postings"
        );
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-10">
      <p>View Candidates flow in your posting</p>
      <div className="flex gap-5 mt-5 h-full">
        {posting?.workflow?.steps?.map((step, index) => {
          return (
            <Card className="max-w-72 min-w-72 h-[calc(100vh-10rem)] overflow-y-auto">
              <CardHeader>{step.name}</CardHeader>
              <CardBody>
                {appliedPostings
                  .filter((applied) => {
                    return step.status === "in-progress"
                      ? applied.status === "inprogress"
                      : applied.disqualifiedStage === index;
                  })
                  .map((applied) => {
                    return (
                      <div
                        key={applied._id}
                        className="p-3 bg-zinc-100 rounded-2xl border shadow-sm cursor-pointer select-none"
                      >
                        <h5 className="font-bold">{applied.user.name}</h5>
                        <p className="text-xs text-gray-500">
                          {applied.user.email}
                        </p>
                      </div>
                    );
                  })}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
