"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Checkbox } from "@nextui-org/react";
import { useState } from "react";

interface Candidate {
  _id: string;
  name: string;
  uid: string;
  department: string;
  placed: boolean;
}

interface DataTableProps {
  data: Candidate[];
}

export function CompanyTable({ data = [] }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const columns: ColumnDef<Candidate>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isSelected={table.getIsAllPageRowsSelected()}
          isIndeterminate={table.getIsSomePageRowsSelected()}
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
    },
    {
      accessorKey: "uid",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "placed",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Placed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("placed") ? "Yes" : "No"}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button onPress={() => window.open("/c/" + row.original._id)}>
          View Profile
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination: { pageSize: 10, pageIndex: pageIndex },
    },
  });

  return (
    <div className="rounded-md">
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          onClick={() => setPageIndex(pageIndex - 1)}
          isDisabled={!table.getCanPreviousPage()}
          isIconOnly
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={() => setPageIndex(pageIndex + 1)}
          isDisabled={!table.getCanNextPage()}
          isIconOnly
        >
          <ChevronRight />
        </Button>
      </div>
      <Table className="mt-5">
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
    </div>
  );
}
