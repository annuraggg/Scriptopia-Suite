import React from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";

interface Department {
  id: string;
  name: string;
}

export interface FilterProps {
  onFilterChange: (filters: {
    year: string;
    departments: string[];
  }) => void;
  onClearFilters: () => void;
}

const departments: Department[] = [
  { id: "1", name: "Computer Engineering" },
  { id: "2", name: "Information Technology" },
  { id: "3", name: "CSE-AIML" },
  { id: "4", name: "CSE-Data Science" },
  { id: "5", name: "Mechanical Engineering" },
  { id: "6", name: "Civil Engineering" },
];

const years = ["2023-2024", "2022-2023", "2021-2022"];

const Filter: React.FC<FilterProps> = ({ onFilterChange, onClearFilters }) => {
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);

  const handleDepartmentChange = (deptId: string) => {
    const newSelectedDepts = selectedDepartments.includes(deptId)
      ? selectedDepartments.filter((id) => id !== deptId)
      : [...selectedDepartments, deptId];
    
    setSelectedDepartments(newSelectedDepts);
    onFilterChange({ year: selectedYear, departments: newSelectedDepts });
  };

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

          <div>
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
              <br></br>
              {departments.map((dept) => (
                <Checkbox
                  key={dept.id}
                  value={dept.id}
                  isSelected={selectedDepartments.includes(dept.id)}
                  onChange={() => handleDepartmentChange(dept.id)}
                >
                  {dept.name}
                </Checkbox>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="text-sm text-default-500"
              onClick={handleClear}
            >
              Clear All
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Filter;