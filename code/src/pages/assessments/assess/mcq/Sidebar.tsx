import { Button, Card, CardBody } from "@heroui/react";
import { MCQAssessment as MA } from "@shared-types/MCQAssessment";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

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
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/10"
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

      <div className="border-2 p-2">
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </Card>
  );
};

export default Sidebar;
