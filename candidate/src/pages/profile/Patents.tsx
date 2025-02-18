import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useState } from "react";
import { Plus, Edit2, Trash2, Award } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Candidate, Patent } from "@shared-types/Candidate";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";

const patentOffices = [
  { label: "USPTO", value: "USPTO" },
  { label: "EPO", value: "EPO" },
  { label: "JPO", value: "JPO" },
];

const patentStatuses = [
  { label: "Pending", value: "pending" },
  { label: "Granted", value: "granted" },
  { label: "Rejected", value: "rejected" },
];

const Patents = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPatent, setEditingPatent] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof Patent, string>>
  >({});

  // Form States
  const [title, setTitle] = useState("");
  const [patentOffice, setPatentOffice] = useState("");
  const [patentNumber, setPatentNumber] = useState("");
  const [status, setStatus] = useState<"pending" | "granted" | "rejected">(
    "pending"
  );
  const [filingDate, setFilingDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [issueDate, setIssueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "filingDate" | "issueDate"
  ) => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (field === "filingDate") {
      setFilingDate(dateObj);
    } else {
      setIssueDate(dateObj);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof Patent, string>> = {};

    if (!title) errors.title = "Title is required";
    if (!patentOffice) errors.patentOffice = "Patent office is required";
    if (!patentNumber) errors.patentNumber = "Patent number is required";
    if (!status) errors.status = "Status is required";
    if (!description) errors.description = "Description is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    setEditingPatent(null);
    setValidationErrors({});
    resetFormFields();
    onOpen();
  };

  const resetFormFields = () => {
    setTitle("");
    setPatentOffice("");
    setPatentNumber("");
    setStatus("pending");
    setFilingDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setIssueDate(undefined);
    setDescription("");
  };

  const handleEdit = (patent: Patent) => {
    setEditingPatent(patent._id || null);
    setTitle(patent.title);
    setPatentOffice(patent.patentOffice);
    setPatentNumber(patent.patentNumber);
    setStatus(patent.status);
    setFilingDate(
      patent.filingDate instanceof Date
        ? patent.filingDate
        : new Date(patent.filingDate)
    );
    setIssueDate(
      patent.issueDate
        ? patent.issueDate instanceof Date
          ? patent.issueDate
          : new Date(patent.issueDate)
        : undefined
    );
    setDescription(patent.description);
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.patents) return;

    const newPatents = user.patents.filter((p) => p._id !== id);
    setUser({ ...user, patents: newPatents });
    toast.success("Patent deleted successfully");
  };

  const handleSave = () => {
    if (!validateForm()) return;

    let newPatents: Patent[] = [];

    const preparedData: Patent = {
      title,
      patentOffice,
      patentNumber,
      status,
      filingDate,
      issueDate,
      description,
    };

    if (editingPatent) {
      newPatents = (user?.patents || []).map((p) =>
        p._id === editingPatent ? { ...preparedData, _id: p._id } : p
      );
    } else {
      const newPatent: Patent = {
        ...preparedData,
        filingDate: new Date(preparedData.filingDate),
        issueDate: preparedData.issueDate
          ? new Date(preparedData.issueDate)
          : undefined,
        createdAt: new Date(),
      };
      newPatents = [...(user?.patents || []), newPatent];
    }

    // Sort patents by filing date, newest first
    newPatents.sort(
      (a, b) =>
        new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime()
    );

    setUser({
      ...user,
      patents: newPatents,
    });

    toast.success(
      editingPatent
        ? "Patent updated successfully"
        : "Patent added successfully"
    );
    closeAndReset();
  };

  const closeAndReset = () => {
    setEditingPatent(null);
    setValidationErrors({});
    resetFormFields();
    onClose();
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/patents">Patents</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-end items-center">
        <Button
          variant="flat"
          onClick={handleAdd}
          startContent={<Plus size={18} />}
        >
          Add New Patent
        </Button>
      </div>

      <div className="space-y-6">
        {!user.patents?.length ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center gap-4 p-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Award size={50} />
            </motion.div>

            <h3 className="text-xl mt-3">No Patents Added Yet</h3>
            <p className="text-gray-500">Start by adding your first patent!</p>
            <Button onClick={handleAdd} startContent={<Plus size={18} />}>
              Add new
            </Button>
          </motion.div>
        ) : (
          <Table aria-label="Patents table">
            <TableHeader>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>PATENT OFFICE</TableColumn>
              <TableColumn>APPLICATION NUMBER</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>FILING DATE</TableColumn>
              <TableColumn>ISSUE DATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {user.patents.map((patent) => (
                <TableRow key={patent._id}>
                  <TableCell>{patent.title}</TableCell>
                  <TableCell>{patent.patentOffice}</TableCell>
                  <TableCell>{patent.patentNumber}</TableCell>
                  <TableCell className="capitalize">{patent.status}</TableCell>
                  <TableCell>
                    {formatDate(
                      patent.filingDate instanceof Date
                        ? patent.filingDate
                        : new Date(patent.filingDate)
                    )}
                  </TableCell>
                  <TableCell>
                    {patent.issueDate
                      ? formatDate(
                          patent.issueDate instanceof Date
                            ? patent.issueDate
                            : new Date(patent.issueDate)
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleEdit(patent)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={() => patent._id && handleDelete(patent._id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeAndReset} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingPatent ? "Edit Patent" : "Add New Patent"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    placeholder="Enter patent title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isRequired
                    isInvalid={!!validationErrors.title}
                    errorMessage={validationErrors.title}
                    className="col-span-2"
                  />
                  <Select
                    label="Patent Office"
                    placeholder="Select patent office"
                    selectedKeys={[patentOffice]}
                    onSelectionChange={(keys) =>
                      setPatentOffice(keys.currentKey as string)
                    }
                    isRequired
                    isInvalid={!!validationErrors.patentOffice}
                    errorMessage={validationErrors.patentOffice}
                  >
                    {patentOffices.map((office) => (
                      <SelectItem key={office.value} value={office.value}>
                        {office.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Patent Number"
                    placeholder="Enter patent number"
                    value={patentNumber}
                    onChange={(e) => setPatentNumber(e.target.value)}
                    isRequired
                    isInvalid={!!validationErrors.patentNumber}
                    errorMessage={validationErrors.patentNumber}
                  />
                  <Select
                    label="Status"
                    placeholder="Select patent status"
                    selectedKeys={[status]}
                    onSelectionChange={(keys) =>
                      setStatus(
                        keys.currentKey as "pending" | "granted" | "rejected"
                      )
                    }
                    isRequired
                    isInvalid={!!validationErrors.status}
                    errorMessage={validationErrors.status}
                  >
                    {patentStatuses.map((stat) => (
                      <SelectItem key={stat.value} value={stat.value}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <DatePicker
                    className="max-w-xs"
                    label="Filing Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(filingDate.toISOString())}
                    onChange={(date) => handleDateChange(date, "filingDate")}
                  />
                  <DatePicker
                    className="max-w-xs"
                    label="Issue Date (mm/dd/yyyy)"
                    granularity="day"
                    value={
                      issueDate
                        ? parseAbsoluteToLocal(issueDate.toISOString())
                        : undefined
                    }
                    onChange={(date) => handleDateChange(date, "issueDate")}
                    maxValue={today(getLocalTimeZone())}
                    isDisabled={status === "pending"}
                  />
                  <p className="text-xs">Time Zone: {getLocalTimeZone()}</p>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Enter patent description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isRequired
                  isInvalid={!!validationErrors.description}
                  errorMessage={validationErrors.description}
                  className="mt-4"
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Patents;
