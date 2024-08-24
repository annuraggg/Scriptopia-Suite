import { useEffect, useState } from "react";
import Blank from "./Blank";
import Main from "./Main";
import { useOutletContext } from "react-router-dom";
import Configure from "./Configure";
import { Drive } from "@shared-types/Drive";

const Ats = () => {
  const [atsEnabled, setAtsEnabled] = useState(false);
  const [atsConfigured, setAtsConfigured] = useState(false);

  const { drive } = useOutletContext() as { drive: Drive };
  useEffect(() => {
    const noOfAts = drive?.workflow?.steps?.filter(
      (step) => step.type === "rs"
    ).length;

    if (noOfAts) {
      setAtsEnabled(true);

      const ats = drive?.ats;
      if (ats) {
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

  return <Main drive={drive} />;
};

export default Ats;
