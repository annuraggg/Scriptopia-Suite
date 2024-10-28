import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const divStyle = {
  background: "url('/wave.svg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
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
  parentScreen,
  setParentScreen,
  assessmentType,
}: {
  parentScreen: "start" | "dashboard" | "problem" | "result";
  setParentScreen: React.Dispatch<
    React.SetStateAction<"start" | "dashboard" | "problem" | "result">
  >;
  assessmentType: "mcq" | "code";
}) => {
  const [currentScreen, setCurrentScreen] = useState<
    "input" | "verifying" | "instructions"
  >("input");
  const [allowedForTest, setAllowedForTest] = useState(0);
  const [compatibleBrowser, setCompatibleBrowser] = useState(0);
  const [testActive, setTestActive] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitStart, setExitStart] = useState(false);

  const startChecks = () => {
    setTimeout(() => setAllowedForTest(1), 500);
    setTimeout(() => setCompatibleBrowser(1), 1000);
    setTimeout(() => setTestActive(1), 1500);
  };

  useEffect(() => {
    if (currentScreen === "verifying") {
      startChecks();
    }
  }, [currentScreen]);

  const getStatusClass = (status: number) => {
    if (status === 1) return "text-green-500";
    if (status === -1) return "text-red-500";
    return "text-gray-500";
  };

  useEffect(() => {
    if (currentScreen !== "verifying") return;
    if (!allowedForTest || !compatibleBrowser || !testActive) return;
    if (allowedForTest === 1 && compatibleBrowser === 1 && testActive === 1) {
      setExitStart(true);
      setTimeout(() => {
        setIsExiting(true);
        setCurrentScreen("instructions");
        setTimeout(() => setIsExiting(false), 500);
      }, 1000);
    } else {
      toast.error("Error: You are not allowed to proceed to the test.");
    }
  }, [allowedForTest, compatibleBrowser, testActive]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

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
          <CardBody className="flex flex-col items-center justify-center overflow-hidden">
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
              />
              <Input placeholder="Email" className="mt-5 w-[300px]" size="lg" />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="flat"
                  color="success"
                  className="mt-5"
                  onClick={() => setCurrentScreen("verifying")}
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
            className={`h-screen w-full flex items-center justify-center absolute z-10 backdrop-blur-xl  ${
              isExiting ? "opacity-0" : ""
            } {${
              currentScreen === "instructions" && !isExiting
                ? "opacity-0 hidden"
                : ""
            }`}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: isExiting ? 0 : 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={`p-4 w-screen h-screen shadow-lg transition-all ${
                exitStart ? " bg-opacity-100" : " bg-opacity-20"
              }`}
            >
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
                  <div className="flex gap-3 items-center">
                    {allowedForTest === 0 && (
                      <Loader2 className="animate-spin" />
                    )}
                    {allowedForTest === 1 && <CircleCheck />}
                    {allowedForTest === -1 && <CircleAlert />}
                    <p
                      className={`font-semibold ${getStatusClass(
                        allowedForTest
                      )}`}
                    >
                      Allowed for Test
                    </p>
                  </div>

                  <div className="flex gap-3 items-center mt-3">
                    {compatibleBrowser === 0 && (
                      <Loader2 className="animate-spin" />
                    )}
                    {compatibleBrowser === 1 && <CircleCheck />}
                    {compatibleBrowser === -1 && <CircleAlert />}
                    <p
                      className={`font-semibold ${getStatusClass(
                        compatibleBrowser
                      )}`}
                    >
                      Compatible Browser
                    </p>
                  </div>

                  <div className="flex gap-3 items-center mt-3">
                    {testActive === 0 && <Loader2 className="animate-spin" />}
                    {testActive === 1 && <CircleCheck />}
                    {testActive === -1 && <CircleAlert />}
                    <p
                      className={`font-semibold ${getStatusClass(testActive)}`}
                    >
                      Test Active
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {currentScreen === "instructions" && (
            <div className="h-screen w-full flex items-center justify-center relative">
              <Card className="p-4 h-[60vh] w-[50vw]">
                <CardHeader> Instructions for the Test</CardHeader>
                <CardBody>
                  <p className="px-5 overflow-y-auto">
                    Please follow the instructions carefully. Make sure to read
                    each question thoroughly before answering.
                    <pre>
                      {assessmentType === "mcq"
                        ? mcqDefaultInstructions +
                          mcqDefaultInstructions +
                          mcqDefaultInstructions
                        : codeDefaultInstructions}
                    </pre>
                  </p>
                </CardBody>

                <CardFooter className="items-center justify-center">
                  <Button onClick={() => setParentScreen("dashboard")}>
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

export default Start;
