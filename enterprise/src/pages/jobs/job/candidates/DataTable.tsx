"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { useOutletContext } from "react-router-dom";
import { Posting as PostingType } from "@shared-types/Posting";
import { Candidate } from "@shared-types/Candidate";
import { useNavigate } from "react-router-dom";

interface DataTableProps {
  data: Candidate[];
  downloadResume: (url: string) => void;
}

export function DataTable({ data, downloadResume }: DataTableProps) {
  const [candidates] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [currentPostingId, setCurrentPostingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const { posting } = useOutletContext() as { posting: PostingType };
  useEffect(() => {
    if (posting) {
      setCurrentPostingId(posting?._id as string);
      console.log(candidates);
      console.log(posting?._id);
    }
  }, [currentPostingId, posting]);

  const columns: ColumnDef<Candidate>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isSelected={table.getIsAllPageRowsSelected()}
          onValueChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isSelected={row.getIsSelected()}
          onValueChange={(value) => row.toggleSelected(!!value)}
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
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "resume",
      header: () => <span>Resume</span>,
      cell: ({ row }) => {
        return (
          <>
            {" "}
            <Button
              variant="flat"
              onPress={() => downloadResume(row.original._id as string)}
              color="success"
            >
              <Download size={16} />
              Resume
            </Button>
            <Button
              variant="flat"
              onPress={() => navigate(`/candidates/${row.original._id}`)}
              className="ml-3"
            >
              <User size={16} />
              View
            </Button>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: candidates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: { pageSize: 10, pageIndex: pageIndex },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center space-x-2">
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
      </div>
      <div className="w-full overflow-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
