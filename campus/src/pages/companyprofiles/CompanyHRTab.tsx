import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ChevronRight } from "lucide-react";

interface CompanyHRTabProps {
  hrName: string;
  setHrName: (name: string) => void;
  hrEmail: string;
  setHrEmail: (email: string) => void;
  hrPhone: string;
  setHrPhone: (phone: string) => void;
  hrWebsite: string;
  setHrWebsite: (website: string) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const CompanyHRTab: React.FC<CompanyHRTabProps> = ({
  hrName,
  setHrName,
  hrEmail,
  setHrEmail,
  hrPhone,
  setHrPhone,
  hrWebsite,
  setHrWebsite,
  activeStep,
  setActiveStep,
}) => {
  return (
    <div className="flex justify-between flex-col h-full">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-sm w-[30%]">
            <p>HR Contact Name</p>
            <p className="opacity-50">Primary recruiting contact</p>
          </div>
          <div>
            <Input
              placeholder="e.g. John Doe"
              value={hrName}
              onChange={(e) => setHrName(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Email Address</p>
            <p className="opacity-50">Work email for communications</p>
          </div>
          <div>
            <Input
              type="email"
              placeholder="e.g. hr@company.com"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Phone Number</p>
            <p className="opacity-50">Contact number with country code</p>
          </div>
          <div>
            <Input
              placeholder="e.g. +91 9876543210"
              value={hrPhone}
              onChange={(e) => setHrPhone(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Company Website</p>
            <p className="opacity-50">Official website URL (optional)</p>
          </div>
          <div>
            <Input
              placeholder="e.g. https://company.com"
              value={hrWebsite}
              onChange={(e) => setHrWebsite(e.target.value)}
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

export default CompanyHRTab;