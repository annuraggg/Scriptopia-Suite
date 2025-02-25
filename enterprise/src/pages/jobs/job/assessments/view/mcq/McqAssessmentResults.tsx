import { Tabs, Tab } from "@heroui/tabs";
import Analytics from "./Analytics";
import Result from "./Result";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { MCQAssessment } from "@shared-types/MCQAssessment";
import { MCQAssessmentSubmission } from "@shared-types/MCQAssessmentSubmission";
import { toast } from "sonner";
import Loader from "@/components/Loader";

const McqAssessmentResults = () => {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<MCQAssessment | null>(null);
  const [submissions, setSubmissions] = useState<MCQAssessmentSubmission[]>([]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const id = window.location.pathname.split("/")[5];
    axios
      .get(`/assessments/${id}/get-mcq-submissions`)
      .then((res) => {
        setAssessment(res.data.data.assessment);
        setSubmissions(res.data.data.submissions);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Failed to fetch data");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6">
      {assessment && (
        <Tabs aria-label="Assessment data tabs" className="mb-6">
          <Tab key="analytics" title="Analytics">
            <Analytics assessment={assessment} submissions={submissions} />
          </Tab>

          <Tab key="results" title="Results">
            <Result assessment={assessment} submissions={submissions} />
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default McqAssessmentResults;
