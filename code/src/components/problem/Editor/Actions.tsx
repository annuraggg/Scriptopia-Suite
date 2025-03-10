import { Button, Select, SelectItem, Tooltip } from "@heroui/react";
import { ArrowUpFromLine, Play, Sparkles } from "lucide-react";
import { useState } from "react";

const Actions = ({
  setExplainOpen,
  runCode,
  submitCode,
  loading,
  language,
  setLanguage,
  languages,

  allowRun,
  allowSubmit,
  allowExplain,
}: {
  setExplainOpen: (open: boolean) => void;
  runCode: () => Promise<object>;
  submitCode: () => Promise<object>;
  loading: boolean;
  setLanguage: (lang: string) => void;
  language: string;
  languages: { name: string; abbr: string; available: boolean }[];

  allowRun: boolean;
  allowSubmit: boolean;
  allowExplain: boolean;
}) => {
  const [runLoading, setRunLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const triggerRun = async () => {
    setRunLoading(true);
    runCode().finally(() => setRunLoading(false));
  };

  const triggerSubmit = async () => {
    setSubmitLoading(true);
    submitCode().finally(() => setSubmitLoading(false));
  };

  return (
    <>
      <Select
        placeholder="Select Language"
        size="sm"
        className="w-[180px]"
        aria-label="Select Language"
        defaultSelectedKeys={[language]}
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
      >
        {languages
          .filter((lang) => lang.available)
          .map((lang) => (
            <SelectItem key={lang.abbr}>
              {lang.name}
            </SelectItem>
          ))}
      </Select>

      <Tooltip content="Explain Code">
        <Button
          variant="light"
          color="warning"
          className={`p-0 max-w-2 m-0 ${allowExplain ? "" : "hidden"}`}
          size="sm"
          isIconOnly
          onClick={() => setExplainOpen(true)}
          disabled={loading}
          aria-label="Explain Code"
        >
          <Sparkles size={14} />
        </Button>
      </Tooltip>

      <Tooltip content="Run Code">
        <Button
          variant="flat"
          color="success"
          className={`p-0 max-w-2 m-0 ${allowRun ? "" : "hidden"}`}
          size="sm"
          isIconOnly
          onClick={triggerRun}
          disabled={loading}
          isLoading={runLoading}
          aria-label="Run Code"
        >
          <Play size={14} />
        </Button>
      </Tooltip>

      <Tooltip content="Submit Code">
        <Button
          variant="flat"
          color="danger"
          className={`p-0 max-w-2 m-0 ${allowSubmit ? "" : "hidden"}`}
          size="sm"
          isIconOnly
          onClick={triggerSubmit}
          disabled={loading}
          isLoading={submitLoading}
          aria-label="Submit Code"
        >
          <ArrowUpFromLine size={14} />
        </Button>
      </Tooltip>
    </>
  );
};

export default Actions;
