import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Blank from "./Blank";
import Configure from "./Configure";
import Main from "./Main";
import { Posting } from "@shared-types/Posting";

const Assignments = () => {
  const [assignmentsEnabled, setAssignmentsEnabled] = useState(false);
  const [assignmentsConfigured, setAssignmentsConfigured] = useState(false);

  const { posting } = useOutletContext() as { posting: Posting };

  useEffect(() => {
    const noOfassignments = posting?.workflow?.steps?.filter(
      (step) => step.type === "ASSIGNMENT"
    ).length;

    if (noOfassignments) {
      setAssignmentsEnabled(true);

      const remainingToConfig = posting?.workflow?.steps?.length
        ? posting?.workflow?.steps?.filter((step) => step.type === "ASSIGNMENT")
            .length - (posting?.assignments?.length ?? 0)
        : 0;

      if (remainingToConfig) {
        setAssignmentsConfigured(true);
      }
    }
  }, [posting]);

  if (!assignmentsEnabled) {
    return <Blank />;
  }

  if (assignmentsConfigured) {
    return <Configure posting={posting} />;
  }

  return <Main />;
};

export default Assignments;
