import React from "react";
import { Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import { Department } from "@shared-types/Institute";

export interface FilterProps {
  departments: Department[];
  onFilterChange: (filters: { year: string; departments: string[] }) => void;
  onClearFilters: () => void;
}

const years = ["2023-2024", "2022-2023", "2021-2022"];

const Filter: React.FC<FilterProps> = ({ onFilterChange, onClearFilters }) => {
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = React.useState<
    string[]
  >([]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    onFilterChange({ year, departments: selectedDepartments });
  };

  const handleClear = () => {
    setSelectedYear("");
    setSelectedDepartments([]);
    onClearFilters();
  };

  return (
    <Card className="">
      <CardBody className="p-5">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <hr className="border-default-200 mb-4" />
          </div>

          <div>
            <h4 className="text-lg mb-3">Year</h4>
            <Select
              placeholder="Select year"
              selectedKeys={selectedYear ? [selectedYear] : []}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* <div>
            <h4 className="text-lg mb-3">Department</h4>
            <div className="space-y-2">
              <Checkbox
                value="all"
                isSelected={selectedDepartments.length === departments.length}
                onChange={() =>
                  handleDepartmentChange(
                    selectedDepartments.length === departments.length
                      ? "clear-all"
                      : "select-all"
                  )
                }
              >
                All
              </Checkbox>

              {departments.map((dept) => (
                <div key={dept._id!}>
                  <Checkbox
                    value={dept._id!}
                    isSelected={selectedDepartments.includes(dept._id!)}
                    onChange={() => handleDepartmentChange(dept._id!)}
                  >
                    {dept.name}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div> */}

          <div className="flex justify-between mt-6">
            <button className="text-sm text-default-500" onClick={handleClear}>
              Clear All
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Filter;
