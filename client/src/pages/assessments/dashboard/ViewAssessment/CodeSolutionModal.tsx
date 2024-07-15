import React, { useEffect, useRef } from "react";
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
} from "@nextui-org/react";
import { ClipboardListIcon, Clock, CodeXml } from "lucide-react";
import { ArrowLeftRight, Scissors } from "lucide-react";
import { Tabs, Tab } from "@nextui-org/tabs";
import * as monaco from "monaco-editor";

interface CodeSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeSolutionModal: React.FC<CodeSolutionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const leftCard = [
    {
      title: "Time Taken",
      status: "150s",
      icon: <Clock size={20} />,
    },
    {
      title: "Solution",
      status: "Accepted",
      icon: <ClipboardListIcon size={20} />,
    },
    {
      title: "Programming Language",
      status: "Javascript",
      icon: <CodeXml size={20} />,
    },
  ];

  const rightCard = [
    {
      title: "Pasted Code",
      status: "NO",
      icon: <Scissors size={20} />,
    },
    {
      title: "Window Switch",
      status: "NO",
      icon: <ArrowLeftRight size={20} />,
    },
  ];

  const code = `function add(a, b) {
    return a + b;
    }`;

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && editorRef.current) {
      const editor = monaco.editor.create(editorRef.current!, {
        value: code,
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
        editor.dispose();
      };
    }
  }, [code, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="min-w-[60%]">
      <ModalContent>
        <ModalHeader>Code Solution</ModalHeader>
        <ModalBody>
          <div className="flex gap-3">
            <Card className="w-full border drop-shadow-sm">
              <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
                {leftCard.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-3 flex-row w-full"
                  >
                    <div className="flex gap-2">
                      {item.icon}
                      <p className="text-sm">{item.title}</p>
                    </div>
                    <p className="text-sm text-green-500 ml-[90px]">
                      {item.status}
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card className="w-full border drop-shadow-sm">
              <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
                {rightCard.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-3 flex-row w-full"
                  >
                    <div className="flex gap-2">
                      {item.icon}
                      <p className="text-sm">{item.title}</p>
                    </div>
                    <p className="text-sm text-green-500 ml-[90px]">
                      {item.status}
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <Tabs aria-label="Options">
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
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>3</TableCell>
                      </TableRow>
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
