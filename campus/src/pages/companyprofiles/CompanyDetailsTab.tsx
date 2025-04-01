import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ChevronRight } from "lucide-react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface CompanyDetailsTabProps {
  name: string;
  setName: (name: string) => void;
  industry: string[];
  setIndustry: (industry: string[]) => void;
  description: string;
  setDescription: (desc: string) => void;
  rolesOffered: string[];
  setRolesOffered: (roles: string[]) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Education",
  "Consulting",
  "Other"
];

const defaultRoles = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Business Analyst",
  "UX Designer",
  "Sales Executive",
  "Marketing Specialist",
  "Operations Manager",
  "Finance Analyst"
];

const CompanyDetailsTab: React.FC<CompanyDetailsTabProps> = ({
  name,
  setName,
  industry,
  setIndustry,
  description,
  setDescription,
  rolesOffered,
  setRolesOffered,
  activeStep,
  setActiveStep,
}) => {
  const toggleIndustry = (industryName: string) => {
    setIndustry(
      industry.includes(industryName)
        ? industry.filter(i => i !== industryName)
        : [...industry, industryName]
    );
  };

  const handleRoleSelect = (role: string) => {
    if (!rolesOffered.includes(role)) {
      setRolesOffered([...rolesOffered, role]);
    }
  };

  const handleRemoveRole = (role: string) => {
    setRolesOffered(rolesOffered.filter(r => r !== role));
  };

  const handleRoleInputChange = (value: string) => {
    if (value.endsWith(",") || value.endsWith(" ")) {
      const newRole = value.slice(0, -1).trim();
      if (newRole && !rolesOffered.includes(newRole)) {
        setRolesOffered([...rolesOffered, newRole]);
        return "";
      }
    }
    return value;
  };

  return (
    <div className="flex justify-between flex-col h-full">
      <div className="w-full">
        <div className="flex justify-between">
          <div className="text-sm w-[30%]">
            <p>Company Name</p>
            <p className="opacity-50">The official name of your company</p>
          </div>
          <div>
            <Input
              placeholder="e.g. Tech Corp Inc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[500px]"
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Industry</p>
            <p className="opacity-50">Select relevant industries</p>
          </div>
          <div className="w-[500px]">
            <div className="flex flex-wrap gap-2">
              {industries.map((industryName) => (
                <div
                  key={industryName}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-all 
                    ${
                      industry.includes(industryName)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  onClick={() => toggleIndustry(industryName)}
                >
                  {industryName}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Description</p>
            <p className="opacity-50">Brief overview of your company</p>
          </div>
          <div>
            <textarea
              placeholder="Company description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-[500px] p-2 border rounded"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-between mt-7">
          <div className="text-sm w-[30%]">
            <p>Roles Offered</p>
            <p className="opacity-50">Positions available for placement</p>
          </div>
          <div className="w-[500px]">
            <Autocomplete
              placeholder="Type a role and press Enter or comma"
              allowsCustomValue={true}
              onSelectionChange={(key) => {
                if (key) handleRoleSelect(String(key));
              }}
              onInputChange={handleRoleInputChange}
              className="w-full mb-2"
            >
              {defaultRoles.map((role) => (
                <AutocompleteItem key={role} value={role}>
                  {role}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {rolesOffered.map((role) => (
                <div
                  key={role}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{role}</span>
                  <button
                    className="ml-2 text-blue-600 font-semibold"
                    onClick={() => handleRemoveRole(role)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-end mt-5">
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

export default CompanyDetailsTab;