import { useEffect, useState } from "react";
import Blank from "./Blank";
import Main from "./Main";
import { useOutletContext } from "react-router-dom";
import { Posting } from "@shared-types/Posting";

const Interviews = () => {
  const [interviewEnabled, setInterviewEnabled] = useState(false);

  const { posting } = useOutletContext() as { posting: Posting };

  useEffect(() => {
    const noOfInterviews = posting?.workflow?.steps?.filter(
      (step) => step.type === "INTERVIEW"
    ).length;

    if (noOfInterviews) {
      setInterviewEnabled(true);
    }
  }, [posting]);

  if (!interviewEnabled) {
    return <Blank />;
  }

  return <Main />;
};

export default Interviews;
