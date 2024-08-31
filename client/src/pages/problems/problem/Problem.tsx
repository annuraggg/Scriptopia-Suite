import ProblemComponent from "@/components/problem/Problem";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { IProblem } from "@shared-types/Problem";
import { ISubmission } from "@shared-types/Submission";
import { useEffect, useState } from "react";

const Problem = () => {
  const [problem, setProblem] = useState<IProblem>({} as IProblem);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    const id = window.location.pathname.split("/").pop();
    axios
      .get(`/problems/${id}`)
      .then((res) => {
        setProblem(res.data.data.problem);
        setSubmissions(res.data.data.submissions);
        console.log(res.data.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [getToken]);

  return (
    <div>
      <ProblemComponent
        loading={loading}
        problem={problem}
        submissions={submissions}
        setSubmissions={setSubmissions}
      />
    </div>
  );
};

export default Problem;
