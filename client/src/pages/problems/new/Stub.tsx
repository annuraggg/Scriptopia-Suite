import { motion } from "framer-motion";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import starterGenerator from "@/functions/starterGenerator";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";
import languages from "@/data/languages";
import { IFunctionArg } from "@/@types/Problem";

const Stub = ({
  functionName,
  setFunctionName,
  returnType,
  setReturnType,
  fnArguments,
  setFnArguments,
}: {
  functionName: string;
  setFunctionName: (value: string) => void;
  returnType: string;
  setReturnType: (value: string) => void;
  fnArguments: IFunctionArg[];
  setFnArguments: (
    value: IFunctionArg[] | ((prev: IFunctionArg[]) => IFunctionArg[])
  ) => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (isOpen) {
      monaco.editor.create(document.getElementById("code-editor")!, {
        value: starterGenerator(
          functionName,
          fnArguments,
          returnType,
          language
        ),
        language: language,
        theme: "vs-dark",
        readOnly: true,
        overviewRulerBorder: false,
        // disable the minimap
        minimap: {
          enabled: false,
        },
        lineNumbers: "off",
      });

      return () => {
        monaco.editor.getModels().forEach((model) => model.dispose());
      };
    }
  }, [isOpen, functionName, fnArguments, returnType, language]);

  const handleArgumentNameChange = (index: number, newName: string) => {
    setFnArguments((prev) =>
      prev.map((arg, i) => (i === index ? { ...arg, name: newName } : arg))
    );
  };

  const handleArgumentTypeChange = (index: number, newType: string) => {
    setFnArguments((prev: IFunctionArg[]) => {
      const newArgs = [...prev];
      newArgs[index].type = newType as "string" | "number" | "boolean" | "array";
      return newArgs;
    });
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <div className="px-5 py-2">
        <p>Function Definition</p>
        <div className="flex gap-5 mt-5">
          <Input
            label="Function Name"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            size="sm"
          />
          <Select
            label="Return Type"
            selectedKeys={[returnType]}
            onChange={(e) => setReturnType(e.target.value as string)}
            size="sm"
          >
            <SelectItem key="string" value="string">
              String
            </SelectItem>
            <SelectItem key="number" value="number">
              Number
            </SelectItem>
            <SelectItem key="boolean" value="boolean">
              Boolean
            </SelectItem>
            <SelectItem key="array" value="array">
              Array
            </SelectItem>
          </Select>
        </div>

        <div className="mt-5">
          <div className="flex gap-5 items-center">
            <p>Function Arguments</p>
            <Button
              variant="flat"
              onClick={() =>
                setFnArguments((prev: IFunctionArg[]) => [
                  ...prev,
                  { name: "", type: "string" },
                ])
              }
            >
              Add Argument
            </Button>
            <Button
              variant="flat"
              color="danger"
              onClick={() => setFnArguments([])}
            >
              Remove All
            </Button>
            <Button variant="flat" color="success" onClick={onOpen}>
              Preview Stub
            </Button>
          </div>
          <div className="flex flex-col gap-5 mt-5">
            {fnArguments.map((arg, index) => (
              <div key={index} className="flex gap-5 items-center">
                <Input
                  label="Argument Name"
                  value={arg.name}
                  onChange={(e) =>
                    handleArgumentNameChange(index, e.target.value)
                  }
                  size="sm"
                />
                <Select
                  label="Datatype"
                  selectedKeys={[arg.type]}
                  onChange={(e) =>
                    handleArgumentTypeChange(index, e.target.value as string)
                  }
                  size="sm"
                >
                  <SelectItem key="string" value="string">
                    String
                  </SelectItem>
                  <SelectItem key="number" value="number">
                    Number
                  </SelectItem>
                  <SelectItem key="boolean" value="boolean">
                    Boolean
                  </SelectItem>
                  <SelectItem key="array" value="array">
                    Array
                  </SelectItem>
                </Select>
                <Button
                  variant="light"
                  color="danger"
                  onClick={() =>
                    setFnArguments((prev: IFunctionArg[]) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            <ModalHeader>Preview Stub</ModalHeader>
            <ModalBody className="p-5">
              <p>This is a preview of your stub, that the user will see.</p>
              <Select
                label="Language"
                selectedKeys={[language]}
                onChange={(e) => setLanguage(e.target.value as string)}
                size="sm"
              >
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </Select>

              <div
                id="code-editor"
                className="border h-[30vh] w-full z-50 overflow-visible rounded-lg"
              ></div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onClick={onOpenChange}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </motion.div>
  );
};

export default Stub;
