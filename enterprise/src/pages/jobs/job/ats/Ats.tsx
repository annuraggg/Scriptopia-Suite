import { useEffect, useState } from "react";
import Blank from "./Blank";
import Main from "./Main";
import { useOutletContext } from "react-router-dom";
import Configure from "./Configure";
import { Posting } from "@shared-types/Posting";

const Ats = () => {
  const [atsEnabled, setAtsEnabled] = useState(false);
  const [atsConfigured, setAtsConfigured] = useState(false);

  const { posting } = useOutletContext() as { posting: Posting };
  console.log(posting);
  useEffect(() => {
    const noOfAts = posting?.workflow?.steps?.filter(
      (step) => step.type === "rs"
    ).length;

    if (noOfAts) {
      setAtsEnabled(true);

      const ats = posting?.ats;
      if (ats) {
        setAtsConfigured(true);
      }
    }
  }, [posting]);

  if (!atsEnabled) {
    return <Blank />;
  }

  if (!atsConfigured) {
    return <Configure />;
  }

  return <Main posting={posting} />;
};

export default Ats;
