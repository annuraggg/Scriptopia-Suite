import React from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { Department } from "@shared-types/Organization";

interface FilterProps {
  workScheduleFilter: string[];
  setWorkScheduleFilter: React.Dispatch<React.SetStateAction<string[]>>;
  departmentFilter: string;
  departments: Department[];
  setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;
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
  departmentFilter,
  setDepartmentFilter,
  departments,
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

          <p className="text-base mt-5">Department</p>
          <div className="flex flex-col items-start justify-start gap-4 w-full text-sm mt-2">
            <Select
              size="sm"
              placeholder="Select department"
              className="w-full"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departments?.map((department) => (
                <SelectItem key={department.name}>{department.name}</SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Filter;
