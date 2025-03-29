import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import Monaco from "@/components/problem/Editor/Monaco";
import { Save, HelpCircle, X } from "lucide-react";
import { CustomStub as CustomSDSL } from "@shared-types/Problem";
import { generateSdslCode } from "@shared-functions/sdsl";
import allLanguages, { Language } from "@/data/languages";
interface CustomSdslEditorProps {
  onClose?: () => void;
  codeState: CustomSDSL[];
  setCodeState: React.Dispatch<React.SetStateAction<CustomSDSL[]>>;
  sdsl: string;
}

const CustomSdslEditor = ({
  onClose,
  codeState,
  setCodeState,
  sdsl,
}: CustomSdslEditorProps) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("js");
  const [showTooltip, setShowTooltip] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>(
    {}
  );

  // Generate code for all languages on component mount
  useEffect(() => {
    const genCodeForAllLanguages = () => {
      console.log("Generating code for all languages");
      const generated: Record<string, string> = {};
      languages.forEach((lang) => {
        const code = generateSdslCode(sdsl, lang.abbr)?.code || "";
        if (code) {
          generated[lang.abbr] = code;
        }
      });
      setGeneratedCode(generated);
    };

    genCodeForAllLanguages();
  }, [sdsl]);

  useEffect(() => {
    const languages = allLanguages.filter((lang) => lang.available);
    setLanguages(languages);
  }, []);

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
  };

  const handleCodeChange = (newCode: string) => {
    // Remove from generated code if it exists
    console.log(codeState);
    if (generatedCode[selectedLanguage]) {
      const newGeneratedCode = { ...generatedCode };
      delete newGeneratedCode[selectedLanguage];
      setGeneratedCode(newGeneratedCode);
    }

    // Update in codeState
    const existingCodeIndex = codeState.findIndex(
      (stub) => stub.language === selectedLanguage
    );

    if (existingCodeIndex !== -1) {
      const newCodeState = [...codeState];
      newCodeState[existingCodeIndex] = {
        ...newCodeState[existingCodeIndex],
        stub: newCode,
      };
      setCodeState(newCodeState);
    } else {
      setCodeState([
        ...codeState,
        {
          language: selectedLanguage,
          stub: newCode,
        },
      ]);
    }
  };

  const handleSave = () => {
    onClose?.();
  };

  // Get current code - first check codeState, then fallback to generated code
  const currentCode =
    codeState.find((stub) => stub.language === selectedLanguage)?.stub ||
    generatedCode[selectedLanguage] ||
    "";

  return (
    <div className="flex h-full min-h-screen bg-background flex-col">
      <div className="p-4 flex justify-between items-center">
        <div className="flex justify-center items-center gap-2 relative">
          <h1 className="text-xl font-semibold">
            Custom Scriptopia Domain Specific Language (SDSL) Builder
          </h1>
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <HelpCircle size={16} className="text-gray-500 cursor-help" />
            {showTooltip && (
              <div className="absolute left-0 top-6 w-72 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transform -translate-x-1/2">
                <div className="relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700" />
                  <p className="text-gray-700 dark:text-gray-300">
                    You can write custom driver code here. This is optional. If
                    you don't write any code here, the code will be generated
                    automatically.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} color="primary" className="gap-2">
            <Save size={16} />
            Save All
          </Button>
          <Button onClick={onClose} variant="bordered" className="gap-2">
            <X size={16} />
            Close
          </Button>
        </div>
      </div>

      <p className="text-sm my-2 px-3">
        Learn more about custom SDSL{" "}
        <span
          className="underline cursor-pointer text-warning-500"
          onClick={() =>
            window.open(
              "https://docs.scriptopia.tech/creating-a-problem/writing-the-sdsl-code-stub"
            )
          }
        >
          Here
        </span>
      </p>

      <div className="flex flex-1">
        <div className="w-64 border-r border-border bg-card p-4">
          <p className="text-m font-light text-gray-300 mb-4">Languages</p>
          <div className="space-y-8">
            {languages.map((lang) => (
              <Button
                key={lang.abbr}
                variant={selectedLanguage === lang.abbr ? "flat" : "light"}
                className={`w-full justify-start gap-3 h-12 rounded-md ${
                  selectedLanguage === lang.abbr
                    ? "text-primary font-light"
                    : "text-gray-500 font-normal"
                }`}
                onClick={() => handleLanguageChange(lang.abbr)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded">
                  <img
                    src={`/languages/${lang.abbr}.png` as string}
                    alt={`${lang.name} Icon`}
                    className="w-6 h-6"
                  />
                </div>
                <span className="font-normal">{lang.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Monaco
              code={currentCode}
              setCode={handleCodeChange}
              language={selectedLanguage}
              readOnly={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSdslEditor;
