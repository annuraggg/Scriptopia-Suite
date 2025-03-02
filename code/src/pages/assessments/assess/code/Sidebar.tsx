import { Button, Card, CardBody, Progress } from "@heroui/react";
import { CodeAssessmentSubmission as CASS } from "@shared-types/CodeAssessmentSubmission";
import { Problem } from "@shared-types/Problem";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";

interface SidebarProps {
  problems: Problem[];
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem) => void;
  isInsideSheet?: boolean;
  timer: number;
  assessmentSub: CASS;
  onOpen: () => void;
}

const Sidebar = ({
  problems,
  currentProblem,
  setCurrentProblem,
  isInsideSheet = false,
  timer,
  assessmentSub,
  onOpen,
}: SidebarProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProblemClick = (problem: Problem) => {
    const isSubmitted = assessmentSub?.submissions?.some(
      (submission) => submission.problemId === problem._id
    );

    if (!isSubmitted) {
      setCurrentProblem(problem);
    }
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturing, _setCapturing] = useState<boolean>(true);

  useEffect(() => {
    // Start webcam stream
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to Blob and upload
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const timestamp = new Date().toISOString();
        const file = new File([blob], `snapshot-${timestamp}.png`, {
          type: "image/png",
        });

        await uploadToServer(file, timestamp);
      }, "image/png");
    }
  };

  const uploadToServer = async (file: File, timestamp: string) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("timestamp", timestamp);
    const decrypt = secureLocalStorage.getItem("cred-track") as any;
    const assessmentId = window.location.pathname.split("/")[3];
    const assessmentType = window.location.pathname.split("/")[2];
    formData.append("assessmentId", assessmentId);
    formData.append("assessmentType", assessmentType);
    formData.append("email", decrypt.email);
    axios.post(
      import.meta.env.VITE_API_URL + "/assessments/capture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  useEffect(() => {
    if (capturing) {
      const interval = setInterval(() => {
        captureImage();
      }, Math.random() * (30000 - 10000) + 10000); // Random interval between 10-30 sec

      return () => clearInterval(interval);
    }
  }, [capturing]);

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

        <div className="border-2 p-2 absolute bottom-0 max-w-[300px]">
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </CardBody>
    </Card>
  );
};

export default Sidebar;
