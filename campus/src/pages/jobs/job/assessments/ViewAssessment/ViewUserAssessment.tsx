import ViewUserAssessmentTop from "./ViewUserAssessmentTop";
import ViewUserAssessmentBottom from "./ViewUserAssessmentBottom";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { useEffect, useState } from "react";
import { Assessment } from "@shared-types/Assessment";
import { AssessmentSubmissionsSchema as IAssessSub } from "@shared-types/AssessmentSubmission";
import { toast } from "sonner";

const ViewUserAssessment = () => {
  const [assessment, setAssessment] = useState<Assessment>({} as Assessment);
  const [submission, setSubmission] = useState<IAssessSub>({} as IAssessSub);

  const { getToken } = useAuth();

  useEffect(() => {
    const axios = ax(getToken);
    const submissionId = window.location.pathname.split("/")[6];
    const assessmentId = window.location.pathname.split("/")[4];
    const postingId = window.location.pathname.split("/")[2];

    axios
      .get(`/assessments/view/${assessmentId}/${submissionId}/${postingId}`)
      .then((res) => {
        setSubmission(res.data?.data?.submission);
        setAssessment(res?.data?.data?.assessment);
        console?.log(res?.data?.data);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "An error occurred");
      });
  }, []);

  return (
    <div className="p-10">
      <ViewUserAssessmentTop submission={submission} assessment={assessment} />
      <ViewUserAssessmentBottom
        submission={submission}
        assessment={assessment}
      />
    </div>
  );
};

export default ViewUserAssessment;
