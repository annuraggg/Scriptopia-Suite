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
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ax from "@/config/axios";
import { Problem } from "@shared-types/Problem";
import { CodeAssessment } from "@shared-types/CodeAssessment";

// Types
type Screen = "input" | "verifying" | "instructions";
type VerificationStatus = -1 | 0 | 1;
type ParentScreens = "start" | "dashboard" | "problem" | "result";

interface StartProps {
  parentScreen: ParentScreens;
  setParentScreen: (screen: ParentScreens) => void;
  assessment: PopulatedAssessment;
  setAssessment: (assessment: PopulatedAssessment) => void;
  startAssessment: (email: string, name: string) => void;
}

interface PopulatedAssessment extends Omit<CodeAssessment, "problems"> {
  problems: Problem[];
}

interface VerificationStepProps {
  status: VerificationStatus;
  label: string;
}

// Constants
const DEFAULT_INSTRUCTIONS = `
  1. This is a code assessment test.
  2. You will be given a problem statement to solve.
  3. You can write your code in the editor provided.
  4. Make sure to read the question thoroughly before answering.
  5. You can submit the test at any time as long as the timer does not end.
  6. You can run your code to check for errors.
  7. Make sure to check the output before submitting as you cannot change it later.
  
  Good Luck!
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

// VerificationStep Component
const VerificationStep: React.FC<VerificationStepProps> = ({
  status,
  label,
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
        {statusIcons[String(status) as keyof typeof statusIcons]}
      </span>
      <span className={getStatusClass(status)}>{label.slice(0,1).toUpperCase() + label.slice(1)}</span>
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
  });
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    instructions: "",
  });

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

      setVerificationStatus({
        allowedForTest: 1,
        testActive: 1,
        compatibleBrowser: isCompatible ? 1 : -1,
      });

      if (!isCompatible) {
        toast.error("Please use a compatible browser");
        return;
      }

      setTimeout(() => setCurrentScreen("instructions"), 1000);
    } catch (error: any) {
      const errData = error?.response?.data?.data;

      setVerificationStatus({
        allowedForTest: errData?.allowedForTest ? 1 : -1,
        testActive: errData?.testActive ? 1 : -1,
        compatibleBrowser: checkBrowserCompatibility() ? 1 : -1,
      });

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
            onClick={() => startAssessment(userInput.email, userInput.name)}
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
            {Object.entries(verificationStatus).map(([key, status]) => (
              <VerificationStep
                key={key}
                status={status}
                label={key.split(/(?=[A-Z])/).join(" ")}
              />
            ))}
          </div>
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
