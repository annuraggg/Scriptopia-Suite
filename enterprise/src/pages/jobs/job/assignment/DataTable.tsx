import { useEffect, useState } from "react";
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

import {
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Users,
} from "lucide-react";
import { Tooltip } from "@nextui-org/tooltip";
import { Button, Input, Checkbox } from "@nextui-org/react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Posting } from "@shared-types/Posting";

interface DataTableProps<TData> {
  data: TData[];
  postingId: string;
  assignmentId: string;
}

function DataTable<TData>({
  data,
  postingId,
  assignmentId,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [threshold, setThreshold] = useState(0);
  const [grades, setGrades] = useState<Record<string, number>>({});

  const [currentStepId, setCurrentStepId] = useState<number>(-1);
  const [assessmentStepId, setAssessmentStepId] = useState<number>(-1);

  const { posting } = useOutletContext() as { posting: Posting };

  interface Submission {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    submittedOn: string;
    grade: number;
  }

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    const initialGrades: Record<string, number> = {};
    (data as Submission[]).forEach((submission) => {
      if (submission.grade) {
        initialGrades[submission._id] = submission.grade;
      }
    });
    setGrades(initialGrades);

    setCurrentStepId(posting?.workflow?.currentStep as number);
    const stepId = window.location.pathname.split("/")[4];
    if (!posting?.workflow?.steps) return;
    const step = posting?.workflow?.steps.findIndex(
      (step) => step.stepId === stepId
    );
    setAssessmentStepId(step);
  }, [data]);

  const downloadAssignment = (_id: string) => {
    axios
      .post("candidates/assignment/download", {
        candidateId: _id,
        postingId,
        assignmentId,
      })
      .then((res) => window.open(res.data.data, "_blank"))
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to download assignment"
        );
        console.error(err);
      });
  };

  const qualifyCandidate = (_id: string) => {
    axios
      .post("candidates/assignment/qualify", {
        candidateId: _id,
        postingId,
        assignmentId,
      })
      .then(() => {
        toast.success("Candidate qualified successfully");
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Failed to qualify candidate");
        console.error(err);
      });
  };

  const disqualifyCandidate = (_id: string) => {
    axios
      .post("candidates/assignment/disqualify", {
        candidateId: _id,
        postingId,
        assignmentId,
      })
      .then(() => {
        toast.success("Candidate disqualified successfully");
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to disqualify candidate"
        );
        console.error(err);
      });
  };

  const gradeCandidate = (_id: string, grade: number) => {
    axios
      .post("candidates/assignment/grade", {
        candidateId: _id,
        postingId,
        assignmentId,
        grade,
      })
      .then(() => {
        toast.success("Candidate graded successfully");
        setGrades((prevGrades) => ({ ...prevGrades, [_id]: grade }));
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Failed to grade candidate");
        console.error(err);
      });
  };

  const bulkQualifyCandidates = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(
      (row) => (row.original as Submission)._id
    );

    axios
      .post("candidates/resume/qualify/bulk", {
        candidateIds: selectedIds,
        postingId,
      })
      .catch((err) => {
        toast.error(
          err.response.data.message ||
            "Failed to disqualify selected candidates"
        );
        console.error(err);
      });
    toast.success(`Qualified ${selectedRows.length} candidates`);
  };

  const bulkDisqualifyCandidates = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(
      (row) => (row.original as Submission)._id
    );
    axios
      .post("candidates/resume/disqualify/bulk", {
        candidateIds: selectedIds,
        postingId,
      })
      .catch((err) => {
        toast.error(
          err.response.data.message ||
            "Failed to disqualify selected candidates"
        );
        console.error(err);
      });

    toast.success(`Disqualified ${selectedRows.length} candidates`);
  };

  const columns: ColumnDef<Submission>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isSelected={
            (table.getIsAllPageRowsSelected() as boolean) ||
            table.getIsSomePageRowsSelected()
          }
          onValueChange={(value) => table.toggleAllPageRowsSelected(value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isSelected={row.getIsSelected()}
          onValueChange={(value) => row.toggleSelected(value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
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
      accessorKey: "submittedOn",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const _id = row.original._id;
        return (
          <div className="flex gap-3">
            <Input
              placeholder="Grade"
              type="number"
              min="1"
              max="100"
              isDisabled={currentStepId !== assessmentStepId}
              value={grades[_id]?.toString() || ""}
              onChange={(e) => {
                const newGrade = parseInt(e.target.value);
                if (newGrade >= 1 && newGrade <= 100) {
                  setGrades((prevGrades) => ({
                    ...prevGrades,
                    [_id]: newGrade,
                  }));
                }
              }}
              className="w-[100px]"
            />
            <Button
              variant="flat"
              color="success"
              isDisabled={currentStepId !== assessmentStepId}
              onClick={() => gradeCandidate(_id, grades[_id] || 0)}
            >
              Save
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="light"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const _id = row.original._id;
        return (
          <div className="flex gap-2">
            <Tooltip content="Qualify">
              <Button
                isIconOnly
                variant="flat"
                color="success"
                onClick={() => qualifyCandidate(_id)}
                isDisabled={currentStepId !== assessmentStepId}
              >
                <Check />
              </Button>
            </Tooltip>
            <Tooltip content="Disqualify">
              <Button
                isIconOnly
                variant="flat"
                color="danger"
                onClick={() => disqualifyCandidate(_id)}
                isDisabled={currentStepId !== assessmentStepId }
              >
                <X />
              </Button>
            </Tooltip>
            <Tooltip content="Download Assignment">
              <Button
                isIconOnly
                variant="flat"
                color="warning"
                onClick={() => downloadAssignment(_id)}
              >
                <Download />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data, // @ts-expect-error - data is not assignable to never
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

  const selectAboveThreshold = () => {
    table.toggleAllRowsSelected(false);
    table.getFilteredRowModel().rows.forEach((row) => {
      if ((row.original as Submission).grade > threshold) {
        row.toggleSelected(true);
      }
    });
  };

  return (
    <div className="rounded-md">
      <div className="flex items-center gap-5 flex-wrap mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Threshold"
            type="number"
            min="1"
            max="100"
            value={threshold.toString()}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-[100px]"
            isDisabled={currentStepId !== assessmentStepId}
          />
          <Button
            onClick={selectAboveThreshold}
            color="primary"
            isDisabled={currentStepId !== assessmentStepId}
          >
            <Users className="mr-2 h-4 w-4" />
            Select Above Threshold
          </Button>
        </div>
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={bulkQualifyCandidates}
          color="success"
          isDisabled={
            table.getFilteredSelectedRowModel().rows.length === 0 ||
            currentStepId !== assessmentStepId
          }
        >
          <Check className="mr-2 h-4 w-4" />
          Bulk Qualify
        </Button>
        <Button
          onClick={bulkDisqualifyCandidates}
          color="danger"
          isDisabled={
            table.getFilteredSelectedRowModel().rows.length === 0 ||
            currentStepId !== assessmentStepId
          }
        >
          <X className="mr-2 h-4 w-4" />
          Bulk Disqualify
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="flat"
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="flat"
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default DataTable;
