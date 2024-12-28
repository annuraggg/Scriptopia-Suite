import { useEffect, useState, useCallback } from "react";
import Sidebar from "./code/Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Problem } from "@shared-types/Problem";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { Assessment } from "@shared-types/Assessment";
import ProblemComponent from "@/components/problem/Problem";
import languagesArray from "@/data/languages";
import {CodeAssessmentSubmissionsSchema as CASS} from "@shared-types/CodeAssessmentSubmission"
import secureLocalStorage from "react-secure-storage";
import ax from "@/config/axios";
import { toast } from "sonner";
import Submit from "./Submit";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

// Types
interface CodeDashboardProps {
  timer: number;
  assessment: PopulatedAssessment;
  loading: boolean;
  assessmentSub: CASS;
  setAssessmentSub: (sub: CASS) => void;
}

interface PopulatedAssessment extends Omit<Assessment, "problems"> {
  problems: Problem[];
}

interface SubmitData {
  code?: string;
  language?: string;
  problemId?: string;
}

interface StorageCredentials {
  email: string;
}

const getStorageCredentials = (): StorageCredentials | null => {
  return secureLocalStorage.getItem("cred-track") as StorageCredentials;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const CodeDashboard: React.FC<CodeDashboardProps> = ({
  timer,
  assessment,
  loading,
  assessmentSub,
  setAssessmentSub,
}) => {
  // State management
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitData, setSubmitData] = useState<SubmitData>({});

  // Assessment state
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [sessionPlaybackStarted, setSessionPlaybackStarted] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Initialize problems
  useEffect(() => {
    if (!assessment?.problems) return;
    setProblems(assessment.problems);
  }, [assessment]);

  // Handlers
  const openModal = useCallback(
    (code: string, language: string, problemId: string) => {
      onOpen();
      setSubmitData({ code, language, problemId });
    },
    [onOpen]
  );

  const handleSubmit = useCallback(
    async (onClose: () => void) => {
      setSubmitLoading(true);

      try {
        const credentials = getStorageCredentials();
        if (!credentials?.email) {
          throw new Error("No credentials found");
        }

        const axios = ax();
        const response = await axios.post(
          "/assessments/submit/code/individual",
          {
            ...submitData,
            assessmentId: assessment._id,
            email: credentials.email,
          }
        );

        setAssessmentSub(response.data.data);
        onClose();
        setCurrentProblem(null);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Failed to submit assessment");
      } finally {
        setSubmitLoading(false);
      }
    },
    [submitData, assessment._id, setAssessmentSub]
  );

  // Security Features - Tab Change Detection
  useEffect(() => {
    if (!assessment) return;
    if (!currentProblem) return;

    if (assessment.security.tabChangeDetection) {
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          socket.emit("tab-change-code", {
            assessmentId: assessment._id,
            email: getStorageCredentials()?.email || "anonymous",
            problem: currentProblem?._id,
          });
        }
      });
    }
  }, [assessment, currentProblem]);

  // Security Features - Code Playback
  useEffect(() => {
    const startSession = async () => {
      if (!assessment.security.codePlayback) return;

      if (assessmentCompleted) {
        window?.sessionRewind?.stopSession();
      }

      if (!assessment) return;
      if (sessionPlaybackStarted) return;

      if (assessment.security.codePlayback) {
        window?.sessionRewind?.identifyUser({
          userId: getStorageCredentials()?.email || "anonymous",
        });
        window?.sessionRewind?.startSession();
        await delay(10000);

        socket.emit("session-url", {
          assessmentId: assessment._id,
          email: getStorageCredentials()?.email || "anonymous",
          sessionUrl: window?.sessionRewind?.getSessionUrl(),
        });

        console.log("Session started");
        setSessionPlaybackStarted(true);
      }
    };

    startSession();
  }, [assessment, assessmentCompleted]);

  // Early return for completed assessment
  if (assessmentCompleted) {
    return (
      <Submit
        assessmentSubmitted={assessmentSubmitted}
        submitSuccess={submitSuccess}
      />
    );
  }

  // Render sidebar content
  const renderSidebarContent = (isInsideSheet = false) => (
    <Sidebar
      problems={problems}
      currentProblem={currentProblem}
      setCurrentProblem={setCurrentProblem}
      isInsideSheet={isInsideSheet}
      timer={timer}
      assessmentSub={assessmentSub}
      setAssessmentCompleted={setAssessmentCompleted}
      setAssessmentSubmitted={setAssessmentSubmitted}
      setSubmitSuccess={setSubmitSuccess}
    />
  );

  return (
    <div className="h-full p-5">
      <div className="flex gap-5">
        <p>Code Assessment</p>
      </div>

      <div className="mt-5 h-[95%] flex gap-2">
        {currentProblem ? (
          <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="left">
                {renderSidebarContent(true)}
              </SheetContent>
            </Sheet>

            <Card
              className="h-full flex items-center justify-center px-3"
              isPressable
              onClick={() => setSheetOpen(true)}
            >
              <ChevronRight className="opacity-70 cursor-pointer" />
            </Card>

            <ProblemComponent
              loading={loading}
              problem={currentProblem}
              defaultLanguage={assessment.languages[0]}
              languages={languagesArray.filter((lang) =>
                assessment.languages.includes(lang.abbr)
              )}
              allowSubmissionsTab={false}
              allowExplain={false}
              submitOverride={openModal}
              allowHighlighting={assessment.security.enableSyntaxHighlighting}
            />
          </>
        ) : (
          <div className="w-[30%]">{renderSidebarContent()}</div>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are You Sure?
              </ModalHeader>
              <ModalBody>
                You won't be able to change your code after submission.
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={submitLoading}
                >
                  Close
                </Button>
                <Button
                  onPress={() => handleSubmit(onClose)}
                  isLoading={submitLoading}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CodeDashboard;
