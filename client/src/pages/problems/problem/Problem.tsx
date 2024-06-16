import { useEffect, useState } from "react";
import Editor from "./Editor/Editor";
import InfoPanel from "./InfoPanel";
import Statement from "./LeftPanel/Statement";
import Split from "@uiw/react-split";
import Response from "@/@types/Response";
import { Case, Submission } from "./types";
import starterGenerator from "@/functions/starterGenerator";
import { OutputData } from "@editorjs/editorjs";

const submissionsEx = [
  {
    status: "Accepted",
    time: "2 days ago",
    language: "Python",
    runtime: "32ms",
    memory: "14.3 MB",
    beatsTime: "98.34%",
    beatsMemory: "100%",
    code: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        s.reverse()",
    author: "Anurag Sawant",
  },
  {
    status: "Accepted",
    time: "2 days ago",
    language: "Python",
    runtime: "32ms",
    memory: "14.3 MB",
    beatsTime: "98.34%",
    beatsMemory: "100%",
    code: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        s.reverse()",
    author: "Anurag Sawant",
  },
  {
    status: "Accepted",
    time: "2 days ago",
    language: "Python",
    runtime: "32ms",
    memory: "14.3 MB",
    beatsTime: "98.34%",
    beatsMemory: "100%",
    code: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        s.reverse()",
    author: "Anurag Sawant",
  },
  {
    status: "Accepted",
    time: "2 days ago",
    language: "Python",
    runtime: "32ms",
    memory: "14.3 MB",
    beatsTime: "98.34%",
    beatsMemory: "100%",
    code: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        s.reverse()",
    author: "Anurag Sawant",
  },
  {
    status: "Not Accepted",
    time: "2 days ago",
    language: "Javascript",
    runtime: "3ms",
    memory: "1.3 MB",
    beatsTime: "100%",
    beatsMemory: "100%",
    code: "var reverseString = function(s) {\n    return s.reverse();\n};",
    author: "Anurag Sawant",
  },
];

const statementEx = {
  time: 1717676502247,
  blocks: [
    {
      id: "qLvm-R849R",
      type: "header",
      data: { text: "Reverse String", level: 2 },
    },
    {
      id: "pyXge4mvz1",
      type: "paragraph",
      data: {
        text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      },
    },
    {
      id: "uEV5vRj8T2",
      type: "paragraph",
      data: {
        text: "You must do this by modifying the input array in-place with O(1) extra memory.",
      },
    },
    { id: "jw0APpxgwK", type: "paragraph", data: { text: "Example 1:" } },
    {
      id: "bomO6rAEjJ",
      type: "code",
      data: {
        code: 'Input: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]\n',
      },
    },
    { id: "fiVuaLBUNb", type: "paragraph", data: { text: "Example 2:" } },
    {
      id: "lflE_sy1GT",
      type: "code",
      data: {
        code: 'Input: s = ["H","a","n","n","a","h"]\nOutput: ["h","a","n","n","a","H"]\n',
      },
    },
    { id: "yAc0fecIs-", type: "paragraph", data: { text: "Constraints:" } },
    {
      id: "g1bSigco3C",
      type: "list",
      data: {
        style: "unordered",
        items: ["1 <= s.length <= 105", "s[i] is a printable ascii character."],
      },
    },
  ],
  version: "2.29.1",
};

const starter = {
  functionName: "reverseString",
  functionParams: [
    {
      name: "s",
      type: "String Array",
    },
  ],
  functionReturnType: "String Array",
};

const languageEx = "javascript";

const Problem = () => {
  const [rootLoading, setRootLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [statement, setStatement] = useState<OutputData>({} as OutputData);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStatement(statementEx);
      setSubmissions(submissionsEx);

      const starterCode = starterGenerator(
        starter.functionName,
        starter.functionParams,
        starter.functionReturnType,
        language
      );
      setCode(starterCode);

      setLanguage(languageEx);
    }, 1000);

    setTimeout(() => {
      setRootLoading(false);
    }, 2000);
  });

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
            }
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

  if (rootLoading) return <div>Loading...</div>;

  return (
    <Split className="flex h-[90vh] w-full gap-2" vaul-drawer-wrapper="">
      <Statement statement={statement} submissions={submissions} />
      <Split mode="vertical" className="w-full">
        <Editor
          runCode={runCode}
          submitCode={submitCode}
          loading={loading}
          code={code}
          setCode={setCode}
        />
        <InfoPanel cases={cases} consoleOutput={consoleOutput} />
      </Split>
    </Split>
  );
};

export default Problem;
