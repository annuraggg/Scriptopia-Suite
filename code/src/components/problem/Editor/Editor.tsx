import { Card, CardBody, CardHeader } from "@heroui/react";
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
  languages,

  allowRun,
  allowSubmit,
  allowExplain,
  allowHighlighting,
  onExternalPaste,
}: {
  runCode: () => Promise<object>;
  submitCode: () => Promise<object>;
  loading: boolean;
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  languages: { name: string; abbr: string; available: boolean }[];

  allowRun: boolean;
  allowSubmit: boolean;
  allowExplain: boolean;
  allowHighlighting: boolean;

  onExternalPaste?: (pastedText: string) => void;
}) => {
  const [explainOpen, setExplainOpen] = useState<boolean>(false);

  return (
    <div className="mb-2 w-full">
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
              languages={languages}
              allowRun={allowRun}
              allowExplain={allowExplain}
              allowSubmit={allowSubmit}
            />
          </div>
        </CardHeader>
        <CardBody className="h-[40vh] p-0 overflow-visible">
          <Monaco
            key={language}
            code={code}
            setCode={setCode}
            loading={loading}
            language={language}
            allowHighlighting={allowHighlighting}
            onExternalPaste={onExternalPaste}
          />
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
