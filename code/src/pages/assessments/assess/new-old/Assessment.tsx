import {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import Start from "./Start";
import MCQDashboard from "./MCQDashboard";
import CodeDashboard from "./CodeDashboard";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import { CodeAssessment as CA } from "@shared-types/CodeAssessment";
import { io, Socket } from "socket.io-client";
import secureLocalStorage from "react-secure-storage";
import ax from "@/config/axios";
import { Problem } from "@shared-types/Problem";

import { MCQAssessmentSubmissionsSchema as MASS } from "@shared-types/MCQAssessmentSubmission";
import { CodeAssessmentSubmissionsSchema as CASS } from "@shared-types/CodeAssessmentSubmission";

// Constants moved to top level
const SOCKET_URL = "http://localhost:4000";
const SYNC_INTERVAL = 8;
const TIMER_INTERVAL = 1000;

// Types moved to separate block for better organization
type Screen = "start" | "dashboard" | "problem" | "result";
type AssessmentType = "mcq" | "code";

interface PopulatedAssessment extends Omit<MA | CA, "problems"> {
  problems: Problem[];
}

interface StorageCredentials {
  email: string;
  name: string;
}

// Initialize socket outside component to prevent recreation
const socket: Socket = io(SOCKET_URL);

const Assessment = () => {
  // State management with proper typing
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("mcq");
  const [assessment, setAssessment] = useState<PopulatedAssessment | null>(
    null
  );
  const [assessmentSub, setAssessmentSub] = useState<MASS | CASS | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number>(0);
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  // Utility functions
  const getStorageCredentials = (): StorageCredentials | null => {
    return secureLocalStorage.getItem(
      "cred-track"
    ) as StorageCredentials | null;
  };

  const getAssessmentIdFromUrl = (): string | null => {
    return window.location.pathname.split("/").pop() || null;
  };

  // Handler functions
  const startAssessment = useCallback(
    (email: string, name: string) => {
      if (!assessment) return;

      const assessmentSubmission: MASS | CASS = {
        assessmentId: assessment._id,
        name,
        email,
        timer: assessment.timeLimit * 60,
        type
      };

      secureLocalStorage.setItem("cred-track", { email, name });
      socket.emit("start-assessment", assessmentSubmission);

      setAssessmentType(type);
      setTimer(assessment.timeLimit * 60);
      setCurrentScreen("dashboard");
      setLoading(false);
      setAssessmentStarted(true);
    },
    [assessment]
  );

  // Timer effect
  useEffect(() => {
    if (!assessment || currentScreen === "start" || !assessmentStarted) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, TIMER_INTERVAL);

    return () => clearInterval(timerInterval);
  }, [assessment, currentScreen, assessmentStarted]);

  // Timer sync effect
  useEffect(() => {
    if (!assessment || currentScreen === "start" || !assessmentStarted) return;
    if (timer % SYNC_INTERVAL !== 0) return;

    const credentials = getStorageCredentials();
    const assessmentId = getAssessmentIdFromUrl();

    if (!credentials?.email || !assessmentId) return;

    socket.emit("timeSync", {
      time: timer,
      assessmentId,
      email: credentials.email,
    });
  }, [timer, assessment, currentScreen, assessmentStarted]);

  // Progress check effect
  useEffect(() => {
    const checkExistingProgress = async () => {
      const credentials = getStorageCredentials();
      const assessmentId = getAssessmentIdFromUrl();

      if (!credentials?.email || !assessmentId) return;

      try {
        const axios = ax();
        const response = await axios.post("/assessments/checkProgress", {
          email: credentials.email,
          assessmentId,
        });

        if (response.data?.exists === false) return;

        const {
          submission,
          assessment: assessmentData,
          type,
        } = response.data.data;

        setAssessmentSub(submission);
        setTimer(submission.timer);
        setAssessment(assessmentData);
        setAssessmentType(type as AssessmentType);
        setCurrentScreen("dashboard");
        setLoading(false);
        setAssessmentStarted(true);
      } catch (error) {
        console.error("Failed to check assessment progress:", error);
      }
    };

    checkExistingProgress();
  }, []);

  // Render logic
  return (
    <div className="h-screen">
      {currentScreen === "start" && (
        <Start
          parentScreen={currentScreen}
          setParentScreen={setCurrentScreen}
          assessmentType={assessmentType}
          setAssessmentType={setAssessmentType}
          assessment={assessment as PopulatedAssessment}
          setAssessment={
            setAssessment as Dispatch<SetStateAction<PopulatedAssessment>>
          }
          startAssessment={startAssessment}
        />
      )}

      {currentScreen === "dashboard" && assessment && (
        <>
          {assessmentType === "mcq" && <MCQDashboard timer={timer} />}
          {assessmentType === "code" && (
            <CodeDashboard
              timer={timer}
              assessment={assessment}
              loading={loading}
              setAssessmentSub={setAssessmentSub}
              assessmentSub={assessmentSub as MASS | CASS}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Assessment;
