import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Blank from "./Blank";
import Configure from "./Configure";
import Main from "./Main";

const Assessments = () => {
  const [assessmentsEnabled, setAssessmentsEnabled] = useState(false);
  const [assessmentsConfigured, setAssessmentsConfigured] = useState(false);

  const { drive } = useOutletContext();

  useEffect(() => {
    const noOfAssessments = drive?.workflow?.steps?.filter(
      (step) =>
        step.type === "ca" || step.type === "mcqca" || step.type === "mcqa"
    ).length;

    if (noOfAssessments) {
      setAssessmentsEnabled(true);

      const remainingToConfig =
        drive?.workflow?.steps?.filter(
          (step) =>
            step.type === "ca" || step.type === "mcqca" || step.type === "mcqa"
        ).length - drive?.assessments?.length || 0;
      if (remainingToConfig) {
        setAssessmentsConfigured(true);
      }
    }
  }, [drive]);

  if (!assessmentsEnabled) {
    return <Blank />;
  }

  if (assessmentsConfigured) {
    return <Configure drive={drive} />;
  }

  return <Main />;
};

export default Assessments;
