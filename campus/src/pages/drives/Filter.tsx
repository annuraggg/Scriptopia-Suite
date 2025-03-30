import React from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { Company } from "@shared-types/Company";

interface FilterProps {
  workScheduleFilter: string[];
  setWorkScheduleFilter: React.Dispatch<React.SetStateAction<string[]>>;
  companyFilter: string;
  companies: Company[];
  setCompanyFilter: React.Dispatch<React.SetStateAction<string>>;
  dateRange: { start: string; end: string };
  setDateRange: React.Dispatch<
    React.SetStateAction<{ start: string; end: string }>
  >;
  sort: Set<string>;
  setSort: React.Dispatch<Set<string>>;
}

const Filter: React.FC<FilterProps> = ({
  workScheduleFilter,
  setWorkScheduleFilter,
  companyFilter,
  setCompanyFilter,
  companies,
  // sort,
  // setSort,
  //   dateRange,
  //   setDateRange,
}) => {
  const handleWorkScheduleChange = (value: string) => {
    if (workScheduleFilter.includes(value)) {
      setWorkScheduleFilter(
        workScheduleFilter.filter((item) => item !== value)
      );
    } else {
      setWorkScheduleFilter([...workScheduleFilter, value]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <Card className="w-full h-full">
        <CardBody className="flex flex-col items-start justify-start gap-3 w-full p-4">
          <p className="text-lg font-semibold">Filters</p>
          <hr className="w-full h-[1px] rounded-lg"></hr>
          <p className="text-base mt-2">Work Schedule</p>
          <div className="flex flex-col items-start justify-start gap-4 w-full text-sm mt-2">
            <Checkbox
              size="sm"
              isSelected={workScheduleFilter.includes("full_time")}
              onValueChange={() => handleWorkScheduleChange("full_time")}
            >
              Full Time
            </Checkbox>
            <Checkbox
              size="sm"
              isSelected={workScheduleFilter.includes("part_time")}
              onValueChange={() => handleWorkScheduleChange("part_time")}
            >
              Part Time
            </Checkbox>
            <Checkbox
              size="sm"
              isSelected={workScheduleFilter.includes("internship")}
              onValueChange={() => handleWorkScheduleChange("internship")}
            >
              Internship
            </Checkbox>
          </div>

          <p className="text-base mt-5">Company</p>
          <div className="flex flex-col items-start justify-start gap-4 w-full text-sm mt-2">
            <Select
              size="sm"
              placeholder="Select company"
              className="w-full"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              {companies?.map((company) => (
                <SelectItem key={company.name}>{company.name}</SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Filter;
