import { useEffect, useState } from "react";
import Blank from "./Blank";
import Main from "./Main";
import { useOutletContext } from "react-router-dom";
import Configure from "./Configure";
import { Posting } from "@shared-types/Posting";

const Interviews = () => {
  const [interviewEnabled, setInterviewEnabled] = useState(false);
  const [interviewConfigured, setInterviewConfigured] = useState(false);

  const { posting } = useOutletContext() as { posting: Posting };

  useEffect(() => {
    const noOfInterviews = posting?.workflow?.steps?.filter(
      (step) => step.type === "INTERVIEW"
    ).length;

    if (noOfInterviews) {
      setInterviewEnabled(true);

      const ats = posting?.interview;
      if (ats) {
        setInterviewConfigured(true);
      }
    }
  }, [posting]);

  if (!interviewEnabled) {
    return <Blank />;
  }

  if (!interviewConfigured) {
    return <Configure />;
  }

  return <Main />;
};

export default Interviews;
