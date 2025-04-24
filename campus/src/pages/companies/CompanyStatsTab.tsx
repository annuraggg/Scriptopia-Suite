import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Plus, Trash } from "lucide-react";

interface YearlyStats {
  year: string;
  avgPackage: string;
  highestPackage: string;
  studentsHired: string;
}

interface CompanyStatsTabProps {
  yearlyStats: YearlyStats[];
  updateYearlyStats: (
    year: string,
    field: keyof Omit<YearlyStats, "year">,
    value: string
  ) => void;
  addYearToStats: (year: string) => void;
  removeYearFromStats: (year: string) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onSave: () => void;
  loading?: boolean;
}

const CompanyStatsTab: React.FC<CompanyStatsTabProps> = ({
  yearlyStats,
  updateYearlyStats,
  addYearToStats,
  removeYearFromStats,
  activeStep,
  setActiveStep,
  onSave,
  loading = false,
}) => {
  const [newYear, setNewYear] = useState<string>("");

  const handleAddYear = () => {
    if (!newYear) return;
    addYearToStats(newYear);
    setNewYear("");
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Year-wise Placement Statistics (Optional)
          </h3>

          {yearlyStats.map((statItem) => (
            <div key={statItem.year} className="mb-8 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-base">Year: {statItem.year}</h4>
                {yearlyStats.length > 1 && (
                  <Button
                    variant="flat"
                    color="danger"
                    size="sm"
                    onPress={() => removeYearFromStats(statItem.year)}
                    isDisabled={loading}
                    className="min-w-0 p-1"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>

              <div className="flex justify-between mt-5">
                <div className="text-sm w-[30%]">
                  <p>Average Package</p>
                  <p className="opacity-50">Annual compensation in INR</p>
                </div>
                <div>
                  <Input
                    type="number"
                    min="0"
                    placeholder="800000"
                    value={statItem.avgPackage}
                    onChange={(e) =>
                      updateYearlyStats(
                        statItem.year,
                        "avgPackage",
                        e.target.value
                      )
                    }
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
                    value={statItem.highestPackage}
                    onChange={(e) =>
                      updateYearlyStats(
                        statItem.year,
                        "highestPackage",
                        e.target.value
                      )
                    }
                    className="w-[500px]"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-7">
                <div className="text-sm w-[30%]">
                  <p>Students Hired</p>
                  <p className="opacity-50">Total hires this season</p>
                </div>
                <div>
                  <Input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={statItem.studentsHired}
                    onChange={(e) =>
                      updateYearlyStats(
                        statItem.year,
                        "studentsHired",
                        e.target.value
                      )
                    }
                    className="w-[500px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2 mt-5">
          <div className="flex-1">
            <p className="text-sm mb-1">Add New Year</p>
            <Input
              type="number"
              min="2000"
              max="2100"
              placeholder="2025"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            variant="flat"
            color="primary"
            onPress={handleAddYear}
            isDisabled={!newYear || loading}
            className="h-[36px]"
          >
            <Plus size={16} className="mr-1" /> Add Year
          </Button>
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
