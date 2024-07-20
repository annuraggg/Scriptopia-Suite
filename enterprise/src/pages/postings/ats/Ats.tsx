import { useState } from "react";
import { toast } from "sonner";
import Blank from "./Blank";
import Main from "./Main";

const Ats = () => {
  const [atsEnabled, _setAtsEnabled] = useState(true);

  const save = () => {
    toast.success("Saved successfully");
  };

  if (!atsEnabled) {
    return <Blank />;
  }

  return <Main save={save} />;
};

export default Ats;
