import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Main from "./MainWindow";
import ax from "@/config/axios";
import IAssessment from "@/@types/Assessment";
import { toast } from "sonner";
import secureLocalStorage from "react-secure-storage";

const Lander = () => {
  const [assessment, setAssessment] = useState<IAssessment>({} as IAssessment);
  const [problems, setProblems] = useState([]);

  const [timer, setTimer] = useState(0);

  const [problemSolved, setProblemSolved] = useState<{
    total: number;
    solved: number;
  }>({ total: 0, solved: 0 });
  const [mcqSolved, setMcqSolved] = useState<{ total: number; solved: number }>(
    { total: 0, solved: 0 }
  );
  const [updateFlag, setUpdateFlag] = useState(false);

  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const axios = ax();
    const id = window.location.pathname.split("/")[3];

    axios
      .get(`/assessments/${id}`)
      .then((res) => {
        setAssessment(res.data.data.assessment);
        setProblems(res.data.data.problems);
        const time = sessionStorage.getItem("timer");
        if (time) setTimer(parseInt(time));
        else setTimer(res.data.data.assessment.timeLimit * 60);

        const solvedArray = sessionStorage.getItem("submissions") || "[]";
        const mcqSolvedArray = sessionStorage.getItem("mcqSubmissions") || "[]";

        const solvedSubmissions = JSON.parse(solvedArray);
        const solvedMcqSubmissions = JSON.parse(mcqSolvedArray);

        const pSolved = {
          total: res.data.data.problems?.length || 0,
          solved: solvedSubmissions?.length || 0,
        };
        const mSolved = {
          total: res.data.data.assessment.mcqs?.length || 0,
          solved: solvedMcqSubmissions?.length || 0,
        };

        setProblemSolved(pSolved);
        setMcqSolved(mSolved);
        setSolvedProblems(solvedSubmissions);

        const securityConfig = {
          languages: res.data.data.assessment.languages,
          codePlayback: res.data.data.assessment.security.codePlayback,
          codeExecution: res.data.data.assessment.security.codeExecution,
          tabChangeDetection:
            res.data.data.assessment.security.tabChangeDetection,
          copyPasteDetection:
            res.data.data.assessment.security.copyPasteDetection,
          allowAutoComplete:
            res.data.data.assessment.security.allowAutoComplete,
          syntaxHighlighting:
            res.data.data.assessment.security.enableSyntaxHighlighting,
        };

        secureLocalStorage.setItem("securityConfig", securityConfig);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch assessment details");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const solvedArray = sessionStorage.getItem("submissions") || "[]";
    const mcqSolvedArray = sessionStorage.getItem("mcqSubmissions") || "[]";

    const solvedSubmissions = JSON.parse(solvedArray);
    const solvedMcqSubmissions = JSON.parse(mcqSolvedArray);

    const pSolved = {
      total: problems?.length || 0,
      solved: solvedSubmissions?.length || 0,
    };
    const mSolved = {
      total: assessment.mcqs?.length || 0,
      solved: solvedMcqSubmissions?.length || 0,
    };

    setProblemSolved(pSolved);
    setMcqSolved(mSolved);
  }, [updateFlag]);

  useEffect(() => {
    if (assessment && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        sessionStorage.setItem("timer", timer.toString());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [assessment, timer]);

  return (
    <div className="flex gap-5 items-center justify-center p-5 h-screen">
      <Sidebar
        timer={timer}
        problemsSolved={problemSolved}
        mcqsSolved={mcqSolved}
      />
      <Main
        mcqs={assessment?.mcqs}
        problems={problems}
        setUpdateFlag={setUpdateFlag}
        languages={assessment?.languages}
        solvedProblems={solvedProblems}
      />
    </div>
  );
};

export default Lander;
