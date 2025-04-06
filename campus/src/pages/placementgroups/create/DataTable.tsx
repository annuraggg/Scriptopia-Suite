"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowUpDown, Filter, AlertCircle } from "lucide-react";
import {
  Button,
  Checkbox,
  Spinner,
  Tooltip,
  Card,
  Badge,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Candidate } from "@shared-types/Candidate";
import { PlacementGroupRule } from "@shared-types/PlacementGroup";

interface DataTableProps<TData extends Candidate> {
  data: TData[];
  selectedCandidates?: string[];
  setSelectedCandidates?: (candidateIds: string[]) => void;
  rules?: PlacementGroupRule[];
  isLoadingRules?: boolean;
}

export function DataTable<TData extends Candidate>({
  data = [],
  selectedCandidates = [],
  setSelectedCandidates,
  rules = [],
  isLoadingRules = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterStats, setFilterStats] = useState({
    total: data.length,
    matching: 0,
    excluded: 0,
  });

  // Filter candidates based on rules
  const filterCandidates = (
    candidates: TData[],
    filterRules: PlacementGroupRule[]
  ) => {
    if (!filterRules || filterRules.length === 0) return candidates;

    setIsFiltering(true);

    try {
      const result = candidates.filter((candidate) => {
        return filterRules.every((rule) => {
          return matchesRule(candidate, rule);
        });
      });

      setFilterStats({
        total: candidates.length,
        matching: result.length,
        excluded: candidates.length - result.length,
      });

      return result;
    } finally {
      setIsFiltering(false);
    }
  };

  // Check if a candidate matches a specific rule
  const matchesRule = (candidate: TData, rule: PlacementGroupRule): boolean => {
    const { category, subcategory, operator, value, type } = rule;

    switch (category) {
      case "basic":
        return matchBasicRule(candidate, subcategory, operator, value);

      case "education":
        return matchEducationRule(
          candidate,
          subcategory,
          operator,
          value,
          type
        );

      case "work":
        return matchWorkRule(candidate, subcategory, operator, value);

      case "projects":
        return matchProjectsRule(candidate, subcategory, operator, value);

      case "achievements":
        return matchAchievementsRule(candidate, subcategory, operator, value);

      default:
        return true;
    }
  };

  // Helper function to compare values based on operator
  const compareValues = (
    candidateValue: any,
    ruleValue: any,
    operator: string
  ) => {
    // Handle null or undefined values
    if (candidateValue === null || candidateValue === undefined) {
      return false;
    }

    // Convert string numbers to actual numbers if possible
    if (typeof ruleValue === "string" && !isNaN(Number(ruleValue))) {
      ruleValue = Number(ruleValue);
    }

    switch (operator) {
      case "=":
        return candidateValue === ruleValue;
      case "!=":
        return candidateValue !== ruleValue;
      case ">":
        return candidateValue > ruleValue;
      case ">=":
        return candidateValue >= ruleValue;
      case "<":
        return candidateValue < ruleValue;
      case "<=":
        return candidateValue <= ruleValue;
      case "contains":
        return String(candidateValue)
          .toLowerCase()
          .includes(String(ruleValue).toLowerCase());
      case "not_contains":
        return !String(candidateValue)
          .toLowerCase()
          .includes(String(ruleValue).toLowerCase());
      default:
        return true;
    }
  };

  // Match basic information rules
  const matchBasicRule = (
    candidate: TData,
    subcategory: string,
    operator: string,
    value: any
  ): boolean => {
    switch (subcategory) {
      case "age": {
        const dob = candidate.dob;
        if (!dob) return false;

        const birthDate = new Date(dob);
        const today = new Date();
        const age =
          today.getFullYear() -
          birthDate.getFullYear() -
          (today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
            ? 1
            : 0);

        return compareValues(age, Number(value), operator);
      }

      case "gender":
        return compareValues(candidate.gender, value, operator);

      case "location":
        if (!candidate.address) return false;
        return compareValues(candidate.address, value, operator);

      default:
        return true;
    }
  };

  // Match education rules
  const matchEducationRule = (
    candidate: TData,
    subcategory: string,
    operator: string,
    value: any,
    type?: string
  ): boolean => {
    if (!candidate.education || candidate.education.length === 0) {
      return false;
    }

    switch (subcategory) {
      case "percentage": {
        if (!type) return false;

        // Find education entry matching the type
        let educationEntry;

        switch (type) {
          case "ssc":
            educationEntry = candidate.education.find(
              (edu) =>
                edu.degree?.toLowerCase().includes("10th") ||
                edu.degree?.toLowerCase().includes("ssc") ||
                edu.degree?.toLowerCase().includes("secondary")
            );
            break;
          case "hsc":
            educationEntry = candidate.education.find(
              (edu) =>
                edu.degree?.toLowerCase().includes("12th") ||
                edu.degree?.toLowerCase().includes("hsc") ||
                edu.degree?.toLowerCase().includes("higher secondary")
            );
            break;
          case "diploma":
            educationEntry = candidate.education.find((edu) =>
              edu.degree?.toLowerCase().includes("diploma")
            );
            break;
          case "graduate":
            educationEntry = candidate.education.find(
              (edu) =>
                edu.degree?.toLowerCase().includes("bachelor") ||
                edu.degree?.toLowerCase().includes("b.") ||
                edu.degree?.toLowerCase().includes("graduate") ||
                edu.degree?.toLowerCase().includes("graduation")
            );
            break;
          case "postgraduate":
            educationEntry = candidate.education.find(
              (edu) =>
                edu.degree?.toLowerCase().includes("master") ||
                edu.degree?.toLowerCase().includes("m.") ||
                edu.degree?.toLowerCase().includes("postgraduate") ||
                edu.degree?.toLowerCase().includes("post graduate")
            );
            break;
          case "phd":
            educationEntry = candidate.education.find(
              (edu) =>
                edu.degree?.toLowerCase().includes("phd") ||
                edu.degree?.toLowerCase().includes("doctorate")
            );
            break;
          default:
            educationEntry = undefined;
        }

        if (!educationEntry || !educationEntry.percentage) return false;

        return compareValues(
          educationEntry.percentage,
          Number(value),
          operator
        );
      }

      case "branch": {
        // Check if any education entries have the department/branch
        return candidate.education.some((edu) => {
          if (!edu.branch) return false;

          if (operator === "contains") {
            return edu.branch
              .toLowerCase()
              .includes(String(value).toLowerCase());
          } else if (operator === "not_contains") {
            return !edu.branch
              .toLowerCase()
              .includes(String(value).toLowerCase());
          }

          return compareValues(
            edu.branch.toLowerCase(),
            value.toLowerCase(),
            operator
          );
        });
      }

      case "degree": {
        // Check for specific degree types
        return candidate.education.some((edu) => {
          if (!edu.degree) return false;

          // Get the degree type identifier based on the degree name
          let degreeType = "";

          if (
            edu.degree.toLowerCase().includes("secondary") ||
            edu.degree.toLowerCase().includes("10th")
          ) {
            degreeType = "secondary";
          } else if (
            edu.degree.toLowerCase().includes("higher secondary") ||
            edu.degree.toLowerCase().includes("12th")
          ) {
            degreeType = "senior_secondary";
          } else if (edu.degree.toLowerCase().includes("diploma")) {
            degreeType = "diploma";
          } else if (
            edu.degree.toLowerCase().includes("bachelor") ||
            edu.degree.toLowerCase().includes("b.")
          ) {
            degreeType = "bachelors";
          } else if (
            edu.degree.toLowerCase().includes("master") ||
            edu.degree.toLowerCase().includes("m.")
          ) {
            degreeType = "masters";
          } else if (
            edu.degree.toLowerCase().includes("phd") ||
            edu.degree.toLowerCase().includes("doctorate")
          ) {
            degreeType = "phd";
          } else if (edu.degree.toLowerCase().includes("certificate")) {
            degreeType = "certificate";
          }

          return compareValues(degreeType, value, operator);
        });
      }

      case "graduationYear": {
        // For graduation year as a dropdown selection
        return candidate.education.some((edu) => {
          if (edu.current || !edu.endYear) return false;
          return compareValues(edu.endYear.toString(), value, operator);
        });
      }

      case "gaps": {
        // Calculate gaps between education entries
        if (candidate.education.length < 2) return true; // Not enough data to determine gaps

        const sortedEducation = [...candidate.education].sort(
          (a, b) => (a.startYear || 0) - (b.startYear || 0)
        );
        let maxGap = 0;

        for (let i = 1; i < sortedEducation.length; i++) {
          const gap =
            (sortedEducation[i].startYear || 0) -
            (sortedEducation[i - 1].endYear ||
              sortedEducation[i - 1].startYear ||
              0);
          if (gap > maxGap) maxGap = gap;
        }

        return compareValues(maxGap, Number(value), operator);
      }

      case "activeBacklogs": {
        // Check for active backlogs (would need an "activeBacklogs" field in the candidate schema)
        if (candidate.hasOwnProperty("activeBacklogs")) {
          return compareValues(
            (candidate as any).activeBacklogs,
            Number(value),
            operator
          );
        }
        return false;
      }

      case "totalBacklogs": {
        // Check for total backlogs (would need a "totalBacklogs" field in the candidate schema)
        if (candidate.hasOwnProperty("totalBacklogs")) {
          return compareValues(
            (candidate as any).totalBacklogs,
            Number(value),
            operator
          );
        }
        return false;
      }

      default:
        return true;
    }
  };

  // Match work experience rules
  const matchWorkRule = (
    candidate: TData,
    subcategory: string,
    operator: string,
    value: any
  ): boolean => {
    // Handle case where candidate has no work experience
    if (!candidate.workExperience || candidate.workExperience.length === 0) {
      // If checking for zero experience, return true
      if (
        subcategory === "experience" &&
        Number(value) === 0 &&
        (operator === "=" || operator === "<=" || operator === "<")
      ) {
        return true;
      }
      return false;
    }

    switch (subcategory) {
      case "experience": {
        // Calculate total experience in months
        let totalMonths = 0;

        candidate.workExperience.forEach((exp) => {
          const startDate = new Date(exp.startDate);
          const endDate = exp.current
            ? new Date()
            : exp.endDate
            ? new Date(exp.endDate)
            : new Date();

          const months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

          totalMonths += months > 0 ? months : 0;
        });

        return compareValues(totalMonths, Number(value), operator);
      }

      case "experienceType": {
        return candidate.workExperience.some((exp) => {
          if (!exp.type) return false;
          return compareValues(
            exp.type.toLowerCase(),
            value.toLowerCase(),
            operator
          );
        });
      }

      default:
        return true;
    }
  };

  // Match projects rules
  const matchProjectsRule = (
    candidate: TData,
    subcategory: string,
    operator: string,
    value: any
  ): boolean => {
    // Handle case where candidate has no projects
    if (!candidate.projects || candidate.projects.length === 0) {
      // If checking for zero projects, return true
      if (
        subcategory === "projectCount" &&
        Number(value) === 0 &&
        (operator === "=" || operator === "<=" || operator === "<")
      ) {
        return true;
      }
      return false;
    }

    switch (subcategory) {
      case "projectCount":
        return compareValues(
          candidate.projects.length,
          Number(value),
          operator
        );

      default:
        return true;
    }
  };

  // Match achievements rules
  const matchAchievementsRule = (
    candidate: TData,
    subcategory: string,
    operator: string,
    value: any
  ): boolean => {
    switch (subcategory) {
      case "certificateCount":
        if (!candidate.certificates || candidate.certificates.length === 0) {
          return compareValues(0, Number(value), operator);
        }
        return compareValues(
          candidate.certificates.length,
          Number(value),
          operator
        );

      case "awardCount":
        if (!candidate.awards || candidate.awards.length === 0) {
          return compareValues(0, Number(value), operator);
        }
        return compareValues(candidate.awards.length, Number(value), operator);

      case "scholarshipCount":
        if (!candidate.scholarships || candidate.scholarships.length === 0) {
          return compareValues(0, Number(value), operator);
        }
        return compareValues(
          candidate.scholarships.length,
          Number(value),
          operator
        );

      case "patentCount":
        if (!candidate.patents || candidate.patents.length === 0) {
          return compareValues(0, Number(value), operator);
        }
        return compareValues(candidate.patents.length, Number(value), operator);

      default:
        return true;
    }
  };

  // Apply filtering whenever rules or data change
  useEffect(() => {
    if (rules.length > 0) {
      setIsFiltering(true);
      // Add a slight delay to show loading state
      const timeoutId = setTimeout(() => {
        const filtered = filterCandidates(data, rules);
        setFilteredData(filtered);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setFilteredData(data);
      setFilterStats({
        total: data.length,
        matching: data.length,
        excluded: 0,
      });
    }
  }, [data, rules]);

  const columns: ColumnDef<TData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isSelected={
            filteredData.length > 0 &&
            selectedCandidates.length === filteredData.length
          }
          onValueChange={(value) => {
            if (value) {
              const allCandidateIds = filteredData.map(
                (candidate) => candidate._id as string
              );
              setSelectedCandidates?.(allCandidateIds);
            } else {
              setSelectedCandidates?.([]);
            }
            table.toggleAllRowsSelected(value);
          }}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isSelected={selectedCandidates?.includes(row.original._id!)}
          onValueChange={(value) => {
            const candidateId = row.original._id;
            if (value) {
              setSelectedCandidates?.([...selectedCandidates!, candidateId!]);
            } else {
              setSelectedCandidates?.(
                selectedCandidates?.filter((id) => id !== candidateId) || []
              );
            }
            row.toggleSelected(value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "instituteUid",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unique ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profile Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return createdAt ? new Date(createdAt).toDateString() : "N/A";
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <p>Select Candidates to Add to this Placement Group:</p>
          {rules && rules.length > 0 && (
            <Badge color="primary" variant="flat">
              {`${rules.length} ${
                rules.length === 1 ? "filter" : "filters"
              } applied`}
            </Badge>
          )}
        </div>

        {rules && rules.length > 0 && !isLoadingRules && !isFiltering && (
          <div className="flex items-center gap-2">
            <Badge color="success" variant="flat">
              {filterStats.matching} matching
            </Badge>
            <Badge color="danger" variant="flat">
              {filterStats.excluded} excluded
            </Badge>
            <Tooltip content="Candidates that match all filter criteria">
              <Button
                size="sm"
                variant="light"
                startContent={<Filter size={14} />}
              >
                Filter Stats
              </Button>
            </Tooltip>
          </div>
        )}
      </div>

      {isLoadingRules || isFiltering ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-md">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">
            {isLoadingRules
              ? "Loading filter criteria..."
              : "Applying filters to candidates..."}
          </p>
        </div>
      ) : filteredData.length === 0 && rules && rules.length > 0 ? (
        <Card className="p-6 text-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle size={40} className="text-gray-400" />
            <h3 className="text-xl font-medium">No Matching Candidates</h3>
            <p className="text-gray-600 max-w-md">
              No candidates match the current filter criteria. Try adjusting
              your filters or check that the candidate data contains the
              required information.
            </p>
          </div>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers?.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows?.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells()?.map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {rules && rules.length > 0 && filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
          <Filter size={14} />
          <span>{`Showing ${filteredData.length} of ${data.length} candidates based on filter criteria`}</span>
        </div>
      )}
    </div>
  );
}
