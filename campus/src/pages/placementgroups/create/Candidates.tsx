import { DataTable } from "./DataTable";
import { useOutletContext } from "react-router-dom";
import { RootContext } from "@/types/RootContext";
import { Button } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { PlacementGroupRule } from "@shared-types/PlacementGroup";

interface CandidatesProps {
  candidates: string[];
  setCandidates: (ids: string[]) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onSave: () => void;
  loading?: boolean;
  rules: PlacementGroupRule[];
}

const Candidates = ({
  candidates,
  setCandidates,
  activeStep,
  setActiveStep,
  onSave,
  loading = false,
  rules,
}: CandidatesProps) => {
  const { institute } = useOutletContext<RootContext>();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="mb-6">
        <DataTable
          data={institute.candidates}
          selectedCandidates={candidates}
          setSelectedCandidates={setCandidates}
          rules={rules}

        />
      </div>

      <div className="flex items-center gap-5 justify-end mt-5">
        <Button
          variant="flat"
          color="danger"
          onPress={() => setActiveStep(activeStep - 1)}
          isDisabled={loading}
        >
          Back
        </Button>
        <Button
          variant="flat"
          color="success"
          endContent={<ChevronRight size={20} />}
          onPress={onSave}
          isLoading={loading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Candidates;
