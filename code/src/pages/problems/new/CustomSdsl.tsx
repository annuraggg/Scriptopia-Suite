import { useState } from "react";
import { Button } from "@nextui-org/react";
import Monaco from "@/components/problem/Editor/Monaco";
import { Save, HelpCircle, X } from "lucide-react";
import Js from "../../../assets/js.png"
import C from "../../../assets/c.png"
import Python from "../../../assets/python.png"
import Cpp from "../../../assets/c++.png"
import Ts from "../../../assets/ts.png"

interface Language {
  id: string;
  name: string;
  logo: string;
}

interface CodeState {
  [key: string]: {
    code: string;
    lastEdited: Date;
  };
}

interface CustomSdslEditorProps {
  onClose?: () => void;
  codeState: CodeState;
  setCodeState: React.Dispatch<React.SetStateAction<CodeState>>;
}

const languages: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    logo: Js,
  },
  {
    id: "python",
    name: "Python",
    logo: Python, 
  },
  {
    id: "c",
    name: "C",
    logo: C,
  },
  {
    id: "cpp",
    name: "C++",
    logo: Cpp,
  },
  {
    id: "typescript",
    name: "TypeScript",
    logo: Ts,
  },
];

const CustomSdslEditor = ({
  onClose,
  codeState,
  setCodeState,
}: CustomSdslEditorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0].id
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLanguageChange = (langId: string) => {
    setCodeState((prev: CodeState) => ({
      ...prev,
      [selectedLanguage]: {
        ...prev[selectedLanguage],
        lastEdited: new Date(),
      },
    }));
    setSelectedLanguage(langId);
  };

  const handleCodeChange = (newCode: string) => {
    setCodeState((prev: CodeState) => ({
      ...prev,
      [selectedLanguage]: {
        code: newCode,
        lastEdited: new Date(),
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving all code states:", codeState);
    onClose?.();
  };

  return (
    <div className="flex h-full min-h-screen bg-background flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2 relative">
          <h1 className="text-xl font-semibold">
            Custom Scriptopia Code Language (SCL) Builder
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

      <div className="flex flex-1">
        <div className="w-64 border-r border-border bg-card p-4">
          <p className="text-m font-light text-gray-300 mb-4">Languages</p>
          <div className="space-y-8">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                variant={selectedLanguage === lang.id ? "flat" : "light"}
                className={`w-full justify-start gap-3 h-12 rounded-md ${
                  selectedLanguage === lang.id
                    ? "text-primary font-light"
                    : "text-gray-500 font-normal"
                }`}
                onClick={() => handleLanguageChange(lang.id)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded">
                  <img
                    src={lang.logo}
                    typeof="image/svg+xml"
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
              code={codeState[selectedLanguage]?.code || ""}
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
