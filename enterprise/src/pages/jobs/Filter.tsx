import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
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
    <div className="w-full">
      <Card className="w-full">
        <CardBody className="flex flex-col items-start justify-start gap-3 w-full p-4">
          <p className="text-lg font-semibold">Filters</p>
          <hr className="w-full h-[1px] rounded-lg" />

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <p className="text-base font-medium">Work Schedule</p>
              <div className="flex flex-col md:flex-row lg:flex-col gap-4 flex-wrap">
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
            </div>

            <div className="space-y-2">
              <p className="text-base font-medium">Department</p>
              <Select
                size="sm"
                placeholder="Select department"
                className="w-full"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments?.map((department) => (
                  <SelectItem key={department.name}>
                    {department.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Filter;
