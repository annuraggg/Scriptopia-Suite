import { Button, Card, CardBody } from "@nextui-org/react";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

interface SidebarProps {
  timer: number;
  assessment: MA;
  currentSection: number;
  setCurrentSection: (index: number) => void;
  submitAssessment: () => void;
}

const Sidebar = ({
  timer,
  assessment,
  currentSection,
  setCurrentSection,
  submitAssessment,
}: SidebarProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <Card className="min-h-full w-[20%] overflow-y-auto h-[94vh]  z-0">
      <div className="sticky p-5">
        <Button
          color="success"
          variant="flat"
          className="mb-3 w-full"
          onClick={onOpen}
        >
          Submit Assessment
        </Button>
        <p className="mt-5 text-center">Time Left: {formatTime(timer)}</p>
      </div>

      <CardBody className="h-full">
        <div>
          {assessment?.sections?.map((section, index) => (
            <div
              key={index}
              className={`mt-2 bg-card border-2 py-4 px-5 rounded-xl cursor-pointer transition-colors
                ${
                  currentSection === index
                    ? "bg-foreground-100"
                    : "hover:bg-foreground-100 bg-opacity-50"
                }
                `}
              onClick={() => setCurrentSection(index)}
            >
              <p>{section?.name}</p>
            </div>
          ))}
        </div>
      </CardBody>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submit Assessment
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to submit the assessment? You won't be
                  able to change your answers after submission.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    submitAssessment();
                    onClose();
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default Sidebar;
