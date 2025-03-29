import React, { useState } from "react";
import Standard from "./Standard";
import Canvas from "./Canvas";

interface WorkflowProps {
  setAction: (step: number) => void;
  addedComponents: Component[];
  setAddedComponents: React.Dispatch<React.SetStateAction<Component[]>>;
}

interface Component {
  icon: React.ElementType;
  label: string;
  name: string;
  id: string;
}

const Workflow = ({
  setAction,
  addedComponents,
  setAddedComponents,
}: WorkflowProps) => {
  const [mode, setMode] = useState<"standard" | "canvas">("standard");

  if (mode === "standard") {
    return (
      <Standard
        setAction={setAction}
        addedComponents={addedComponents}
        setAddedComponents={setAddedComponents}
        setMode={setMode}
      />
    );
  }

  if (mode === "canvas") {
    return (
      <Canvas
        setAction={setAction}
        addedComponents={addedComponents}
        setAddedComponents={setAddedComponents}
        setMode={setMode}
      />
    );
  }
};

export default Workflow;
