import { useEffect, useState } from "react";
import Editor from "./Editor/Editor";
import InfoPanel from "./InfoPanel";
import Statement from "./LeftPanel/Statement";
import Split from "@uiw/react-split";
import starterGenerator from "@/functions/starterGenerator";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Delta } from "quill/core";
import { IFunctionArg } from "@/@types/Problem";
import { IRunResponseResult } from "@/@types/RunResponse";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

import { Button, useDisclosure } from "@nextui-org/react";
import secureLocalStorage from "react-secure-storage";

const Problem = () => {
  const [rootLoading, setRootLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [statement, setStatement] = useState<Delta>({} as Delta);
  const [title, setTitle] = useState<string>("");

  const [code, setCode] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("javascript");

  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [cases, setCases] = useState<IRunResponseResult[]>([]);

  const [functionName, setFunctionName] = useState<string>("");
  const [functionArgs, setFunctionArgs] = useState<IFunctionArg[]>([]);
  const [functionReturnType, setFunctionReturnType] = useState<string>("");
  const [problemId, setProblemId] = useState<string>("");

  const [editorUpdateFlag, setEditorUpdateFlag] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { getToken } = useAuth();
  useEffect(() => {
    const langs =
      (secureLocalStorage.getItem("securityConfig") as { languages: string[] })
        ?.languages || [];
    setLanguages(langs);
    setLanguage(langs[0]);

    const axios = ax(getToken);
    const id = window.location.pathname.split("/").pop();
    axios
      .get(`/problems/${id}`)
      .then((res) => {
        console.log(res.data.data);

        setStatement(res.data.data.problem.description.ops);
        setTitle(res.data.data?.problem?.title);
        setFunctionName(res.data.data?.problem?.functionName);
        setFunctionArgs(res.data.data?.problem?.functionArgs);
        setFunctionReturnType(res.data.data?.problem?.functionReturnType);
        setProblemId(res.data.data?.problem?._id);

        const starterCode = starterGenerator(
          res.data.data?.problem?.functionName,
          res.data.data?.problem?.functionArgs,
          res.data.data?.problem?.functionReturnType,
          langs[0]
        );
        setCode(starterCode);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRootLoading(false);
      });
  }, [getToken]);

  const runCode = async () => {
    setLoading(true);
    const axios = ax(getToken);
    return axios
      .post("/submissions/run", { code, language, problemId })
      .then((res) => {
        console.log(res.data.data);
        setCases(
          res.data.data.results.filter((r: { isSample: boolean }) => r.isSample)
        );

        setConsoleOutput(
          res.data.data.results.map((r: IRunResponseResult) =>
            r.consoleOutput.join("\n")
          )
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

    const submissionArray = sessionStorage.getItem("submissions") || "[]";
    const submissions = JSON.parse(submissionArray);
    submissions.push(saveObj);
    sessionStorage.setItem("submissions", JSON.stringify(submissions));
    window.history.back();
  };

  useEffect(() => {
    const starter = starterGenerator(
      functionName,
      functionArgs,
      functionReturnType,
      language
    );
    setCode(starter);
    console.log("Starter Code: ", starter);
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
    </>
  );
};

export default Problem;
