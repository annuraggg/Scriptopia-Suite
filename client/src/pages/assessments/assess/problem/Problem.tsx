import { useEffect, useState } from "react";
import Editor from "./Editor/Editor";
import InfoPanel from "./InfoPanel";
import Statement from "./LeftPanel/Statement";
import Split from "@uiw/react-split";
import starterGenerator from "@/functions/starterGenerator";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Delta } from "quill/core";
import { RunResponseResult } from "@shared-types/RunResponse";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Button, useDisclosure } from "@nextui-org/react";
import secureLocalStorage from "react-secure-storage";
import { Language } from "@/data/languages";

const Problem = () => {
  const [rootLoading, setRootLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [statement, setStatement] = useState<Delta>({} as Delta);
  const [title, setTitle] = useState<string>("");

  const [code, setCode] = useState<string>("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [language, setLanguage] = useState<Language>({} as Language);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [cases, setCases] = useState<RunResponseResult[]>([]);

  const [scl, setSCl] = useState([]);
  const [problemId, setProblemId] = useState<string>("");

  const [editorUpdateFlag, setEditorUpdateFlag] = useState<boolean>(false);
  const [pid, setPid] = useState<string>("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isTabChangeOpen,
    onOpen: onTabChangeOpen,
    onOpenChange: onTabChangeOpenChange,
  } = useDisclosure();

  const { getToken } = useAuth();
  useEffect(() => {
    const name = localStorage.getItem("name") as string;
    const email = localStorage.getItem("email") as string;

    if (!name || !email) {
      const redirectPath = window.location.pathname.split("/").slice(0, -2);
      window.location.href = redirectPath.join("/");
    }

    const langs =
      (secureLocalStorage.getItem("securityConfig") as { languages: Language[] })
        ?.languages || [];
    setLanguages(langs);
    setLanguage(langs[0]);

    const axios = ax(getToken);
    const id = window.location.pathname.split("/").pop() as string;
    setPid(id);
    axios
      .get(`/problems/${id}`)
      .then((res) => {
        setStatement(res.data.data.problem.description.ops);
        setTitle(res.data.data?.problem?.title);
        setProblemId(res.data.data?.problem?._id);
        setSCl(res.data.data?.problem?.scl);

        const starterCode = starterGenerator(
          res.data.data?.problem?.scl,
          langs[0].abbr
        );
        setCode(starterCode);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRootLoading(false);
      });

    const securityConfig = secureLocalStorage.getItem("securityConfig") as {
      languages: string[];
      codePlayback: boolean;
      codeExecution: boolean;
      tabChangeDetection: boolean;
      copyPasteDetection: boolean;
      allowAutoComplete: boolean;
      syntaxHighlighting: boolean;
    };

    if (securityConfig.tabChangeDetection) {
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          onTabChangeOpen();
          const offtrack = (secureLocalStorage.getItem("offtrack") as {
            tabChange: { problem: { problemId: string; times: number }[] };
          }) || { tabChange: { problem: [] } };

          const problem = offtrack.tabChange.problem.find(
            (p: { problemId: string }) => p.problemId === problemId
          );
          if (problem) {
            problem.times = problem.times ? problem.times + 1 : 1;
          } else {
            offtrack.tabChange.problem.push({ problemId: pid || id, times: 1 });
          }

          secureLocalStorage.setItem("offtrack", offtrack);
        }
      });
    }

    return () => {
      window.removeEventListener("visibilitychange", () => {});
    };
  }, [getToken]);

  const runCode = async () => {
    setLoading(true);
    const axios = ax(getToken);
    return axios
      .post("/submissions/run", { code, language, problemId })
      .then((res) => {
        setCases(
          res.data.data.results.filter((r: { isSample: boolean }) => r.isSample)
        );

        setConsoleOutput(
          res.data.data.results.map((r: RunResponseResult) => r.consoleOutput)
        );

        return { success: true, error: "", data: {} };
      })
      .catch((err) => {
        console.log(err);
        return { success: false, error: err, data: {} };
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submitCode = async () => {
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

  useEffect(() => {
    const starter = starterGenerator(scl, language.abbr);
    setCode(starter);

    setEditorUpdateFlag((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  if (rootLoading) return <div>Loading...</div>;

  return (
    <>
      <Split className="flex h-[100vh] w-full gap-2 p-5" vaul-drawer-wrapper="">
        <Statement statement={statement} title={title} />
        <Split mode="vertical" className="w-full">
          <Editor
            runCode={runCode}
            submitCode={submitCode}
            loading={loading}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            languages={languages}
            editorUpdateFlag={editorUpdateFlag}
          />
          <InfoPanel cases={cases} consoleOutput={consoleOutput} />
        </Split>
      </Split>

      <Modal isOpen={isOpen} onClose={onOpenChange}>
        <ModalContent>
          <ModalHeader>Are You Sure?</ModalHeader>
          <ModalBody>
            You won't be able to make changes after submission.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onOpenChange} variant="flat" color="danger">
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
    </>
  );
};

export default Problem;
