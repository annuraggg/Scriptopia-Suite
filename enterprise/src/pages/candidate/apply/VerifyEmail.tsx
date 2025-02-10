import { Button, Input } from "@heroui/react";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

const VerifyEmail = ({
  email,
  setEmail,
  verified,
  setVerified,
  setExists,
  setCandId,

  setFirstName,
  setLastName,
  setCountryCode,
  setPhone,
  setWebsite,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  verified: boolean;
  setVerified: React.Dispatch<React.SetStateAction<boolean>>;
  setExists: React.Dispatch<React.SetStateAction<boolean>>;
  setCandId: React.Dispatch<React.SetStateAction<string>>;

  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setCountryCode: React.Dispatch<React.SetStateAction<Set<string>>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState("");

  const sendMail = () => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/candidates/sendVerificationMail`, {
        email,
      })
      .then((res) => {
        setStep(1);
        setIdentity(res.data.data.identifierKey);
        setExists(res.data.data.exists);
        setCandId(res.data.data.candId);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "An error occurred");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const verifyOtp = () => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/candidates/verifyOtp`, {
        email,
        identifierKey: identity,
        otp,
      })
      .then((res) => {
        setVerified(true);

        if (res.data.data.exists) {
          setFirstName(res.data.data.firstName);
          setLastName(res.data.data.lastName);
          setCountryCode(new Set(res.data.data.countryCode));
          setPhone(res.data.data.phone);
          setWebsite(res.data.data.website);

          toast.success("Candidate Found. We Have Pre-filled Your Details.");
        }
      })
      .catch((err) => {
        toast.error(err.response.data || "An error occurred");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-[50%]">
      {step === 0 && (
        <>
          <Input
            label="Email Address"
            labelPlacement="outside"
            placeholder="eg. johndoe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Button
            color="warning"
            variant="flat"
            className="mt-4 w-full"
            onClick={() => sendMail()}
            isLoading={loading}
          >
            Verify Email
          </Button>
        </>
      )}

      {step === 1 && (
        <>
          <Input
            label="Enter OTP"
            labelPlacement="outside"
            placeholder="eg. 123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full"
          />
          <Button
            color="success"
            variant="flat"
            className="mt-4 w-full"
            onClick={verifyOtp}
            isLoading={loading}
            isDisabled={verified}
          >
            Verify OTP
          </Button>
          <p className="text-green-500 text-center mt-3">
            {verified && "Email Verified. You can now proceed."}
          </p>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
