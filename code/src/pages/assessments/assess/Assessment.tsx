import { useEffect, useState } from "react";
import Start from "./Start";
import MCQDashboard from "./MCQDashboard";
import CodeDashboard from "./CodeDashboard";
import { Assessment as IAssessment } from "@shared-types/Assessment";
import { io } from "socket.io-client";
import { AssessmentSubmissionsSchema as ASS } from "@shared-types/AssessmentSubmission";
import secureLocalStorage from "react-secure-storage";
import ax from "@/config/axios";

const socket = io("http://localhost:4000");

type Screens = "start" | "dashboard" | "problem" | "result";

const Assessment = () => {
  const [currentScreen, setCurrentScreen] = useState<Screens>("start");
  const [assessmentType, setAssessmentType] = useState<"mcq" | "code">("mcq");
  const [assessment, setAssessment] = useState<IAssessment>({} as IAssessment);
  const [assessmentSubmission, setAssessmentSubmission] = useState<ASS>(
    {} as ASS
  );
  const [timer, setTimer] = useState<number>(0);

  const startAssessment = (email: string, name: string) => {
    const assessmentSubmission: ASS = {
      assessmentId: assessment._id,
      name: name,
      email: email,
      timer: timer * 60,
    };

    secureLocalStorage.setItem("cred-track", { email, name });

    socket.emit("start-assessment", assessmentSubmission);

    setCurrentScreen("dashboard");
  };

  // Initialize timer based on assessment
  useEffect(() => {
    if (!assessment._id || currentScreen === "start") return;
    setTimer(assessment.timeLimit * 60); // Set timer in seconds
  }, [assessment, currentScreen]);

  // Main timer logic
  useEffect(() => {
    if (!assessment) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;

        // Emit timeSync with the updated timer value
        const email = (
          secureLocalStorage.getItem("cred-track") as { email?: string }
        )?.email;
        socket.emit("timeSync", {
          time: newTime,
          assessmentId: window.location.pathname.split("/").pop(),
          email,
        });

        return newTime >= 0 ? newTime : 0; // Prevent negative timer
      });
    }, 1000);

    return () => clearInterval(timerInterval); // Clean up the interval
  }, [assessment]);

  // Sync timer every 10 seconds
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const email = (
        secureLocalStorage.getItem("cred-track") as { email?: string }
      )?.email;

      socket.emit("timeSync", {
        time: timer,
        assessmentId: window.location.pathname.split("/").pop(),
        email,
      });
    }, 10000);

    return () => clearInterval(syncInterval); // Clean up the sync interval
  }, [timer]);

  // Check for existing assessment progress
  useEffect(() => {
    const email = (
      secureLocalStorage.getItem("cred-track") as { email?: string }
    )?.email;
    const assessmentId = window.location.pathname.split("/").pop();
    if (!email) return;

    const axios = ax();
    axios
      .post("/assessments/checkProgress", {
        email,
        assessmentId,
      })
      .then((res) => {
        if (res.data?.exists === false) return;
        
        setAssessmentSubmission(res.data.data.submission);
        setTimer(res.data.data.submission.timer);
        setAssessment(res.data.data.assessment);
        setAssessmentType(res.data.data.assessment.type as "mcq" | "code");

        setCurrentScreen("dashboard");
      });
  }, []);

  return (
    <div className="h-screen">
      {currentScreen === "start" && (
        <Start
          parentScreen={currentScreen}
          setParentScreen={setCurrentScreen}
          assessmentType={assessmentType}
          setAssessmentType={setAssessmentType}
          assessment={assessment}
          setAssessment={setAssessment}
          startAssessment={startAssessment}
        />
      )}

      {currentScreen === "dashboard" && (
        <>
          {assessmentType === "mcq" && <MCQDashboard timer={timer} />}
          {assessmentType === "code" && <CodeDashboard timer={timer} />}
        </>
      )}
    </div>
  );
};

export default Assessment;
