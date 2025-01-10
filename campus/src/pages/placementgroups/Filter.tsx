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

const departments: Department[] = [
  { id: "1", name: "Computer Engineering" },
  { id: "2", name: "Information Technology" },
  { id: "3", name: "CSE-AIML" },
  { id: "4", name: "CSE-Data Science" },
  { id: "5", name: "Mechanical Engineering" },
  { id: "6", name: "Civil Engineering" },
];

const years = ["2023-2024", "2022-2023", "2021-2022"];

const Filter: React.FC = () => {
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);

  const handleDepartmentChange = (deptId: string) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments(selectedDepartments.filter((id) => id !== deptId));
    } else {
      setSelectedDepartments([...selectedDepartments, deptId]);
    }
  };

  return (
    <Card className="bg-default-50">
      <CardBody className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <hr className="border-default-200 mb-4" />
          </div>

          <div>
            <h4 className="text-base mb-3">Year</h4>
            <Select
              placeholder="Select year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <h4 className="text-base mb-3">Department</h4>
            <div className="space-y-3">
              <Checkbox
                value="all"
                isSelected={selectedDepartments.length === departments.length}
                onChange={() =>
                  setSelectedDepartments(
                    selectedDepartments.length === departments.length
                      ? []
                      : departments.map((d) => d.id)
                  )
                }
              >
                All
              </Checkbox>
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
              onClick={() => {
                setSelectedYear("");
                setSelectedDepartments([]);
              }}
            >
              Clear All
            </button>
            <button className="text-sm text-primary">Apply Filters</button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Filter;