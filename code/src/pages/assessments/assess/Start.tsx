import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ax from "@/config/axios";
import { Assessment } from "@shared-types/Assessment";

const divStyle = {
  background: "url('/wave.svg') center/cover no-repeat",
};

const mcqDefaultInstructions = `
1. This is a multiple choice question test.
2. Each question has only one correct answer.
3. You can navigate through the questions using the buttons provided.
4. Make sure to read the question thoroughly before answering.
5. You can submit the test at any time as long as the timer does not end.

Good Luck!
`;

const codeDefaultInstructions = `
1. This is a code assessment test.
2. You will be given a problem statement to solve.
3. You can write your code in the editor provided.
4. Make sure to read the question thoroughly before answering.
5. You can submit the test at any time as long as the timer does not end.
6. You can run your code to check for errors.
7. Make sure to check the output before submitting as you cannot change it later.

Good Luck!
`;

const Start = ({
  assessmentType,
  setAssessmentType,
  setAssessment,
  startAssessment,
}: {
  parentScreen: "start" | "dashboard" | "problem" | "result";
  setParentScreen: React.Dispatch<
    React.SetStateAction<"start" | "dashboard" | "problem" | "result">
  >;
  assessmentType: "mcq" | "code";
  setAssessmentType: React.Dispatch<React.SetStateAction<"mcq" | "code">>;
  assessment: Assessment;
  setAssessment: React.Dispatch<React.SetStateAction<Assessment>>;
  startAssessment: (email: string, name: string) => void;
}) => {
  const [currentScreen, setCurrentScreen] = useState<
    "input" | "verifying" | "instructions"
  >("input");
  const [allowedForTest, setAllowedForTest] = useState(0);
  const [compatibleBrowser, setCompatibleBrowser] = useState(0);
  const [testActive, setTestActive] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [instructions, setInstructions] = useState("");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const submitData = async () => {
    if (!name || !email) return toast.error("Please fill in all the fields");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email))
      return toast.error("Please enter a valid email address");

    setCurrentScreen("verifying");
    const compatible = checkBrowser();

    setTimeout(() => {
      ax()
        .post("/assessments/verify", {
          id: window.location.pathname.split("/").pop(),
          email,
        })
        .then((res) => {
          setAssessmentType(res.data.data.type);
          setInstructions(res.data.data.instructions);
          setAssessment(res.data.data.assessment);
          setAllowedForTest(1);
          setTestActive(1);

          setCompatibleBrowser(compatible ? 1 : -1);
          if (!compatible) {
            toast.error("Please use a compatible browser");
            return;
          }

          setTimeout(() => setCurrentScreen("instructions"), 1000);
        })
        .catch((error) => {
          const errData = error?.response?.data?.data;
          setAllowedForTest(errData?.allowedForTest ? 1 : -1);
          setTestActive(errData?.testActive ? 1 : -1);
          setCompatibleBrowser(checkBrowser() ? 1 : -1);
          if (!errData?.allowedForTest || !errData?.testActive)
            toast.error(error.response.data.message);
        });
    }, 1000);
  };

  function checkBrowser() {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();

    const isFullscreenSupported =
      document.fullscreenEnabled || // @ts-expect-error - mozFullScreenEnabled is not in document
      document.webkitFullscreenEnabled || // @ts-expect-error - mozFullScreenEnabled is not in document
      document.mozFullScreenEnabled || // @ts-expect-error - mozFullScreenEnabled is not in document
      document.msFullscreenEnabled;

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
  }

  return (
    <div
      className="h-screen flex items-center justify-center overflow-hidden"
      style={divStyle}
    >
      {(currentScreen === "input" || currentScreen === "verifying") && (
        <Card className="h-[60vh] w-[50vw] border-4 p-4 shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden">
          <CardHeader>
            <img src="/logo.svg" alt="Scriptopia" className="h-8 w-8" />
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center">
            <motion.div
              variants={fadeInUp}
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
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Input
                placeholder="Full Name"
                className="mt-5 w-[300px]"
                size="lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                className="mt-5 w-[300px]"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="flat"
                  color="success"
                  className="mt-5"
                  onClick={submitData}
                >
                  Start Test
                </Button>
              </motion.div>
              <motion.p
                className="mt-5 text-sm text-gray-500"
                variants={fadeInUp}
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
      )}

      {(currentScreen === "verifying" || currentScreen === "instructions") && (
        <>
          <motion.div
            className={`h-screen w-full flex items-center justify-center absolute z-10 backdrop-blur-xl ${
              currentScreen === "instructions" && "opacity-0 hidden"
            }`}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`p-4 w-screen h-screen shadow-lg transition-all`}>
              <CardHeader>
                <img
                  src="/logo.svg"
                  alt="Scriptopia"
                  className="h-8 w-8 mr-5"
                />
              </CardHeader>
              <CardBody className="flex flex-col items-center justify-center">
                <h4 className="text-lg font-semibold">Verifying Details</h4>
                <div className="mt-10">
                  <VerificationStep
                    status={allowedForTest}
                    label="Allowed for Test"
                  />
                  <VerificationStep
                    status={compatibleBrowser}
                    label="Compatible Browser"
                  />
                  <VerificationStep status={testActive} label="Test Active" />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {currentScreen === "instructions" && (
            <div className="h-screen w-full flex items-center justify-center relative">
              <Card className="p-4 h-[70vh] w-[70vw]">
                <CardHeader>Instructions for the Test</CardHeader>
                <CardBody>
                  <p className="px-5 overflow-y-auto">
                    Please follow the instructions carefully. Make sure to read
                    each question thoroughly before answering.
                    <pre>
                      {assessmentType === "mcq"
                        ? mcqDefaultInstructions
                        : codeDefaultInstructions}
                    </pre>
                    <Divider className="my-3 mt-5" />
                    <p>Notes from Assessment Admin:</p>
                    {instructions}
                  </p>
                </CardBody>
                <CardFooter className="items-center justify-center">
                  <Button onClick={() => startAssessment(email, name)}>
                    Start Test
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const VerificationStep = ({
  status,
  label,
}: {
  status: number;
  label: string;
}) => {
  const statusIcons = {
    "-1": <CircleAlert className="text-red-500" />,
    "0": <Loader2 className="animate-spin text-gray-500" />,
    "1": <CircleCheck className="text-green-500" />,
  };

  const getStatusClass = (status: number) =>
    status === 1
      ? "text-green-500"
      : status === -1
      ? "text-red-500"
      : "text-gray-500";

  return (
    <div className="flex items-center space-x-4 mt-3">
      {" "}
      {/* @ts-expect-error - statusIcon map is error */}
      <span className="flex-shrink-0">{statusIcons[status]}</span>
      <span className={getStatusClass(status)}>{label}</span>
    </div>
  );
};

export default Start;
