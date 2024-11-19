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
  sort,
  setSort,
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
    <div className="w-full h-full flex flex-col items-center justify-start mt-1">
      <div className="flex items-center justify-between w-full rounded-lg radius-md">
        <div className="flex items-center gap-1 w-full">
          <p className="text-neutral-400 text-sm">Sort by</p>
        </div>
        <Select
          size="sm"
          selectedKeys={sort} // @ts-expect-error - idk
          onSelectionChange={setSort}
        >
          <SelectItem key="newest">Newest</SelectItem>
          <SelectItem key="oldest">Oldest</SelectItem>
          <SelectItem key="salary">Salary</SelectItem>
        </Select>
      </div>
      <Card className="w-full h-full mt-7">
        <CardBody className="flex flex-col items-start justify-start gap-3 w-full p-4">
          <p className="text-lg font-semibold">Filters</p>
          <hr className="w-full h-[1px] bg-gray-200 rounded-lg"></hr>
          <p className="text-neutral-400 text-base mt-2">Work Schedule</p>
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

          <p className="text-neutral-400 text-base mt-5">Department</p>
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
          {/* <hr className="w-full h-[1px] bg-gray-200 rounded-lg mt-2"></hr>
          <p className="text-neutral-400 text-base mt-2">Date Range</p>
          <div className="flex flex-col items-start justify-start gap-4 w-full text-sm mt-2">
            <Input
              type="date"
              label="Start Date"
              placeholder="Select start date"
              className="w-full"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
            <Input
              type="date"
              label="End Date"
              placeholder="Select end date"
              className="w-full"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div> */}
        </CardBody>
      </Card>
    </div>
  );
};

export default Filter;
