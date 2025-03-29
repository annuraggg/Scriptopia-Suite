import { useEffect, useState } from "react";
import Blank from "./Blank";
import Main from "./Main";
import { useOutletContext } from "react-router-dom";
import { Drive } from "@shared-types/Drive";

const Interviews = () => {
  const [interviewEnabled, setInterviewEnabled] = useState(false);

  const { drive } = useOutletContext() as { drive: Drive };

  useEffect(() => {
    const noOfInterviews = drive?.workflow?.steps?.filter(
      (step) => step.type === "INTERVIEW"
    ).length;

    if (noOfInterviews) {
      setInterviewEnabled(true);
    }
  }, [drive]);

  if (!interviewEnabled) {
    return <Blank />;
  }

  return <Main />;
};

export default Interviews;
