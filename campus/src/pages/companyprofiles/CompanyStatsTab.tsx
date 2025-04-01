import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface CompanyStatsTabProps {
  avgPackage: string;
  setAvgPackage: (pkg: string) => void;
  highestPackage: string;
  setHighestPackage: (pkg: string) => void;
  studentsHired: string;
  setStudentsHired: (count: string) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onSave: () => void;
  loading?: boolean;
}

const CompanyStatsTab: React.FC<CompanyStatsTabProps> = ({
  avgPackage,
  setAvgPackage,
  highestPackage,
  setHighestPackage,
  studentsHired,
  setStudentsHired,
  activeStep,
  setActiveStep,
  onSave,
  loading = false,
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-sm w-[30%]">
            <p>Average Package</p>
            <p className="opacity-50">Annual compensation in INR</p>
          </div>
          <div>
            <Input
              type="number"
              min="0"
              placeholder="800000"
              value={avgPackage}
              onChange={(e) => setAvgPackage(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Highest Package</p>
            <p className="opacity-50">Peak annual compensation in INR</p>
          </div>
          <div>
            <Input
              type="number"
              min="0"
              placeholder="1500000"
              value={highestPackage}
              onChange={(e) => setHighestPackage(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Students Hired</p>
            <p className="opacity-50">Total hires last season</p>
          </div>
          <div>
            <Input
              type="number"
              min="0"
              placeholder="50"
              value={studentsHired}
              onChange={(e) => setStudentsHired(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>
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
          onPress={onSave}
          isLoading={loading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CompanyStatsTab;