import React from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { ChevronRight } from "lucide-react";

interface AccessConfigTabProps {
  accessType: "public" | "private";
  setAccessType: (type: "public" | "private") => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const AccessConfigTab: React.FC<AccessConfigTabProps> = ({
  accessType,
  setAccessType,
  activeStep,
  setActiveStep,
}) => {
  const accessTypes = [
    {
      key: "private",
      label: "Private Access",
      description: "Approval required to join the group",
    },
    {
      key: "public",
      label: "Public Access",
      description: "Open to all students in this department",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full">
        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Access Type</p>
            <p className="opacity-50">
              Determine how members can join this group
            </p>
          </div>
          <div className="w-[500px]">
            <Select
              label="Access Type"
              selectedKeys={[accessType]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as "public" | "private";
                setAccessType(selected);
              }}
              className="w-full"
            >
              {accessTypes.map((type) => (
                <SelectItem key={type.key} textValue={type.label}>
                  <div>
                    <p>{type.label}</p>
                    <p className="text-xs opacity-50">{type.description}</p>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-end mt-5">
        <Button
          variant="flat"
          color="danger"
          onPress={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        <Button
          variant="flat"
          color="success"
          endContent={<ChevronRight size={20} />}
          onPress={() => setActiveStep(activeStep + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AccessConfigTab;
