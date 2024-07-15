import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Input,
} from "@nextui-org/react";
import { ArrowLeftRight, Scissors } from "lucide-react";
import Carousel from "./Carousel";

interface McqReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const McqReportModal: React.FC<McqReportModalProps> = ({ isOpen, onClose }) => {

  const mcqs = [
    {
      question: "What is the capital of France?",
      type: "multiple",
      options: ["Paris", "Berlin", "London", "Madrid"],
      selected: ["Paris"],
      correct: ["Paris"],
    },
    {
      question: "Who is CEO of Tesla?",
      type: "checkbox",
      options: ["Jeff Bezos", "Elon Musk", "Bill Gates", "Tony Stark"],
      selected: ["Elon Musk", "Tony Stark"],
      correct: ["Elon Musk"],
    },
    {
      question: "The iPhone was created by which company?",
      type: "text",
      answer: "The iPhone was created by Apple.",
    },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        className="min-w-[50%]"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-2 p-6">
            MCQ Result
          </ModalHeader>
          <ModalBody className="">
            <div className="flex gap-5 w-full">
              <Card className="w-full border drop-shadow-sm">
                <CardBody className="flex justify-start items-start gap-3 flex-col p-8">
                  <div className="flex justify-between items-center gap-3 flex-row w-full">
                    <div className="flex gap-2">
                      <Scissors className="text-white" size={20} />
                      <p className="text-sm">Pasted Code</p>
                    </div>
                    <p className="text-sm text-green-500 ml-[90px]">NO</p>
                  </div>
                  <div className="flex justify-between items-center gap-3 flex-row w-full">
                    <div className="flex gap-2">
                      <ArrowLeftRight className="text-white" size={20} />
                      <p className="text-sm">Window Switch</p>
                    </div>
                    <p className="text-sm text-green-500 ml-[68px]">NO</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="flex my-2 gap-3">

              <Input placeholder="Search for a question" />
            </div>

            <Carousel mcqs={mcqs} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default McqReportModal;
