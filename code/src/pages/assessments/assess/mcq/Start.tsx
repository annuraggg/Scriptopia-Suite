import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CircleAlert, CircleCheck, Loader2, Camera, Mic } from "lucide-react";
import { toast } from "sonner";
import ax from "@/config/axios";
import { MCQAssessment } from "@shared-types/MCQAssessment";

// Types
type Screen = "input" | "verifying" | "instructions";
type VerificationStatus = -1 | 0 | 1;
type ParentScreens = "start" | "dashboard" | "result";

interface StartProps {
  parentScreen: ParentScreens;
  setParentScreen: (screen: ParentScreens) => void;
  assessment: MCQAssessment;
  setAssessment: (assessment: MCQAssessment) => void;
  startAssessment: (email: string, name: string) => void;
}

interface VerificationStepProps {
  status: VerificationStatus;
  label: string;
  icon?: React.ReactNode;
}

// Constants
const DEFAULT_INSTRUCTIONS = `
  1. This is a multiple choice question test.
  2. There may be multiple sections in the test.
  3. Each question has only one correct answer.
  4. You can navigate through the questions using the buttons provided.
  5. Make sure to read the question thoroughly before answering.
  6. You can submit the test at any time as long as the timer does not end.
  `;

const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
};

const BACKGROUND_STYLE = {
  background: "url('/wave.svg') center/cover no-repeat",
};

// Utility functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

const checkBrowserCompatibility = (): boolean => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }

  const isFullscreenSupported =
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled;

  const isTabChangeSupported = "visibilityState" in document;

  const isDevToolsOpen = () => {
    const threshold = 160;
    const { outerWidth, outerHeight, innerWidth, innerHeight } = window;
    return (
      Math.abs(outerWidth - innerWidth) > threshold ||
      Math.abs(outerHeight - innerHeight) > threshold
    );
  };

  return isFullscreenSupported && isTabChangeSupported && !isDevToolsOpen();
};

// Check camera permissions
const checkCameraPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    return false;
  }
};

// Check microphone permissions
const checkMicPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err) {
    return false;
  }
};

// Request both camera and mic permissions at once
const requestMediaPermissions = async (): Promise<{
  camera: boolean;
  mic: boolean;
}> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    stream.getTracks().forEach((track) => track.stop());
    return { camera: true, mic: true };
  } catch (err) {
    // If combined request fails, try individual requests to determine which one failed
    const camera = await checkCameraPermission();
    const mic = await checkMicPermission();
    return { camera, mic };
  }
};

// VerificationStep Component
const VerificationStep: React.FC<VerificationStepProps> = ({
  status,
  label,
  icon,
}) => {
  const statusIcons = {
    "-1": <CircleAlert className="text-red-500" />,
    "0": <Loader2 className="animate-spin text-gray-500" />,
    "1": <CircleCheck className="text-green-500" />,
  };

  const getStatusClass = (status: VerificationStatus): string => {
    const statusClasses = {
      1: "text-green-500",
      0: "text-gray-500",
      "-1": "text-red-500",
    };
    return statusClasses[status];
  };

  return (
    <div className="flex items-center space-x-4 mt-3">
      <span className="flex-shrink-0">
        {icon || statusIcons[String(status) as keyof typeof statusIcons]}
      </span>
      <span className={getStatusClass(status)}>
        {label.slice(0, 1).toUpperCase() + label.slice(1)}
      </span>
    </div>
  );
};

