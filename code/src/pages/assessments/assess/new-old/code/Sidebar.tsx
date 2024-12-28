import ax from "@/config/axios";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { AssessmentSubmissionsSchema } from "@shared-types/AssessmentSubmission";
import { Problem } from "@shared-types/Problem";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";

interface SidebarProps {
  problems: Problem[];
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem) => void;
  isInsideSheet?: boolean;
  timer: number;
  assessmentSub: AssessmentSubmissionsSchema;
  setAssessmentCompleted: (completed: boolean) => void;
  setAssessmentSubmitted: (submitted: boolean) => void;
  setSubmitSuccess: (success: boolean) => void;
}

const Sidebar = ({
  problems,
  currentProblem,
  setCurrentProblem,
  isInsideSheet = false,
  timer,
  assessmentSub,
  setAssessmentCompleted,
  setAssessmentSubmitted,
  setSubmitSuccess,
}: SidebarProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getCredentials = () => {
    const credTrack = secureLocalStorage.getItem("cred-track") as {
      email: string;
    } | null;
    if (!credTrack?.email) {
      throw new Error("User credentials not found");
    }
    return credTrack;
  };

  const submitAssessment = async (onClose: () => void) => {
    try {
      onClose();
      setAssessmentCompleted(true);

      const { email } = getCredentials();
      const assessmentId = window.location.pathname.split("/").pop();

      if (!assessmentId) {
        throw new Error("Assessment ID not found");
      }

      const data = { email, assessmentId, timer };

      const axios = ax();
      const response = await axios.post("/assessments/submit/code", data);

      if (response.data) {
        toast.success("Assessment submitted successfully");
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      toast.error("Failed to submit assessment");
      setSubmitSuccess(false);
    } finally {
      setAssessmentSubmitted(true);
    }
  };

  const handleProblemClick = (problem: Problem) => {
    const isSubmitted = assessmentSub?.submissions?.some(
      (submission) => submission.problemId === problem._id
    );

    if (!isSubmitted) {
      setCurrentProblem(problem);
    }
  };

  return (
    <Card
      className={`min-h-full w-full overflow-y-auto
        ${isInsideSheet ? "bg-transparent shadow-none" : ""}
    `}
    >
      <div className="sticky p-5">
        <Button
          color="success"
          variant="flat"
          className="mb-3 w-full"
          onClick={onOpen}
        >
          Submit Assessment
        </Button>
        <Progress value={50} label="Progress" />
        <p className="mt-5 text-center">Time Left: {formatTime(timer)}</p>
      </div>

      <CardBody
        className={`h-full ${
          isInsideSheet ? "bg-transparent border-none drop-shadow-none" : ""
        }`}
      >
        <div>
          {problems.map((problem) => {
            const isSubmitted = assessmentSub?.submissions?.some(
              (submission) => submission.problemId === problem._id
            );
            const isCurrentProblem = currentProblem?._id === problem._id;

            return (
              <div
                key={problem._id}
                className={`mt-2 bg-card border-2 py-4 px-5 rounded-xl cursor-pointer transition-colors
                  ${isCurrentProblem ? "bg-foreground-100" : ""}
                  ${
                    isSubmitted
                      ? "bg-foreground-100 opacity-50"
                      : "hover:bg-foreground-100 bg-opacity-50"
                  }
                `}
                onClick={() => handleProblemClick(problem)}
              >
                <p>{problem?.title}</p>
                {isSubmitted && (
                  <p className="text-sm text-gray-500">Submitted</p>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are You Sure?
              </ModalHeader>
              <ModalBody>
                You won't be able to make changes after submission.
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button onPress={() => submitAssessment(onClose)}>
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
