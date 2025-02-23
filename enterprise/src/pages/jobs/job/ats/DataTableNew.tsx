import React, { useEffect, useMemo } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Download, UserCheck, UserX, Users } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Posting } from "@shared-types/Posting";
import { IconChevronDown, IconMenu2 } from "@tabler/icons-react";
import { Pagination } from "@heroui/pagination";

export interface CandidateTable {
  _id: string;
  name: string;
  email: string;
  received: string;
  match: string;
  status: string;
}

interface DataTableProps {
  data: CandidateTable[];
  setData: React.Dispatch<React.SetStateAction<CandidateTable[]>>;
}

const rowsPerPage = 7;

const DataTableNew = ({ data: vanillaData }: DataTableProps) => {
  const [selectedRows, setSelectedRows] = useState<Selection>(
    new Set<string>()
  );
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CandidateTable[]>([]);

  useEffect(() => {
    setData(vanillaData);
  }, [vanillaData]);

  const pages = Math.ceil(data.length / rowsPerPage);
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const { posting } = useOutletContext() as { posting: Posting };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  const downloadResume = (_id: string) => {
    axios
      .get(`postings/candidate/${_id}/resume`)
      .then((res) => window.open(res.data.data.url, "_blank"))
      .catch((err) => {
        toast.error(err.response.data.message || "Failed to download resume");
        console.error(err);
      });
  };

  const disqualify = (_id: string) => {
    const newData = [...data] as CandidateTable[];
    const index = newData.findIndex((c) => c._id === _id);
    newData[index].status = "rejected";
    setData(newData);

    axios
      .put("postings/candidate/disqualify", {
        _id: _id,
        postingId: posting?._id,
      })

      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to disqualify candidate"
        );
        console.error(err);

        const newData = [...data] as CandidateTable[];
        const index = newData.findIndex((c) => c._id === _id);
        newData[index].status = "pending";
        setData(newData);
      });
  };

  const selectCand = (_id: string) => {
    const newData = [...data] as CandidateTable[];
    const index = newData.findIndex((c) => c._id === _id);
    newData[index].status = "inprogress ";
    setData(newData);

    axios
      .put("postings/candidate/qualify", {
        _id: _id,
        postingId: posting?._id,
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Failed to select candidate");
        console.error(err);

        const newData = [...data] as CandidateTable[];
        const index = newData.findIndex((c) => c._id === _id);
        newData[index].status = "pending";
        setData(newData);
      });
  };

  const disqualifyAllSelected = () => {
    const selectedIds = Array.from(selectedRows);
    const newData = [...data] as CandidateTable[];
    selectedIds.forEach((id) => {
      const index = newData.findIndex((c) => c._id === id);
      if (index !== -1) {
        newData[index].status = "rejected";
      }
    });
    setData(newData);

    axios
      .put("postings/candidate/disqualify/bulk", {
        candidateIds: selectedIds,
        postingId: posting?._id,
      })
      .then(() => {
        toast.success("Selected candidates disqualified successfully");
      })
      .catch((err) => {
        toast.error(
          err.response.data.message ||
            "Failed to disqualify selected candidates"
        );
        console.error(err);

        // Revert the optimistic update if the API call fails
        const revertedData = [...data] as CandidateTable[];
        selectedIds.forEach((id) => {
          const index = revertedData.findIndex((c) => c._id === id);
          if (index !== -1) {
            revertedData[index].status = "pending"; // or any other original status
          }
        });
        setData(revertedData);
      });
  };

  const qualifyAllSelected = () => {
    const selectedIds = Array.from(selectedRows);

    // Optimistically update the state
    const newData = [...data] as CandidateTable[];
    selectedIds.forEach((id) => {
      const index = newData.findIndex((c) => c._id === id);
      if (index !== -1) {
        newData[index].status = "inprogress";
      }
    });
    setData(newData);

    axios
      .put("postings/candidate/qualify/bulk", {
        candidateIds: selectedIds,
        postingId: posting?._id,
      })
      .then(() => {
        toast.success("Selected candidates qualified successfully");
      })
      .catch((err) => {
        toast.error(
          err.response.data.message || "Failed to qualify selected candidates"
        );
        console.error(err);

        // Revert the optimistic update if the API call fails
        const revertedData = [...data] as CandidateTable[];
        selectedIds.forEach((id) => {
          const index = revertedData.findIndex((c) => c._id === id);
          if (index !== -1) {
            revertedData[index].status = "pending"; // or any other original status
          }
        });
        setData(revertedData);
      });
  };

  const selectAllAboveThreshold = () => {
    const threshold = posting?.ats?.minimumScore || 0;
    const newData = [...data] as CandidateTable[];
    const newSelect = new Set(selectedRows);
    newData.forEach((c) => {
      if (parseInt(c.match) >= threshold) {
        newSelect.add(c._id);
      }
    });
    setSelectedRows(newSelect);
  };

  return (
    <div>
      {" "}
      <div className="flex  items-center gap-5 flex-wrap">
        <Input
          placeholder="Filter emails..."
          className="max-w-sm"
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              setData(vanillaData);
              return;
            }
            const newData = vanillaData.filter((d) => d.email.includes(value));
            setData(newData);
          }}
        />

        <Dropdown>
          <DropdownTrigger>
            <Button endContent={<IconChevronDown size={20} />}>
              Bulk Actions
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" onPress={qualifyAllSelected}>
              Qualify Selected
            </DropdownItem>
            <DropdownItem key="copy" onPress={disqualifyAllSelected}>
              {" "}
              Disqualify Selected
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button onPress={selectAllAboveThreshold}>
          <Users className="mr-2 h-4 w-4" />
          Select All Above {posting?.ats?.minimumScore} %
        </Button>

        <Table
          selectionMode="multiple"
          color="secondary"
          onSelectionChange={setSelectedRows}
          selectedKeys={selectedRows}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Received On</TableColumn>
            <TableColumn>JD Match %</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {items?.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.received}</TableCell>
                <TableCell>{row.match} % </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {row.status.slice(0, 1).toUpperCase() + row.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="light" isIconOnly>
                        <IconMenu2 size={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key={"qualify"}
                        onPress={() => selectCand(row._id)}
                        startContent={<UserCheck size={16} className="mr-2" />}
                        className={row.status === "inprogress" ? "hidden" : ""}
                      >
                        Qualify Candidate
                      </DropdownItem>
                      <DropdownItem
                        key={"disqualify"}
                        onPress={() => disqualify(row._id)}
                        startContent={<UserX size={16} className="mr-2" />}
                        className={row.status === "rejected" ? "hidden" : ""}
                      >
                        Disqualify Candidate
                      </DropdownItem>
                      <DropdownItem
                        key="download"
                        onPress={() => downloadResume(row._id)}
                        startContent={<Download size={16} className="mr-2" />}
                      >
                        Download Resume
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTableNew;
