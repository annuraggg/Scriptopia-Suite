import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/react";
import { ClipboardListIcon, CodeXml } from "lucide-react";
import { ArrowLeftRight, Scissors } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";
import * as monaco from "monaco-editor";

interface CodeSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
}

interface Problem {
  solution: boolean;
  language: string;
  pasted: boolean;
  windowSwitch: boolean;
  code: string;
  testCases: { input: string; output: string; expected: string }[];
}

const CodeSolutionModal: React.FC<CodeSolutionModalProps> = ({
  isOpen,
  onClose,
  problem,
}) => {
  const leftCard = [
    {
      title: "Solution",
      status: problem?.solution ? "ACCEPTED" : "REJECTED",
      icon: <ClipboardListIcon size={20} />,
    },
    {
      title: "Programming Language",
      status: problem?.language,
      icon: <CodeXml size={20} />,
    },
  ];

  const rightCard = [
    {
      title: "Pasted Code",
      status: problem?.pasted ? "YES" : "NO",
      icon: <Scissors size={20} />,
    },
    {
      title: "Window Switch",
      status: problem?.windowSwitch ? "YES" : "NO",
      icon: <ArrowLeftRight size={20} />,
    },
  ];

  const [tab, setTab] = useState("code");

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      console.log(problem.code)
      if (isOpen && editorRef?.current) {
        const editor = monaco?.editor?.create(editorRef.current!, {
          value: problem?.code,
          language: "javascript",
          theme: "vs-dark",
          readOnly: true,
          overviewRulerBorder: false,
          minimap: {
            enabled: false,
          },
          lineNumbers: "off",
        });

        return () => {
          editor?.dispose();
        };
      }
    }, 100);
  }, [problem, isOpen, tab]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="min-w-[60%]">
      <ModalContent>
        <ModalHeader>Code Solution</ModalHeader>
        <ModalBody>
          <div className="flex gap-3">
            <Card className="w-full border drop-shadow-sm">
              <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
                {leftCard?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-3 flex-row w-full"
                  >
                    <div className="flex gap-2">
                      {item?.icon}
                      <p className="text-sm">{item?.title}</p>
                    </div>
                    <p
                      className={`text-sm  ml-[90px]
                      ${
                        item?.status === "ACCEPTED"
                          ? "text-green-500"
                          : item?.status === "REJECTED"
                          ? "text-red-500"
                          : ""
                      }
                      `}
                    >
                      {item?.status}
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card className="w-full border drop-shadow-sm">
              <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
                {rightCard?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-3 flex-row w-full"
                  >
                    <div className="flex gap-2">
                      {item?.icon}
                      <p className="text-sm">{item?.title}</p>
                    </div>
                    <p
                      className={`text-sm ml-[90px]
                      ${
                        item?.status === "NO"
                          ? "text-green-500"
                          : item?.status === "YES"
                          ? "text-red-500"
                          : ""
                      }
                      `}
                    >
                      {item?.status}
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <Tabs
            aria-label="Options"
            selectedKey={tab} // @ts-expect-error - Type 'string' is not assignable to type 'TabKey'
            onSelectionChange={setTab}
          >
            <Tab key="code" title="Code">
              <Card>
                <CardBody>
                  <div
                    id="code-editor"
                    className="border h-[30vh] w-full z-50 overflow-visible rounded-lg"
                    ref={editorRef}
                  ></div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="cases" title="Test Cases">
              <Card>
                <CardBody className="border">
                  <Table removeWrapper>
                    <TableHeader>
                      <TableColumn>Input</TableColumn>
                      <TableColumn>Output</TableColumn>
                      <TableColumn>Expected</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {problem?.testCases?.map((testCase, index) => (
                        <TableRow key={index}>
                          <TableCell>{testCase?.input}</TableCell>
                          <TableCell>{testCase?.output}</TableCell>
                          <TableCell>{testCase?.expected}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CodeSolutionModal;
