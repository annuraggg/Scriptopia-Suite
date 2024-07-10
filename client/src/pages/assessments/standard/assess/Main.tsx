import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button, Input } from "@nextui-org/react";
// import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const divStyle = {
  background: "url('/wave2.svg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

const Main = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [page, setPage] = useState("main");

  const submitData = () => {
    if (!name || !email) {
      toast.error("Please fill in all the fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    // const req = axios.post("/test").finally(() => setLoading(false));
    const req = new Promise<void>((resolve): void => {
      setTimeout(() => {
        resolve();
        setLoading(false);
        setInstructions(
          "This is a test. Please follow the instructions below: \n\n1. Do not refresh the page \n2. Do not close the tab \n3. Do not use any external resources \n\nClick on the button below to start the assessment. Good Luck!"
        );
        setPage("instructions");
      }, 2000);
    });

    toast.promise(req, {
      loading: "Validating Access",
      success: "Access Granted",
      error: "You are not allowed to take this assessment",
    });
  };

  const startTest = () => {
    navigate("current");
  };

  return (
    <div className="h-screen flex items-center justify-center" style={divStyle}>
      {page === "main" && (
        <Card className="h-[70%] w-[50%] p-3  border-2">
          <CardHeader>
            <img
              src="/logo1080_transparent_white_large.png"
              alt="logo"
              className="w-10"
            />
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center">
            <h4>Scriptopia Assessment</h4>
            <p className="mt-2 text-sm">
              Please Enter Your Details to Continue
            </p>
            <Input
              placeholder="Enter Your Name"
              className="mt-5 w-[300px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Enter Your Email"
              className="mt-5 w-[300px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="flat"
              color="success"
              className="mt-5"
              onClick={submitData}
              isLoading={loading}
            >
              Submit
            </Button>
          </CardBody>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              By clicking submit, you agree to our Terms and Conditions
            </p>
          </CardFooter>
        </Card>
      )}

      {page === "instructions" && (
        <Card className="h-[70%] w-[50%] p-3  border-2">
          <CardHeader>
            <img
              src="/logo1080_transparent_white_large.png"
              alt="logo"
              className="w-10"
            />
          </CardHeader>
          <CardBody className="flex flex-col items-center justify-center">
            <h4>Instructions</h4>
            <pre className="my-5 text-sm">{instructions}</pre>
            <Button
              variant="flat"
              color="success"
              className="mt-5"
              onClick={startTest}
              isLoading={loading}
            >
              Start Test
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Main;
