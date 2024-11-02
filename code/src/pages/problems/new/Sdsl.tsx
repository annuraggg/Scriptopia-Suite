import { Button, Select, SelectItem } from "@nextui-org/react";
import Monaco from "@/components/problem/Editor/Monaco";
import { useState } from "react";
import languages from "@/data/languages";
import { generateSdslCode } from "@/functions/sdsl";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

type SupportedLanguages = "python" | "javascript" | "java";

const Sdsl = ({
  sdsl,
  setSdsl,
}: {
  sdsl: string;
  setSdsl: (sdsl: string) => void;
}) => {
  const [language, setLanguage] = useState<SupportedLanguages>("javascript");
  const [code, setCode] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editorUpdateFlag, setEditorUpdateFlag] = useState(false);

  const generateCode = () => {
    // if (language === "javascript") {
    //   const res: sdslReturnType = convertsdslToJs(sdsl);
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

    const code = generateSdslCode(sdsl, language);
    if (code.error || !code.code) {
      setCode("");
      setError(true);
      setErrorMessage(code.error || "Error Generating Code");
      return;
    }
    setError(false);
    setErrorMessage("");

    setCode(code.code);
    setEditorUpdateFlag((prev) => !prev);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="h-[90%] p-2">
      <p className="text-sm mb-2">
        Read More About Scriptopia Domain Specific Language (SDSL){" "}
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
      <div className="flex gap-5 h-full">
        <div className="w-full h-full relative">
          <textarea
            className="h-[90%] w-full bg-input rounded-xl p-5 outline-none resize-none"
            placeholder="Enter Your SDSL Here"
            value={sdsl}
            onChange={(e) => setSdsl(e.target.value)}
          />
          <div className="flex gap-3 items-center mt-3">
            <Select
              label="Language"
              selectedKeys={[language]}
              onChange={(e) =>
                setLanguage(e.target.value as SupportedLanguages)
              }
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
          <div className="h-[79%]">
            <Monaco
              code={code}
              setCode={setCode}
              language={language}
              readOnly={true}
              editorUpdateFlag={editorUpdateFlag}
            />
          </div>
          <Button
            className="w-full text-xs text-start justify-start border rounded-none"
            size="lg"
            color="warning"
            variant="light"
            onClick={onOpen}
          >
            or write Custom Driver Code (Advanced) - Optional
          </Button>
          {error && <p className="text-red-500 mt-3">{errorMessage}</p>}
        </div>
      </div>

      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Write Custom Driver Code
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  You can write custom driver code here. This is optional. If
                  you don't write any code here, the code will be generated
                  automatically. This can be useful if you want to write custom
                  driver code and SDSL is not enough.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Sdsl;
