import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Main from "./MainWindow";
import ax from "@/config/axios";
import { Assessment } from "@shared-types/Assessment";
import { toast } from "sonner";
import secureLocalStorage from "react-secure-storage";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import { Progress } from "@nextui-org/progress";


const Lander = () => {
  const [assessment, setAssessment] = useState<Assessment>({} as Assessment);
  const [problems, setProblems] = useState([]);

  const [loaded, setLoaded] = useState(false);

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

  const {
    isOpen: isTabChangeOpen,
    onOpen: onTabChangeOpen,
    onOpenChange: onTabChangeOpenChange,
  } = useDisclosure();

  useEffect(() => {
    const axios = ax();
    const id = window.location.pathname.split("/")[2];

    axios
      .get(`/assessments/${id}`)
      .then((res) => {
        setAssessment(res.data.data.assessment);
        setProblems(res.data.data.problems);
        const time = secureLocalStorage.getItem("timer") as string;
        if (time) setTimer(parseInt(time));
        else {
          setTimer(res.data.data.assessment.timeLimit * 60);
          secureLocalStorage.setItem(
            "timer",
            (res.data.data.assessment.timeLimit * 60).toString()
          );
        }

        const solvedArray =
          (secureLocalStorage.getItem("submissions") as string) || "[]";
        const mcqSolvedArray =
          (secureLocalStorage.getItem("mcqSubmissions") as string) || "[]";

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
        setSolvedProblems(
          solvedSubmissions.map((item: { problemId: string }) => item.problemId)
        );

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

        if (securityConfig.codePlayback) {
          window?.sessionRewind?.identifyUser({
            userId: localStorage.getItem("email"),
          });
          window?.sessionRewind?.startSession();
        }

        if (securityConfig.tabChangeDetection) {
          window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              onTabChangeOpen();
              const offtrack: {
                tabChange: {
                  mcq: number;
                  problem: [{ problemId: string; times: number }];
                };
              } = (secureLocalStorage.getItem("offtrack") as {
                tabChange: {
                  mcq: number;
                  problem: [{ problemId: string; times: number }];
                };
              }) || { tabChange: { mcq: 0, problem: [] } };

              offtrack.tabChange.mcq = offtrack.tabChange.mcq
                ? offtrack.tabChange.mcq + 1
                : 1;

              secureLocalStorage.setItem("offtrack", offtrack);
            }
          });
        }

        secureLocalStorage.setItem("securityConfig", securityConfig);

        return () => {
          window.removeEventListener("visibilitychange", () => { });
        };
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch assessment details");
      })
      .finally(() => setLoaded(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const solvedArray =
      (secureLocalStorage.getItem("submissions") as string) || "[]";
    const mcqSolvedArray =
      (secureLocalStorage.getItem("mcqSubmissions") as string) || "[]";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFlag]);

  useEffect(() => {
    if (loaded) {
      if (assessment && timer > 0) {
        const interval = setInterval(() => {
          secureLocalStorage.setItem("timer", timer.toString());
          setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
      } else if (timer === 0) {
        toast.info("Time's up!");
        submitAssessment();
      }

      // remind at 1 minute
      if (timer === 60) {
        toast.info("1 minute remaining");
      }

      //remind at 5 minutes
      if (timer === 300) {
        toast.info("5 minutes remaining");
      }
    }
  }, [assessment, timer, loaded]);

  const [submitted, setSubmitted] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const submitAssessment = () => {
    const submissionObj = {
      mcqSubmissions: JSON.parse(
        secureLocalStorage.getItem("mcqSubmissions") as string
      ),
      submissions: JSON.parse(
        secureLocalStorage.getItem("submissions") as string
      ),
      assessmentId: assessment._id,
      offenses: secureLocalStorage.getItem("offtrack") as string,
      timer: timer,
      sessionRewindUrl: window?.sessionRewind?.getSessionUrl(),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
    };

    window?.sessionRewind?.stopSession();

    setSubmitted(true);

    const axios = ax();
    axios
      .post("/assessments/submit", submissionObj)
      .then(() => {
        clearAssessment();
        setSubmitProgress(100);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to submit assessment");
      });
  };

  const clearAssessment = () => {
    secureLocalStorage.removeItem("mcqSubmissions");
    secureLocalStorage.removeItem("submissions");
    secureLocalStorage.removeItem("timer");
    secureLocalStorage.removeItem("offtrack");
    secureLocalStorage.removeItem("securityConfig");

    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("mcqSubmissions");
    localStorage.removeItem("submissions");
    localStorage.removeItem("timer");
    localStorage.removeItem("offtrack");
    localStorage.removeItem("securityConfig");
  };

  useEffect(() => {
    if (submitted) {
      const interval = setInterval(() => {
        if (submitProgress < 80) {
          setSubmitProgress((prev) => prev + 1);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [submitProgress, submitted]);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-64 transition-all">
        <Progress value={submitProgress} color="success" />
        <div className="text-center text-lg mt-5">
          {submitProgress < 100
            ? "Submitting Assessment"
            : "Assessment Submitted"}
        </div>
        <p className="mt-5 opacity-50">
          {submitProgress < 100 && "Do not close the tab"}
          {submitProgress === 100 && "You can close the tab now"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-5 items-center justify-center p-5 h-screen">
      <Modal
        isOpen={isTabChangeOpen}
        onClose={onTabChangeOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-red-900/50 to-red-900/5 backdrop-opacity-5",
        }}
      >
        <ModalContent>
          <ModalHeader>We detected that you changed the tab</ModalHeader>
          <ModalBody>
            Repeated tab changes may lead to disqualification.
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onTabChangeOpenChange}
              variant="flat"
              color="danger"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Sidebar
        timer={timer}
        problemsSolved={problemSolved}
        mcqsSolved={mcqSolved}
        submitAssessment={submitAssessment}
        type={assessment?.type}
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
