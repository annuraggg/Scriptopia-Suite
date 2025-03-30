import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface AccessProps {
  setAction: Dispatch<SetStateAction<number>>;
}

const Access = ({ setAction }: AccessProps) => {
  return (
    <div>
      <div className="flex gap-3">
        <Button
          variant="flat"
          color="success"
          startContent={<ChevronLeft size={20} />}
          onPress={() => setAction(1)}
        >
          Back
        </Button>

        <Button
          variant="flat"
          color="success"
          endContent={<ChevronRight size={20} />}
          onPress={() => setAction(3)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Access;
