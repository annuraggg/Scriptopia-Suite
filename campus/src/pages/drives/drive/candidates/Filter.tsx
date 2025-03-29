import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Checkbox } from "@heroui/checkbox";
import { ArrowDownWideNarrow } from "lucide-react";

const Filter: React.FC = () => {
  const [workflowStages, setWorkflowStages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setWorkflowStages([...workflowStages, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setWorkflowStages(workflowStages.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start mt-1">
      <div className="flex items-center justify-between w-full rounded-lg radius-md">
        <div className="flex items-center gap-1 w-full">
          <ArrowDownWideNarrow size={24} />
          <p className="text-neutral-400 text-sm">Sort by</p>
        </div>
        <Select size="sm" placeholder="Select" className="max-w-xs">
          <SelectItem key="text">Drives (a-z)</SelectItem>
          <SelectItem key="text">Drives (z-a)</SelectItem>
        </Select>
      </div>
      <Card className="w-full h-full mt-6">
        <CardBody className="flex flex-col items-start justify-start gap-3 w-full p-4">
          <p className="text-lg font-semibold">Filters</p>
          <hr className="w-full h-[1px] bg-gray-200 rounded-lg"></hr>
          <p className="text-neutral-400 text-base mt-2">Candidates Status</p>
          <div className="flex flex-col items-start justify-start gap-4 w-full text-sm mt-2">
            <Checkbox size="sm">Qualified</Checkbox>
            <Checkbox size="sm">Disqualified</Checkbox>
          </div>
          <hr className="w-full h-[1px] bg-gray-200 rounded-lg mt-2"></hr>
          <p className="text-neutral-400 text-base mt-2">
            In the Workflow Stage
          </p>
          <div className="flex flex-col w-full gap-2">
            {workflowStages.length > 0 && (
              <div className="flex flex-row flex-wrap gap-2 mb-2">
                {workflowStages.map((stage, index) => (
                  <Chip
                    key={index}
                    onClose={() => removeTag(stage)}
                    variant="flat"
                  >
                    {stage}
                  </Chip>
                ))}
              </div>
            )}
            <Input
              type="search"
              placeholder="Search workflow stage"
              className="w-full"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
          </div>
          <hr className="w-full h-[1px] bg-gray-200 rounded-lg mt-2"></hr>
          <p className="text-neutral-400 text-base mt-2">Date Range</p>
          <div className="flex flex-col items-start justify-start gap-4 w-full text-sm mt-2">
            <Input
              type="date"
              label="Apply Date"
              placeholder="Select start date"
              className="w-full"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Filter;
