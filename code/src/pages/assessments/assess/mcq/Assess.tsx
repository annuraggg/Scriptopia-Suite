import { useCallback, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Start from "./Start";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import { io, Socket } from "socket.io-client";
import secureLocalStorage from "react-secure-storage";
import { MCQAssessmentSubmission as MASS } from "@shared-types/MCQAssessmentSubmission";
import ax from "@/config/axios";
import { toast } from "sonner";
import Submit from "./Submit";

// Constants
const SOCKET_URL = import.meta.env.VITE_API_URL;
const SYNC_INTERVAL = 8;
const TIMER_INTERVAL = 1000;

// Types
type Screen = "start" | "dashboard" | "result";

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
  const [assessment, setAssessment] = useState<MA | null>(null);
  const [assessmentSub, setAssessmentSub] = useState<MASS | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [sessionPlaybackStarted, setSessionPlaybackStarted] = useState(false);

  // Utility functions
  const getStorageCredentials = (): StorageCredentials | null => {
    return secureLocalStorage.getItem(
      "cred-track"
    ) as StorageCredentials | null;
  };

  const getAssessmentIdFromUrl = (): string | null => {
    return window.location.pathname.split("/").pop() || null;
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // AutoSave Every 10 seconds
  useEffect(() => {
    if (!assessment || currentScreen === "start" || !assessmentStarted) return;

    const autoSaveInterval = setInterval(() => {
      const submissions = assessmentSub?.mcqSubmissions || [];
      socket.emit("auto-save-mcq", {
        assessmentId: assessment._id,
        submissions,
        email: getStorageCredentials()?.email || "anonymous",
      });
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [assessment, currentScreen, assessmentStarted]);

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

  // Tab Change
  useEffect(() => {
    if (!assessment) return;

    if (assessment.security.tabChangeDetection) {
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          socket.emit("tab-change-mcq", {
            assessmentId: assessment._id,
            email: getStorageCredentials()?.email || "anonymous",
          });
        }
      });
    }
  }, [assessment]);

  // Sync Timer with Server
  useEffect(() => {
    if (!assessment || currentScreen === "start" || !assessmentStarted) return;
    if (timer % SYNC_INTERVAL !== 0) return;

    const credentials = getStorageCredentials();
    const assessmentId = getAssessmentIdFromUrl();

    if (!credentials?.email || !assessmentId) return;

    socket.emit("timeSync-mcq", {
      time: timer,
      assessmentId,
      email: credentials.email,
    });
  }, [timer, assessment, currentScreen, assessmentStarted]);

  // Security Features - Code Playback
  useEffect(() => {
    const startSession = async () => {
      if (!assessment) return;
      if (!assessment.security?.sessionPlayback) return;

      if (assessmentCompleted) {
        window?.sessionRewind?.stopSession();
      }

      if (!assessment) return;
      if (sessionPlaybackStarted) return;

      if (assessment.security.sessionPlayback) {
        window?.sessionRewind?.identifyUser({
          userId: getStorageCredentials()?.email || "anonymous",
        });
        window?.sessionRewind?.startSession();
        await delay(10000);

        socket.emit("session-url-mcq", {
          assessmentId: assessment._id,
          email: getStorageCredentials()?.email || "anonymous",
          sessionUrl: window?.sessionRewind?.getSessionUrl(),
        });

        setSessionPlaybackStarted(true);
      }
    };

    startSession();
  }, [assessment, assessmentCompleted]);

  useEffect(() => {
    const checkExistingProgress = async () => {
      const credentials = getStorageCredentials();
      const assessmentId = getAssessmentIdFromUrl();

      if (!credentials?.email || !assessmentId) return;

      try {
        const axios = ax();
        const response = await axios.post("/assessments/mcq/check-progress", {
          email: credentials.email,
          assessmentId,
        });

        if (response.data?.data?.exists === false) {
          setLoading(false);
          setAssessmentSub({} as MASS);
          return
        };

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

      const assessmentSubmission: MASS = {
        assessmentId: assessment._id ?? "",
        name,
        email,
        mcqSubmissions: [],
        timer: assessment.timeLimit * 60,
      };

      secureLocalStorage.setItem("cred-track", { email, name });
      socket.emit("start-mcq-assessment", assessmentSubmission);

      setAssessmentSub(assessmentSubmission);
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

  const submitAssessment = async () => {
    try {
      setAssessmentCompleted(true);

      const { email } = getCredentials();
      const assessmentId = window.location.pathname.split("/").pop();

      if (!assessmentId) {
        throw new Error("Assessment ID not found");
      }

      const data = { email, assessmentId, timer, assessmentSub };

      const axios = ax();
      const response = await axios.post("/assessments/submit/mcq", data);

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

  if (assessmentCompleted) {
    return (
      <Submit
        assessmentSubmitted={assessmentSubmitted}
        submitSuccess={submitSuccess}
      />
    );
  }

  return (
    <div className="h-screen">
      {currentScreen === "start" && (
        <Start
          parentScreen={currentScreen}
          setParentScreen={setCurrentScreen}
          assessment={assessment as MA}
          setAssessment={setAssessment}
          startAssessment={startAssessment}
        />
      )}

      {/* {currentScreen === "dashboard" && assessment && ( */}
      {currentScreen === "dashboard" && (
        <>
          <Dashboard
            timer={timer}
            assessment={assessment as MA}
            setAssessment={setAssessment}
            loading={loading}
            setAssessmentSub={setAssessmentSub}
            assessmentSub={assessmentSub!}
            submitAssessment={submitAssessment}
            // setAssessmentCompleted={setAssessmentCompleted}
            // setAssessmentSubmitted={setAssessmentSubmitted}
            // setSubmitSuccess={setSubmitSuccess}
            // assessmentCompleted={assessmentCompleted}
            // assessmentSubmitted={assessmentSubmitted}
            // submitSuccess={submitSuccess}
            // onOpen={onOpen}
            // isOpen={isOpen}
            // onOpenChange={onOpenChange}
            // submitAssessment={submitAssessment}
            // fullSubmitIsOpen={fullSubmitIsOpen}
            // onFullSubmitOpen={fullSubmitOnOpen}
            // onFullSubmitChange={fullSubmitOnOpenChange}
          />
        </>
      )}
    </div>
  );
};

export default Assess;
