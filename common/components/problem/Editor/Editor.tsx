import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Code } from "lucide-react";
import { useState } from "react";
import "@/config/monaco";
import Explain from "./Explain";
import Monaco from "./Monaco";
import Actions from "./Actions";

const Editor = ({
  runCode,
  submitCode,
  loading,
  code,
  setCode,
  language,
  setLanguage,
  editorUpdateFlag,
}: {
  runCode: () => Promise<object>;
  submitCode: () => Promise<object>;
  loading: boolean;
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  editorUpdateFlag: boolean;
}) => {
  const [explainOpen, setExplainOpen] = useState<boolean>(false);

  return (
    <div className="h-[50%] mb-2 w-full">
      <Card className="h-full overflow-visible">
        <CardHeader className="border-b justify-between">
          <div className="flex items-center gap-3">
            <Code size={16} className="text-gray-500" />
            <p>Editor</p>
          </div>
          <div className="flex gap-2">
            <Actions
              setExplainOpen={setExplainOpen}
              runCode={runCode}
              submitCode={submitCode}
              loading={loading}
              language={language}
              setLanguage={setLanguage}
            />
          </div>
        </CardHeader>
        <CardBody className="h-full p-0 overflow-visible">
          <Monaco key={language} code={code} setCode={setCode} loading={loading} language={language} editorUpdateFlag={editorUpdateFlag} />
        </CardBody>
      </Card>

      <Explain
        code={code}
        explainOpen={explainOpen}
        setExplainOpen={setExplainOpen}
      />
    </div>
  );
};

export default Editor;
