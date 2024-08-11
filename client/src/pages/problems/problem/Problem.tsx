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
import confetti from "canvas-confetti";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button, Card, CardBody } from "@nextui-org/react";
import { CpuIcon, TimerIcon } from "lucide-react";
import { ISubmission } from "@/@types/Submission";

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
  const [problemId, setProblemId] = useState<string>("");

  const [editorUpdateFlag, setEditorUpdateFlag] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string>("");

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [currentSubmission, setCurrentSubmission] =
    useState<ISubmission | null>(null);

  const [leftPanelActiveTab, setLeftPanelActiveTab] =
    useState<string>("statement");

  const [scl, setScl] = useState<string[]>([]);

  const { getToken } = useAuth();
  useEffect(() => {
    const axios = ax(getToken);
    const id = window.location.pathname.split("/").pop();
    axios
      .get(`/problems/${id}`)
      .then((res) => {
        console.log(res.data.data);

        setStatement(res.data.data.problem.description.ops);
        setSubmissions(res.data.data?.submissions.reverse());
        setTitle(res.data.data?.problem?.title);
        setFunctionName(res.data.data?.problem?.functionName);
        setFunctionArgs(res.data.data?.problem?.functionArgs);
        setFunctionReturnType(res.data.data?.problem?.functionReturnType);
        setProblemId(res.data.data?.problem?._id);
        setScl(res.data.data?.problem?.scl);

        const starterCode = starterGenerator(
          res.data.data?.problem?.scl,
          languageEx
        );

        console.log("Starter Code: ", starterCode);
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
        setCodeError(res.data.data.error);
        console.log(res.data.data);

        return { success: true, error: "", data: {} };
      })
      .catch((err) => {
        console.log(err);
        return { success: false, error: err, data: {} };
      });
  };

  const runConfetti = (type: "success" | "error") => {
    const end = Date.now() + 500;

    const successColors = ["#052814", "#12A150"];
    const errorColors = ["#8B0000", "#FF0000"];

    (function frame() {
      confetti({
        particleCount: 10,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        colors: type === "success" ? successColors : errorColors,
      });
      confetti({
        particleCount: 10,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        colors: type === "success" ? successColors : errorColors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const submitCode = async () => {
    const axios = ax(getToken);
    setLoading(true);
    return axios
      .post("/submissions/submit", { code, language, problemId })
      .then((res) => {
        console.log(res.data.data);
        setCases(
          res.data.data.results.filter((r: { isSample: boolean }) => r.isSample)
        );

        setConsoleOutput(
          res.data.data.results.map((r: IRunResponseResult) =>
            r?.consoleOutput?.join("\n")
          )
        );
        setLoading(false);

        if (res.data.data.status === "FAILED") {
          runConfetti("error");
        } else {
          runConfetti("success");
        }

        setDrawerOpen(true);
        setLeftPanelActiveTab("submissions");
        const newSubmissions = [...submissions];
        newSubmissions.unshift(res.data.data);
        setSubmissions(newSubmissions);
        setCurrentSubmission(res.data.data);
        return { success: true, error: "", data: {} };
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return { success: false, error: err, data: {} };
      });
  };

  useEffect(() => {
    const starter = starterGenerator(scl, language);
    setCode(starter);
    console.log("Starter Code: ", starter);
    setEditorUpdateFlag((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  if (rootLoading) return <div>Loading...</div>;

  return (
    <>
      <Split className="flex h-[90vh] w-full gap-2" vaul-drawer-wrapper="">
        <Statement
          statement={statement}
          submissions={submissions}
          title={title}
          setActiveTab={setLeftPanelActiveTab}
          activeTab={leftPanelActiveTab}
          loading={loading}
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

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent className="outline-none">
          <DrawerHeader>
            <DrawerTitle>Solution Submitted</DrawerTitle>
            <DrawerDescription>
              Submitted at {new Date().toLocaleString()}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex gap-5 items-center justify-center">
            <Card className="px-10 py-5">
              <CardBody>
                <div className="flex gap-5 items-center">
                  <TimerIcon size={30} />
                  <div>
                    <h5>Time Taken</h5>
                    <p>{currentSubmission?.avgTime.toFixed(2)} ms</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="px-10 py-5">
              <CardBody>
                <div className="flex gap-5 items-center">
                  <CpuIcon size={30} />
                  <div>
                    <h5>Memory Used</h5>
                    <p>
                      {((currentSubmission?.avgMemory || 0) * 1000).toFixed(2)}{" "}
                      KB
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                className="w-fit mx-auto"
                onClick={() => setDrawerOpen(false)}
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Problem;
