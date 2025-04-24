"use client";

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
  Download,
  User,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Candidate as ICandidate } from "@shared-types/Candidate";
import { Input } from "@heroui/input";
import { useDebouncedCallback } from "use-debounce";

interface DataTableProps {
  data: Candidate[];
  downloadResume: (url: string) => Promise<void>;
  onSearch: (query: string) => void;
  searchQuery: string;
  isLoading: boolean;
  onRetry?: () => void; // Add retry function prop
}

interface Candidate extends ICandidate {
  status: string;
}

export function DataTable({
  data,
  downloadResume,
  onSearch,
  searchQuery,
  isLoading,
  onRetry,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loadingResume, setLoadingResume] = useState<Record<string, boolean>>(
    {}
  );
  const [searchValue, setSearchValue] = useState(searchQuery || "");

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Log data changes to help debug
  useEffect(() => {
    console.log("DataTable received data:", data?.length || 0, "records");
  }, [data]);

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, 500);

  const handleDownloadResume = async (id: string) => {
    setLoadingResume((prev) => ({ ...prev, [id]: true }));
    try {
      await downloadResume(id);
    } finally {
      setLoadingResume((prev) => ({ ...prev, [id]: false }));
    }
  };

  const openProfileInNewWindow = (id: string) => {
    window.open(`/c/${id}`, "_blank");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "accepted":
      case "approved":
        return "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs";
      case "pending":
      case "in progress":
      case "in review":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs";
      case "rejected":
      case "declined":
      case "inactive":
        return "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs";
      default:
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs";
    }
  };

  const columns: ColumnDef<Candidate>[] = [
    {
      accessorKey: "instituteUid",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const uid = row.original.instituteUid;
        return uid ? (
          uid
        ) : (
          <span className="text-gray-400 italic">Not available</span>
        );
      },
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
      cell: ({ row }) => {
        const phone = row.getValue("phone");
        return phone ? (
          phone
        ) : (
          <span className="text-gray-400 italic">Not provided</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status || "Not Set";
        return <span className={getStatusColor(status)}>{status}</span>;
      },
    },
    {
      accessorKey: "resume",
      header: () => <span>Actions</span>,
      cell: ({ row }) => {
        const id = row.original._id as string;
        const isLoading = loadingResume[id];
        const hasResume = !!row.original.resumeUrl;

        return (
          <div className="flex space-x-2">
            {hasResume ? (
              <Button
                variant="flat"
                onPress={() => handleDownloadResume(id)}
                color="success"
                isLoading={isLoading}
                isDisabled={isLoading}
                size="sm"
              >
                <Download size={16} />
                {isLoading ? "Downloading..." : "Resume"}
              </Button>
            ) : (
              <Button
                variant="flat"
                isDisabled={true}
                color="default"
                size="sm"
              >
                <span className="text-gray-400 italic">No Resume</span>
              </Button>
            )}
            <Button
              variant="flat"
              onPress={() => openProfileInNewWindow(id)}
              size="sm"
            >
              <User size={16} />
              <ExternalLink size={12} className="ml-1" />
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
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
    manualPagination: true,
  });

  // Skeleton table rows
  const skeletonRows = Array(10)
    .fill(0)
    .map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {Array(columns.length)
          .fill(0)
          .map((_, cellIndex) => (
            <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </TableCell>
          ))}
      </TableRow>
    ));

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex space-x-2">
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or UID..."
            className="max-w-md"
            startContent={<Search size={18} />}
            isClearable
            onClear={() => {
              setSearchValue("");
              onSearch("");
            }}
          />
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
            {isLoading ? (
              skeletonRows
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  <div className="flex flex-col items-center gap-2">
                    {searchValue ? (
                      <>
                        <p className="text-lg font-medium">
                          No candidates found matching "{searchValue}"
                        </p>
                        <Button
                          onClick={() => {
                            setSearchValue("");
                            onSearch("");
                          }}
                          color="secondary"
                          size="sm"
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium">
                          No candidates available
                        </p>
                        <Button onClick={onRetry} color="primary" size="sm">
                          Retry Loading
                        </Button>
                      </>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      If this issue persists, please contact support.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
