import { useCallback, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Start from "./Start";
import { CodeAssessment as CA } from "@shared-types/CodeAssessment";
import { Problem } from "@shared-types/Problem";
import { io, Socket } from "socket.io-client";
import secureLocalStorage from "react-secure-storage";
import { CodeAssessmentSubmission as CASS } from "@shared-types/CodeAssessmentSubmission";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useDisclosure } from "@heroui/react";

// Constants
const SOCKET_URL = import.meta.env.VITE_API_URL!;
const SYNC_INTERVAL = 8;
const TIMER_INTERVAL = 1000;

// Types
type Screen = "start" | "dashboard" | "problem" | "result";

interface PopAssessment extends Omit<CA, "problems"> {
  problems: Problem[];
}

interface StorageCredentials {
  email: string;
  name: string;
}

// Initialize socket outside component to prevent recreation
const socket: Socket = io(SOCKET_URL);

const Assess = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number>(0);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessment, setAssessment] = useState<PopAssessment | null>(null);
  const [assessmentSub, setAssessmentSub] = useState<CASS | null>(null);

  // Utility functions
  const getStorageCredentials = (): StorageCredentials | null => {
    return secureLocalStorage.getItem(
      "cred-track"
    ) as StorageCredentials | null;
  };

  const getAssessmentIdFromUrl = (): string | null => {
    return window.location.pathname.split("/").pop() || null;
  };

  // Timer Logic
  useEffect(() => {
    if (!assessment || currentScreen === "start" || !assessmentStarted) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, TIMER_INTERVAL);

    return () => clearInterval(timerInterval);
  }, [assessment, currentScreen, assessmentStarted]);

  // Alert Effect
  useEffect(() => {
    if (
      !assessment ||
      currentScreen === "start" ||
      !assessmentStarted ||
      assessmentCompleted
    )
      return;

    if (timer === 30) {
      toast.warning("30 seconds left");
    }

    // 1 minute
    if (timer === 60) {
      toast.warning("1 minute left");
    }

    // 3 minutes
    if (timer === 180) {
      toast.warning("3 minutes left");
    }

    // 5 minutes
    if (timer === 300) {
      toast.warning("5 minutes left");
    }

    if (timer === 0) {
      toast.error("Time's up!");
      submitAssessment();
      return;
    }
  }, [timer]);

  // Sync Timer with Server
  useEffect(() => {
    if (!assessment || currentScreen === "start" || !assessmentStarted) return;
    if (timer % SYNC_INTERVAL !== 0) return;

    const credentials = getStorageCredentials();
    const assessmentId = getAssessmentIdFromUrl();

    if (!credentials?.email || !assessmentId) return;

    socket.emit("timeSync-code", {
      time: timer,
      assessmentId,
      email: credentials.email,
    });
  }, [timer, assessment, currentScreen, assessmentStarted]);

  useEffect(() => {
    const checkExistingProgress = async () => {
      const credentials = getStorageCredentials();
      const assessmentId = getAssessmentIdFromUrl();
      if (!credentials?.email || !assessmentId) return;

      try {
        const axios = ax();
        const response = await axios.post("/assessments/code/check-progress", {
          email: credentials.email,
          assessmentId,
        });

        if (response.data?.data?.exists === false) return;

        const { submission, assessment: assessmentData } = response.data.data;

        setAssessmentSub(submission);
        setTimer(submission.timer);
        setAssessment(assessmentData);
        setCurrentScreen("dashboard");
        setLoading(false);
        setAssessmentStarted(true);
      } catch (error) {
        console.error("Failed to check assessment progress:", error);
      }
    };

    checkExistingProgress();
  }, []);

  const startAssessment = useCallback(
    (email: string, name: string) => {
      if (!assessment) return;

      const assessmentSubmission: CASS = {
        assessmentId: assessment._id ?? "",
        name,
        email,
        timer: assessment.timeLimit * 60,
      };

      secureLocalStorage.setItem("cred-track", { email, name });
      socket.emit("start-code-assessment", assessmentSubmission);

      setTimer(assessment.timeLimit * 60);
      setCurrentScreen("dashboard");
      setLoading(false);
      setAssessmentStarted(true);
    },
    [assessment]
  );

  const getCredentials = () => {
    const credTrack = secureLocalStorage.getItem("cred-track") as {
      email: string;
    } | null;
    if (!credTrack?.email) {
      throw new Error("User credentials not found");
    }
    return credTrack;
  };

  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: fullSubmitIsOpen,
    onOpen: fullSubmitOnOpen,
    onOpenChange: fullSubmitOnOpenChange,
  } = useDisclosure();

  const submitAssessment = async (onClose?: () => void) => {
    try {
      if (onClose) {
        onClose();
      }

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

  return (
    <div className="h-screen">
      {currentScreen === "start" && (
        <Start
          parentScreen={currentScreen}
          setParentScreen={setCurrentScreen}
          assessment={assessment as PopAssessment}
          setAssessment={setAssessment}
          startAssessment={startAssessment}
        />
      )}

      {currentScreen === "dashboard" && assessment && (
        <>
          <Dashboard
            timer={timer}
            assessment={assessment}
            loading={loading}
            setAssessmentSub={setAssessmentSub}
            assessmentSub={assessmentSub!}
            setAssessmentCompleted={setAssessmentCompleted}
            setAssessmentSubmitted={setAssessmentSubmitted}
            setSubmitSuccess={setSubmitSuccess}
            assessmentCompleted={assessmentCompleted}
            assessmentSubmitted={assessmentSubmitted}
            submitSuccess={submitSuccess}
            onOpen={onOpen}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            submitAssessment={submitAssessment}
            fullSubmitIsOpen={fullSubmitIsOpen}
            onFullSubmitOpen={fullSubmitOnOpen}
            onFullSubmitChange={fullSubmitOnOpenChange}
          />
        </>
      )}
    </div>
  );
};

export default Assess;
