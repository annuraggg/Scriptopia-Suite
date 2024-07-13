import { useEffect, useState } from "react";
import Editor from "./Editor/Editor";
import InfoPanel from "./InfoPanel";
import Statement from "./LeftPanel/Statement";
import Split from "@uiw/react-split";
import Response from "@/@types/Response";
import starterGenerator from "@/functions/starterGenerator";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Delta } from "quill/core";
import { IFunctionArg } from "@/@types/Problem";
import { ISubmission } from "@/@types/Submission";
import { IRunResponseResult } from "@/@types/RunResponse";

const languageEx = "javascript";

const Problem = () => {
  const [rootLoading, setRootLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [statement, setStatement] = useState<Delta>({} as Delta);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [title, setTitle] = useState<string>("");

  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [cases, setCases] = useState<IRunResponseResult[]>([]);

  const [functionName, setFunctionName] = useState<string>("");
  const [functionArgs, setFunctionArgs] = useState<IFunctionArg[]>([]);
  const [functionReturnType, setFunctionReturnType] = useState<string>("");

  const [editorUpdateFlag, setEditorUpdateFlag] = useState<boolean>(false);

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    const id = window.location.pathname.split("/").pop();
    axios
      .get(`/problems/${id}`)
      .then((res) => {
        console.log(res.data.data);

        setStatement(res.data.data.description.ops);
        setSubmissions(res.data.data?.submissions);
        setTitle(res.data.data?.title);
        setFunctionName(res.data.data?.functionName);
        setFunctionArgs(res.data.data?.functionArgs);
        setFunctionReturnType(res.data.data?.functionReturnType);

        const starterCode = starterGenerator(
          res.data.data?.functionName,
          res.data.data?.functionArgs,
          res.data.data?.functionReturnType,
          languageEx
        );
        setCode(starterCode);
        setLanguage(languageEx);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRootLoading(false);
      });
  }, [getToken]);

  const runCode = async () => {
    return new Promise<Response<object>>((resolve, reject) => {
      setLoading(true);
      // TODO Logic to run code
      try {
        setConsoleOutput("Running Code...");
        setCases([] as IRunResponseResult[]);
        resolve({ success: true, error: "", data: {} });
        // End of Test Logic
      } catch (error) {
        setLoading(false);
        reject({ success: false, error: error, data: {} });
      }
    });
  };

  const submitCode = async () => {
    return new Promise<Response<object>>((resolve, reject) => {
      setLoading(true);
      // TODO Logic to submit code
      try {
        setTimeout(() => {
          setLoading(false);
          resolve({ success: true, error: "", data: {} });
        }, 2000);
        // End of Test Logic
      } catch (error) {
        setLoading(false);
        reject({ success: false, error: error, data: {} });
      }
    });
  };

  useEffect(() => {
    console.log("Language Changed: ", language);
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
    <Split
      className="flex h-[90vh] w-full gap-2 my-5 px-5"
      vaul-drawer-wrapper=""
    >
      <Statement
        statement={statement}
        submissions={submissions}
        title={title}
      />
      <Split mode="vertical" className="w-full">
        <Editor
          runCode={runCode}
          submitCode={submitCode}
          loading={loading}
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          editorUpdateFlag={editorUpdateFlag}
        />
        <InfoPanel cases={cases} consoleOutput={consoleOutput} />
      </Split>
    </Split>
  );
};

export default Problem;
