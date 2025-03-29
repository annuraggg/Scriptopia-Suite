import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Blank from "./Blank";
import Configure from "./Configure";
import Main from "./Main";
import { Drive } from "@shared-types/Drive";

const Assignments = () => {
  const [assignmentsEnabled, setAssignmentsEnabled] = useState(false);
  const [assignmentsConfigured, setAssignmentsConfigured] = useState(false);

  const { drive } = useOutletContext() as { drive: Drive };

  useEffect(() => {
    const noOfassignments = drive?.workflow?.steps?.filter(
      (step) => step.type === "ASSIGNMENT"
    ).length;

    if (noOfassignments) {
      setAssignmentsEnabled(true);

      const remainingToConfig = drive?.workflow?.steps?.length
        ? drive?.workflow?.steps?.filter((step) => step.type === "ASSIGNMENT")
            .length - (drive?.assignments?.length ?? 0)
        : 0;

      if (remainingToConfig) {
        setAssignmentsConfigured(true);
      }
    }
  }, [drive]);

  if (!assignmentsEnabled) {
    return <Blank />;
  }

  if (assignmentsConfigured) {
    return <Configure drive={drive} />;
  }

  return <Main />;
};

export default Assignments;