// Main Component
const Start: React.FC<StartProps> = ({ setAssessment, startAssessment }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input");
  const [verificationStatus, setVerificationStatus] = useState({
    allowedForTest: 0 as VerificationStatus,
    compatibleBrowser: 0 as VerificationStatus,
    testActive: 0 as VerificationStatus,
    cameraPermission: 0 as VerificationStatus,
    microphonePermission: 0 as VerificationStatus,
  });
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    instructions: "",
  });

  // Request permissions when button is clicked
  const requestPermissions = async () => {
    toast.info("Requesting camera and microphone permissions...");

    const permissions = await requestMediaPermissions();

    setVerificationStatus((prev) => ({
      ...prev,
      cameraPermission: permissions.camera ? 1 : -1,
      microphonePermission: permissions.mic ? 1 : -1,
    }));

    if (!permissions.camera) {
      toast.error("Camera permission is required for this assessment");
    }

    if (!permissions.mic) {
      toast.error("Microphone permission is required for this assessment");
    }

    return permissions.camera && permissions.mic;
  };

  const handleSubmit = useCallback(async () => {
    const { name, email } = userInput;

    if (!name || !email) {
      toast.error("Please fill in all the fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Request permissions first
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      toast.error("Camera and microphone permissions are required to proceed");
      return;
    }

    setCurrentScreen("verifying");
    const isCompatible = checkBrowserCompatibility();

    try {
      const response = await ax().post("/assessments/verify", {
        id: window.location.pathname.split("/").pop(),
        email,
      });

      const { instructions, assessment } = response.data.data;

      setUserInput((prev) => ({ ...prev, instructions }));
      setAssessment(assessment);

      setVerificationStatus((prev) => ({
        ...prev,
        allowedForTest: 1,
        testActive: 1,
        compatibleBrowser: isCompatible ? 1 : -1,
      }));

      if (!isCompatible) {
        toast.error("Please use a compatible browser");
        return;
      }

      setTimeout(() => setCurrentScreen("instructions"), 1000);
    } catch (error: any) {
      const errData = error?.response?.data?.data;

      setVerificationStatus((prev) => ({
        ...prev,
        allowedForTest: errData?.allowedForTest ? 1 : -1,
        testActive: errData?.testActive ? 1 : -1,
        compatibleBrowser: checkBrowserCompatibility() ? 1 : -1,
      }));

      if (!errData?.allowedForTest || !errData?.testActive) {
        toast.error(error.response.data.message);
      }
    }
  }, [userInput, setAssessment]);

  const renderInputScreen = () => (
    <Card className="h-[60vh] w-[50vw] border-4 p-4 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader>
        <img src="/logo.svg" alt="Scriptopia" className="h-8 w-8" />
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center">
        <motion.div
          variants={ANIMATION_VARIANTS.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4 }}
        >
          <h4 className="text-lg font-semibold">Scriptopia Assessment</h4>
          <p className="mt-2 text-gray-600">
            Please Enter Your Details to Continue
          </p>
        </motion.div>
        <motion.div
          className="w-full flex flex-col items-center"
          variants={ANIMATION_VARIANTS.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Input
            placeholder="Full Name"
            className="mt-5 w-[300px]"
            size="lg"
            value={userInput.name}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Email"
            className="mt-5 w-[300px]"
            size="lg"
            value={userInput.email}
            onChange={(e) =>
              setUserInput((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="flat"
              color="success"
              className="mt-5"
              onClick={handleSubmit}
            >
              Start Test
            </Button>
          </motion.div>
          <motion.p
            className="mt-5 text-sm text-gray-500"
            variants={ANIMATION_VARIANTS.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            By clicking submit, you agree to our{" "}
            <a
              href="https://www.scriptopia.tech/terms-of-service"
              className="underline"
            >
              Terms and Conditions
            </a>
          </motion.p>
        </motion.div>
      </CardBody>
    </Card>
  );

  const renderInstructionsScreen = () => (
    <div className="h-screen w-full flex items-center justify-center relative">
      <Card className="p-4 h-[70vh] w-[70vw]">
        <CardHeader>Instructions for the Test</CardHeader>
        <CardBody>
          <p className="px-5 overflow-y-auto">
            Please follow the instructions carefully. Make sure to read each
            question thoroughly before answering.
            <pre>{DEFAULT_INSTRUCTIONS}</pre>
            <Divider className="my-3 mt-5" />
            <p>Notes from Assessment Admin:</p>
            {userInput.instructions}
          </p>
        </CardBody>
        <CardFooter className="items-center justify-center">
          <Button
            onClick={() => {
              // Double-check permissions before starting
              const allPermissionsGranted =
                verificationStatus.cameraPermission === 1 &&
                verificationStatus.microphonePermission === 1;

              if (allPermissionsGranted) {
                startAssessment(userInput.email, userInput.name);
              } else {
                toast.error("Camera and microphone permissions are required");
                requestPermissions();
              }
            }}
          >
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderVerificationScreen = () => (
    <motion.div
      className={`h-screen w-full flex items-center justify-center absolute z-10 backdrop-blur-xl ${
        currentScreen === "instructions" && "opacity-0 hidden"
      }`}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4 w-screen h-screen shadow-lg transition-all">
        <CardHeader>
          <img src="/logo.svg" alt="Scriptopia" className="h-8 w-8 mr-5" />
        </CardHeader>
        <CardBody className="flex flex-col items-center justify-center">
          <h4 className="text-lg font-semibold">Verifying Details</h4>
          <div className="mt-10">
            {Object.entries(verificationStatus).map(([key, status]) => {
              // Custom icons for camera and mic
              let icon = null;
              if (key === "cameraPermission") {
                icon = (
                  <Camera
                    className={
                      status === 1
                        ? "text-green-500"
                        : status === -1
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  />
                );
              } else if (key === "microphonePermission") {
                icon = (
                  <Mic
                    className={
                      status === 1
                        ? "text-green-500"
                        : status === -1
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  />
                );
              }

              return (
                <VerificationStep
                  key={key}
                  status={status}
                  label={key.split(/(?=[A-Z])/).join(" ")}
                  icon={icon}
                />
              );
            })}
          </div>

          {/* Option to retry permissions if they failed */}
          {(verificationStatus.cameraPermission === -1 ||
            verificationStatus.microphonePermission === -1) && (
            <Button
              variant="flat"
              color="primary"
              className="mt-5"
              onClick={requestPermissions}
            >
              Request Permissions Again
            </Button>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );

  return (
    <div
      className="h-screen flex items-center justify-center overflow-hidden"
      style={BACKGROUND_STYLE}
    >
      {currentScreen === "input" && renderInputScreen()}
      {(currentScreen === "verifying" || currentScreen === "instructions") && (
        <>
          {renderVerificationScreen()}
          {currentScreen === "instructions" && renderInstructionsScreen()}
        </>
      )}
    </div>
  );
};

export default Start;
