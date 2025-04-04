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
  Badge,
  Card,
  CardBody,
  Tooltip,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FileCheck,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
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
import { z } from "zod";

// Patent schema for form validation
const patentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  patentOffice: z.string().min(1, "Patent office is required"),
  patentNumber: z.string().min(1, "Patent number is required"),
  status: z.enum(["pending", "granted", "rejected"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
  filingDate: z.date({ required_error: "Filing date is required" }),
  issueDate: z.date().optional(),
  description: z.string().min(1, "Description is required"),
});

type PatentFormData = z.infer<typeof patentSchema>;

// Define dropdown options
const patentOffices = [
  {
    label: "USPTO - United States Patent and Trademark Office",
    value: "USPTO",
  },
  { label: "EPO - European Patent Office", value: "EPO" },
  { label: "JPO - Japan Patent Office", value: "JPO" },
  {
    label: "CNIPA - China National Intellectual Property Administration",
    value: "CNIPA",
  },
  { label: "IPO - Indian Patent Office", value: "IPO" },
  { label: "UKIPO - UK Intellectual Property Office", value: "UKIPO" },
  { label: "CIPO - Canadian Intellectual Property Office", value: "CIPO" },
  { label: "IP Australia", value: "IP Australia" },
  { label: "KIPO - Korean Intellectual Property Office", value: "KIPO" },
  { label: "Other", value: "Other" },
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

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();
  const [editingPatent, setEditingPatent] = useState<string | null>(null);
  const [patentToDelete, setPatentToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PatentFormData, string>>
  >({});

  // Form state
  const [formData, setFormData] = useState<PatentFormData>({
    title: "",
    patentOffice: "",
    patentNumber: "",
    status: "pending",
    filingDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    issueDate: undefined,
    description: "",
  });

  // Create initial empty state to avoid null references
  useEffect(() => {
    if (!user.patents) {
      setUser({ ...user, patents: [] });
    }
  }, [user, setUser]);

  // Format date for display
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "—";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle date picker change
  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "filingDate" | "issueDate"
  ) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setFormData((prev) => ({ ...prev, [field]: dateObj }));
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof PatentFormData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      patentOffice: "",
      patentNumber: "",
      status: "pending",
      filingDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      issueDate: undefined,
      description: "",
    });
    setErrors({});
    setEditingPatent(null);
  };

  // Handle form submission
  const validateForm = (): boolean => {
    try {
      // Special handling for issue date based on status
      if (formData.status === "granted" && !formData.issueDate) {
        setErrors({ issueDate: "Issue date is required for granted patents" });
        return false;
      }

      patentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof PatentFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof PatentFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle adding a new patent
  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  // Handle editing an existing patent
  const handleEdit = (patent: Patent) => {
    const editData: PatentFormData = {
      title: patent.title,
      patentOffice: patent.patentOffice,
      patentNumber: patent.patentNumber,
      status: patent.status,
      filingDate:
        patent.filingDate instanceof Date
          ? patent.filingDate
          : new Date(patent.filingDate),
      issueDate: patent.issueDate
        ? patent.issueDate instanceof Date
          ? patent.issueDate
          : new Date(patent.issueDate)
        : undefined,
      description: patent.description,
    };

    setFormData(editData);
    setEditingPatent(patent._id || null);
    setErrors({});
    onOpen();
  };

  // Confirm patent deletion
  const confirmDelete = (id: string) => {
    setPatentToDelete(id);
    deleteModal.onOpen();
  };

  // Delete a patent
  const handleDelete = () => {
    if (!patentToDelete || !user.patents) return;

    const newPatents = user.patents.filter((p) => p._id !== patentToDelete);
    setUser({ ...user, patents: newPatents });
    toast.success("Patent deleted successfully");
    deleteModal.onClose();
    setPatentToDelete(null);
  };

  // Save new or updated patent
  const handleSave = () => {
    if (!validateForm()) return;

    // Process form data for saving
    try {
      let newPatents: Patent[] = [];

      // Create patent object
      const patentData: Patent = {
        ...formData,
        // Ensure dates are Date objects
        filingDate: new Date(formData.filingDate),
        issueDate: formData.issueDate
          ? new Date(formData.issueDate)
          : undefined,
      };

      if (editingPatent) {
        // Update existing patent
        newPatents = (user?.patents || []).map((p) =>
          p._id === editingPatent ? { ...patentData, _id: p._id } : p
        );
      } else {
        // Add new patent with creation timestamp
        const newPatent: Patent = {
          ...patentData,
          _id: `patent_${Date.now()}`, // Generate temporary ID
          createdAt: new Date(),
        };
        newPatents = [...(user?.patents || []), newPatent];
      }

      // Sort patents by filing date (newest first)
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

      onClose();
      resetForm();
    } catch (error) {
      toast.error("An error occurred while saving the patent");
      console.error("Error saving patent:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "granted":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header section */}
      <div className="mb-8">
        <Breadcrumbs size="sm" className="mb-4">
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Patents</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-semibold">Patents</h1>
            <p className="text-gray-500 text-sm">
              Manage your patent portfolio
            </p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus size={18} />}
            onClick={handleAdd}
          >
            Add Patent
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!user.patents?.length ? (
        <Card className="w-full py-8">
          <CardBody className="flex flex-col items-center justify-center gap-4">
            <FileCheck size={40} className="text-gray-400" />
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">No Patents Added</h3>
              <p className="text-gray-500 mb-4">
                Your patent portfolio is currently empty. Add your patents to
                showcase your intellectual property.
              </p>
              <Button
                color="primary"
                onClick={handleAdd}
                startContent={<Plus size={18} />}
              >
                Add Patent
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        /* Patent table */
        <Card shadow="sm">
          <Table
            aria-label="Patents table"
            removeWrapper
            classNames={{
              th: "bg-default-50",
            }}
          >
            <TableHeader>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>PATENT INFO</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATES</TableColumn>
              <TableColumn align="end">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {user.patents.map((patent) => (
                <TableRow key={patent._id}>
                  <TableCell>
                    <div className="font-medium line-clamp-2">
                      {patent.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {patent.patentOffice}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{patent.patentNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={getStatusColor(patent.status)}
                      variant="flat"
                      className="capitalize"
                    >
                      {patent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Filed:</span>
                        <span>{formatDate(patent.filingDate)}</span>
                      </div>
                      {patent.status === "granted" && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Issued:</span>
                          <span>{formatDate(patent.issueDate)}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Tooltip content="Edit patent">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onClick={() => handleEdit(patent)}
                        >
                          <Edit2 size={18} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete patent" color="danger">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() =>
                            patent._id && confirmDelete(patent._id)
                          }
                        >
                          <Trash2 size={18} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Add/Edit Patent Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h3>{editingPatent ? "Edit Patent" : "Add New Patent"}</h3>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Patent Title"
                    placeholder="Enter the full patent title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    className="col-span-1 md:col-span-2"
                  />

                  <Select
                    label="Patent Office"
                    placeholder="Select the patent office"
                    selectedKeys={
                      formData.patentOffice ? [formData.patentOffice] : []
                    }
                    onSelectionChange={(keys) =>
                      handleInputChange(
                        "patentOffice",
                        keys.currentKey as string
                      )
                    }
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.patentOffice}
                    errorMessage={errors.patentOffice}
                  >
                    {patentOffices.map((office) => (
                      <SelectItem key={office.value} value={office.value}>
                        {office.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Patent/Application Number"
                    placeholder="Enter the patent number"
                    value={formData.patentNumber}
                    onChange={(e) =>
                      handleInputChange("patentNumber", e.target.value)
                    }
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.patentNumber}
                    errorMessage={errors.patentNumber}
                    startContent={
                      <Tooltip content="This is the reference number assigned by the patent office">
                        <HelpCircle size={16} className="text-gray-400" />
                      </Tooltip>
                    }
                  />

                  <Select
                    label="Status"
                    placeholder="Select current status"
                    selectedKeys={[formData.status]}
                    onSelectionChange={(keys) =>
                      handleInputChange(
                        "status",
                        keys.currentKey as "pending" | "granted" | "rejected"
                      )
                    }
                    variant="bordered"
                    isRequired
                    isInvalid={!!errors.status}
                    errorMessage={errors.status}
                  >
                    {patentStatuses.map((stat) => (
                      <SelectItem key={stat.value} value={stat.value}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <div>
                    <DatePicker
                      label="Filing Date"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(
                        formData.filingDate.toISOString()
                      )}
                      onChange={(date) => handleDateChange(date, "filingDate")}
                      isRequired
                      isInvalid={!!errors.filingDate}
                      errorMessage={errors.filingDate}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <DatePicker
                      label="Issue Date"
                      granularity="day"
                      value={
                        formData.issueDate
                          ? parseAbsoluteToLocal(
                              formData.issueDate.toISOString()
                            )
                          : undefined
                      }
                      onChange={(date) => handleDateChange(date, "issueDate")}
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={formData.status !== "granted"}
                      isInvalid={!!errors.issueDate}
                      errorMessage={errors.issueDate}
                      className="w-full"
                      startContent={
                        formData.status === "granted" ? (
                          <AlertCircle size={16} className="text-warning" />
                        ) : null
                      }
                    />
                    {formData.status === "granted" && !formData.issueDate && (
                      <span className="text-xs text-warning">
                        Required for granted patents
                      </span>
                    )}
                  </div>
                </div>

                <Textarea
                  label="Description"
                  placeholder="Enter a brief description of the patent and its significance"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  variant="bordered"
                  isRequired
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  className="mt-4"
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  {editingPatent ? "Update Patent" : "Save Patent"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this patent? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={deleteModal.onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Delete
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
