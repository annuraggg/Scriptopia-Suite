import { useEffect, useState } from "react";
import Editor from "./Editor/Editor";
import InfoPanel from "./InfoPanel";
import Statement from "./LeftPanel/Statement";
import Split from "@uiw/react-split";
import Response from "@/@types/Response";
import { Case, Submission } from "./types";
import starterGenerator from "@/functions/starterGenerator";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Delta } from "quill/core";
import { IFunctionArg } from "@/@types/Problem";

const languageEx = "javascript";

const Problem = () => {
  const [rootLoading, setRootLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [statement, setStatement] = useState<Delta>({} as Delta);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [title, setTitle] = useState<string>("");

  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [cases, setCases] = useState<Case[]>([]);

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
        setTimeout(() => {
          setLoading(false);
          setCases([
            {
              name: "Case 1",
              difficulty: "Easy",
              score: 1,
              input: ['["h","e","l","l","o"]'],
              output: '["o","l","l","e","h"]',
              expected: '["o","l","l","e","h"]',
              isSample: true,
            },
            {
              name: "Case 2",
              difficulty: "Easy",
              score: 1,
              input: ['["H","a","n","n","a","h"]'],
              output: '["h","a","n","n","a","H"]',
              expected: '["h","a","n","n","a","H"]',
              isSample: true,
            },
            {
              name: "Case 3",
              difficulty: "Easy",
              score: 1,
              input: ['["a","b","c","d","e"]'],
              output: '["e","d","c","b","a"]',
              expected: '["e","d","c","b","a"]',
              isSample: false,
            },
            {
              name: "Case 4",
              difficulty: "Easy",
              score: 1,
              input: ['["a","b","c","d","e","f"]'],
              output: '["f","e","d","c","b","a"]',
              expected: '["f","e","d","c","b","a"]',
              isSample: false,
            },
          ]);
          setConsoleOutput("Success");
          resolve({ success: true, error: "", data: {} });
        }, 2000);
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
  }, [language]);

  if (rootLoading) return <div>Loading...</div>;

  return (
    <Split className="flex h-[90vh] w-full gap-2 my-5 px-5" vaul-drawer-wrapper="">
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
