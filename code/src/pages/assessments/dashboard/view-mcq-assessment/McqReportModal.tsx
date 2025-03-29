import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import Carousel from "./Carousel";

interface MCQ {
  question: string;
  type: string;
  options: string[];
  selected: string[];
  correct: string[];
  grade: number;
}

interface McqReportModalProps {
  mcqs: MCQ[];
  isOpen: boolean;
  onClose: () => void;
  mcqIndex: number;
  setMcqIndex: React.Dispatch<React.SetStateAction<number>>;
}

const McqReportModal: React.FC<McqReportModalProps> = ({
  mcqs,
  isOpen,
  onClose,
  mcqIndex,
  setMcqIndex,
}) => {
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
            <Carousel mcqs={mcqs} index={mcqIndex} setIndex={setMcqIndex} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default McqReportModal;
