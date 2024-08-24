import { Language } from "@/data/languages";
import { Button, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { ArrowUpFromLine, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const Actions = ({
  setExplainOpen,
  runCode,
  submitCode,
  loading,
  language,
  setLanguage,
  languages,
}: {
  setExplainOpen: (open: boolean) => void;
  runCode: () => Promise<object>;
  submitCode: () => void;
  loading: boolean;
  setLanguage: (lang: Language) => void;
  language: Language;
  languages: Language[];
}) => {
  const [runLoading, setRunLoading] = useState<boolean>(false);

  const triggerRun = async () => {
    setRunLoading(true);
    runCode().finally(() => setRunLoading(false));
  };

  const triggerSubmit = async () => {
    submitCode();
  };

  const [allowExecution, setAllowExecution] = useState<boolean>(false);
  useEffect(() => {
    const securityConfig = secureLocalStorage.getItem("securityConfig") as {
      languages: string[];
      codePlayback: boolean;
      codeExecution: boolean;
      tabChangeDetection: boolean;
      copyPasteDetection: boolean;
      allowAutoComplete: boolean;
    };
    setAllowExecution(securityConfig.codeExecution);
  });

  return (
    <>
      <Select
        placeholder="Select Language"
        size="sm"
        className="w-[180px]"
        aria-label="Select Language"
        defaultSelectedKeys={[language.name]}
        onChange={(e) => {
          const lang = languages.find((lang) => lang.name === e.target.value);
          if (lang) setLanguage(lang);
        }}
      >
        {languages?.map((lang) => (
          <SelectItem key={lang.name} value={lang.name}>
            {lang.name}
          </SelectItem>
        ))}
      </Select>

      <Tooltip content="Explain Code">
        <Button
          variant="flat"
          className="p-0 max-w-2 m-0 bg-yellow-900 hidden"
          size="sm"
          isIconOnly
          onClick={() => setExplainOpen(true)}
          disabled={loading}
          aria-label="Explain Code"
        >
          <Sparkles size={14} />
        </Button>
      </Tooltip>

      {allowExecution && (
        <Tooltip content="Run Code">
          <Button
            variant="flat"
            className="p-0 max-w-2 m-0 bg-green-900"
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
      )}

      <Tooltip content="Submit Code">
        <Button
          variant="flat"
          className="p-0 max-w-2 m-0 bg-blue-900"
          size="sm"
          isIconOnly
          onClick={triggerSubmit}
          aria-label="Submit Code"
        >
          <ArrowUpFromLine size={14} />
        </Button>
      </Tooltip>
    </>
  );
};

export default Actions;
