import { useEffect, useState } from "react";
import Blank from "./Blank";
import Main from "./Main";
import { useOutletContext } from "react-router-dom";
import Configure from "./Configure";
import InProgressComp from "./InProgress";
import { ExtendedDrive } from "@shared-types/ExtendedDrive";

const Ats = () => {
  const [atsEnabled, setAtsEnabled] = useState(false);
  const [atsConfigured, setAtsConfigured] = useState(false);
  const [InProgress, setInProgress] = useState(false);

  const { drive } = useOutletContext() as { drive: ExtendedDrive };
  console.log(drive);
  useEffect(() => {
    const noOfAts = drive?.workflow?.steps?.filter(
      (step) => step.type === "RESUME_SCREENING"
    ).length;

    if (noOfAts) {
      setAtsEnabled(true);

      const ats = drive?.ats;
      if (ats) {
        setInProgress(ats.status === "processing");
        setAtsConfigured(true);
      }
    }
  }, [drive]);

  if (!atsEnabled) {
    return <Blank />;
  }

  if (!atsConfigured) {
    return <Configure />;
  }

  if (InProgress) {
    return <InProgressComp />;
  }

  return <Main drive={drive} />;
};

export default Ats;
