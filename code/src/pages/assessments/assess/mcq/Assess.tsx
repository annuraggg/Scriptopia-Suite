import { useCallback, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Start from "./Start";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import { io, Socket } from "socket.io-client";
import secureLocalStorage from "react-secure-storage";
import { MCQAssessmentSubmissionsSchema as MASS } from "@shared-types/MCQAssessmentSubmission";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useDisclosure } from "@nextui-org/react";

// Constants
const SOCKET_URL = "http://localhost:4000";
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
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number>(0);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessment, setAssessment] = useState<MA | null>(null);
  const [assessmentSub, setAssessmentSub] = useState<MASS | null>(null);

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

    socket.emit("timeSync-mcq", {
      time: timer,
      assessmentId,
      email: credentials.email,
    });
  }, [timer, assessment, currentScreen, assessmentStarted]);

  useEffect(() => {
    const checkExistingProgress = async () => {
      const credentials = getStorageCredentials();
      const assessmentId = getAssessmentIdFromUrl();

      console.log("Assessment ID: ", assessmentId);

      if (!credentials?.email || !assessmentId) return;

      const assessm = {
        _id: {
          $oid: "676e9f5debc31b6778b879ff",
        },
        name: "Test Assessment Two",
        description: "Hello World Assessment",
        author: "user_2nw3yCYFf6NTV5bKTo15OMYvKNP",
        timeLimit: 10,
        passingPercentage: 75,
        openRange: {
          start: {
            $date: "2024-12-29T08:40:00.000Z",
          },
          end: {
            $date: "2025-01-04T08:40:00.000Z",
          },
          _id: {
            $oid: "676e6b0a6285a5e61a51cac7",
          },
        },
        sections: [
          {
            name: "Sec 1",
            questions: [
              {
                question: "Who is Anurag Sawant",
                type: "single-select",
                options: [
                  {
                    option: "Rakhi Sawant's Brother",
                    isCorrect: false,
                    _id: {
                      $oid: "676e6b0a6285a5e61a51caca",
                    },
                  },
                  {
                    option: "Student at North Carolina University",
                    isCorrect: false,
                    _id: {
                      $oid: "676e6b0a6285a5e61a51cacb",
                    },
                  },
                  {
                    option: "Forbes Top 10 for building Scriptopia",
                    isCorrect: true,
                    _id: {
                      $oid: "676e6b0a6285a5e61a51cacc",
                    },
                  },
                  {
                    option: "Ordinary Man",
                    isCorrect: false,
                    _id: {
                      $oid: "676e6b0a6285a5e61a51cacd",
                    },
                  },
                ],
                fillInBlankAnswers: [],
                _id: {
                  $oid: "676e6b0a6285a5e61a51cac9",
                },
              },
            ],
            _id: {
              $oid: "676e6b0a6285a5e61a51cac8",
            },
          },
        ],
        candidates: [],
        public: true,
        instructions: "Do not cheat",
        security: {
          sessionPlayback: false,
          tabChangeDetection: true,
          copyPasteDetection: true,
          _id: {
            $oid: "676e6b0a6285a5e61a51cace",
          },
        },
        feedbackEmail: "feedback@anuragsawant.in",
        isEnterprise: false,
        createdAt: {
          $date: "2024-12-27T08:53:30.669Z",
        },
        __v: 0,
      };

      setAssessment(assessm as unknown as MA);
      setTimer(assessm.timeLimit * 60);

      // try {
      //   const axios = ax();
      //   const response = await axios.post("/assessments/checkProgress", {
      //     email: credentials.email,
      //     assessmentId,
      //   });

      //   console.log(response.data.data);
      //   if (response.data?.data?.exists === false) return;

      //   const { submission, assessment: assessmentData } = response.data.data;

      //   setAssessmentSub(submission);
      //   setTimer(submission.timer);
      //   setAssessment(assessmentData);
      //   setCurrentScreen("dashboard");
      //   setLoading(false);
      //   setAssessmentStarted(true);
      // } catch (error) {
      //   console.error("Failed to check assessment progress:", error);
      // }
    };

    checkExistingProgress();
  }, []);

  const startAssessment = useCallback(
    (email: string, name: string) => {
      if (!assessment) return;

      const assessmentSubmission: MASS = {
        assessmentId: assessment._id,
        name,
        email,
        timer: assessment.timeLimit * 60,
      };

      secureLocalStorage.setItem("cred-track", { email, name });
      socket.emit("start-mcq-assessment", assessmentSubmission);

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

  const [assessmentCompleted, setAssessmentCompleted] = useState(false); // @ts-expect-error
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false); // @ts-expect-error
  const [submitSuccess, setSubmitSuccess] = useState(false); // @ts-expect-error
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // @ts-expect-error
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
