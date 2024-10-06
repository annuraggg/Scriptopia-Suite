import ProblemComponent from "@/components/problem/Problem";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { Problem as ProblemType } from "@shared-types/Problem";
import { useEffect, useState } from "react";
import TimerBar from "./TimerBar";
import { Security } from "@shared-types/Assessment";
import secureLocalStorage from "react-secure-storage";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

const Problem = () => {
  const [problem, setProblem] = useState<ProblemType>({} as ProblemType);
  const [loading, setLoading] = useState<boolean>(true);
  const [securityConfig, setSecurityConfig] = useState<Security>(
    {} as Security
  );

  const {
    isOpen: isTabChangeOpen,
    onOpen: onTabChangeOpenChange,
    onClose: onTabChangeCloseChange,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    const id = window.location.pathname.split("/").pop();
    axios
      .get(`/problems/${id}`)
      .then((res) => {
        setProblem(res.data.data.problem);
        console.log(res.data.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });

    secureLocalStorage.getItem("securityConfig") &&
      setSecurityConfig(
        secureLocalStorage.getItem("securityConfig") as Security
      );
  }, [getToken]);

  useEffect(() => {
    const name = localStorage.getItem("name") as string;
    const email = localStorage.getItem("email") as string;

    if (!name || !email) {
      const redirectPath = window.location.pathname.split("/").slice(0, -2);
      window.location.href = redirectPath.join("/");
    }

    const securityConfig = secureLocalStorage.getItem(
      "securityConfig"
    ) as Security;

    if (securityConfig.tabChangeDetection) {
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          onTabChangeOpenChange();
          const offtrack = (secureLocalStorage.getItem("offtrack") as {
            tabChange: { problem: { problemId: string; times: number }[] };
          }) || { tabChange: { problem: [] } };

          const problemSt = offtrack.tabChange.problem.find(
            (p: { problemId: string }) => p.problemId === problem._id
          );
          if (problemSt) {
            problemSt.times = problemSt.times ? problemSt.times + 1 : 1;
          } else {
            offtrack.tabChange.problem.push({
              problemId: problem._id,
              times: 1,
            });
          }

          secureLocalStorage.setItem("offtrack", offtrack);
        }
      });
    }

    return () => {
      window.removeEventListener("visibilitychange", () => {});
    };
  }, [getToken]);

  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [problemId, setProblemId] = useState<string>("");
  
  const submitCode = async (
    code: string,
    language: string,
    problemId: string
  ) => {
    setCode(code);
    setLanguage(language);
    setProblemId(problemId);
    onOpen();
  };

  const saveCode = async () => {
    const saveObj = {
      code,
      language,
      problemId,
    };

    const submissionArray =
      (secureLocalStorage.getItem("submissions") as string) || "[]";
    const submissions = JSON.parse(submissionArray);
    submissions.push(saveObj);
    secureLocalStorage.setItem("submissions", JSON.stringify(submissions));
    window.history.back();
  };

  return (
    <div className="px-5">
      <TimerBar />
      <ProblemComponent
        loading={loading}
        problem={problem}
        allowSubmissionsTab={false}
        allowRun={securityConfig?.allowRunningCode}
        allowExplain={false}
        submitOverride={submitCode}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Are You Sure?</ModalHeader>
          <ModalBody>
            You won't be able to make changes after submission.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="flat" color="danger">
              Cancel
            </Button>
            <Button onClick={saveCode} variant="flat" color="success">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isTabChangeOpen}
        onClose={onTabChangeCloseChange}
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
              onClick={onTabChangeCloseChange}
              variant="flat"
              color="danger"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Problem;
