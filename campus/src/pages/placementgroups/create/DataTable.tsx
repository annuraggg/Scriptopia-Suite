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

import { ArrowUpDown } from "lucide-react";
import { Button, Checkbox } from "@nextui-org/react";
import { useState } from "react";
import { ExtendedInstituteCandidate } from "@shared-types/ExtendedInstituteCandidate";

interface DataTableProps<TData extends ExtendedInstituteCandidate> {
  data: TData[];
  selectedCandidates?: string[];
  setSelectedCandidates?: (candidateIds: string[]) => void;
}

export function DataTable<TData extends ExtendedInstituteCandidate>({
  data = [],
  selectedCandidates,
  setSelectedCandidates,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<TData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isSelected={table.getIsAllRowsSelected()}
          onValueChange={(value) => {
            if (value) {
              const allCandidateIds = table
                .getRowModel()
                .rows.map((row) => row.original.candidate._id);
              setSelectedCandidates?.(allCandidateIds as string[]);
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
          isSelected={selectedCandidates?.includes(row.original.candidate._id!)}
          onValueChange={(value) => {
            const candidateId = row.original.candidate._id;
            console.log(value);
            console.log(selectedCandidates);
            console.log(candidateId);
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
      accessorKey: "uid",
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
      accessorKey: "candidate.name",
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
      accessorKey: "candidate.email",
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
      accessorKey: "candidate.createdAt",
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
        const createdAt = row.original.candidate.createdAt;
        return createdAt ? new Date(createdAt).toDateString() : "N/A";
      },
    },
  ];

  const table = useReactTable({
    data,
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
      <p className="mb-5">Select Candidates to Add:</p>
      <div className="rounded-md border">
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
    </div>
  );
}
