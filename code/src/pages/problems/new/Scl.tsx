import { Button, Select, SelectItem } from "@nextui-org/react";
import Monaco from "@/components/problem/Editor/Monaco";
import { useState } from "react";
import languages from "@/data/languages";
import { convertSclToJs, sclReturnType } from "@/functions/scl";
import { parseSCL, generateCode as generateSclCode } from "@/functions/scl/scl";

type SupportedLanguages = "python" | "javascript" | "java";

const Scl = ({
  scl,
  setScl,
  setVariableWithDataType,
}: {
  scl: string;
  setScl: (scl: string) => void;
  setVariableWithDataType: (
    variableWithDataType: { name: string; type: string }[]
  ) => void;
}) => {
  const [language, setLanguage] = useState<SupportedLanguages>("javascript");
  const [code, setCode] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editorUpdateFlag, setEditorUpdateFlag] = useState(false);

  const generateCode = () => {
    // if (language === "javascript") {
    //   const res: sclReturnType = convertSclToJs(scl);
    //   if (res.error) {
    //     setError(true);
    //     setErrorMessage(res?.message || "Error Generating Code");
    //     return;
    //   }
    //   if (res.code) {
    //     setCode(res.code);
    //     setVariableWithDataType(res.variableWithDataType);
    //   }
    //   setError(false);
    //   setEditorUpdateFlag((prev) => !prev);
    // }

    const code = generateSclCode(scl, language);
    if (code.error || !code.success || !code.code) {
      setError(true);
      setErrorMessage(code.error || "Error Generating Code");
      return;
    }

    setCode(code.code);
    setEditorUpdateFlag((prev) => !prev);
  };

  return (
    <div className="h-[90%] p-2">
      <p className="text-sm mb-2">
        Read More About Scriptopia Code Language (SCL){" "}
        <span className="underline cursor-pointer text-warning-500">Here</span>
      </p>
      <div className="flex gap-5 h-full">
        <div className="w-full h-full relative">
          <textarea
            className="h-[90%] w-full bg-input rounded-xl p-5 outline-none resize-none"
            placeholder="Enter Your SCL Here"
            value={scl}
            onChange={(e) => setScl(e.target.value)}
          />
          <div className="flex gap-3 items-center mt-3">
            <Select
              label="Language"
              selectedKeys={[language]}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguages)}
              size="sm"
            >
              {/* @ts-expect-error => language.available is not defined */}
              {languages.map(
                (language) =>
                  language.available && (
                    <SelectItem key={language.abbr} value={language.abbr}>
                      {language.name}
                    </SelectItem>
                  )
              )}
            </Select>
            <Button
              className="w-full text-sm"
              size="lg"
              color="success"
              variant="flat"
              onClick={generateCode}
            >
              Generate Driver Code
            </Button>
          </div>
        </div>
        <div className="w-full">
          <div className="h-[90%]">
            <Monaco
              code={code}
              setCode={setCode}
              language={language}
              readOnly={true}
              editorUpdateFlag={editorUpdateFlag}
            />
          </div>
          {error && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Scl;
