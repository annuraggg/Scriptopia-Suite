import { ExtendedPosting } from "@shared-types/ExtendedPosting";
import { WorkflowStep } from "@shared-types/Posting";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DataTable from "./DataTable";

interface OutletContext {
  posting: ExtendedPosting;
  active: string;
  refetch: () => void;
}

const Custom = () => {
  const { posting, active } = useOutletContext<OutletContext>();
  const [step, setStep] = useState<WorkflowStep | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    const stepId = window.location.pathname.split("/").pop();
    const step = posting.workflow?.steps?.find((s) => s._id === stepId);
    const isCurrent =
      posting?.workflow?.steps?.find((s) => s._id === stepId)?.status ===
      "in-progress";

    if (step) {
      setStep(step);
      setIsCurrent(isCurrent);
    }
  }, [active]);


  if (!isCurrent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h4 className="text-2xl font-semibold">Step Not Current</h4>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h4>{step?.name}</h4>
      <DataTable data={posting?.candidates} />
    </div>
  );
};

export default Custom;
