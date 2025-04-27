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
  CardHeader,
  Tooltip,
  Divider,
  Chip,
  Skeleton,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
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
import { DatePicker } from "@heroui/react";
import { z } from "zod";

// Patent schema for form validation with improved error messages
const patentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Patent title is required")
      .max(200, "Patent title is too long"),
    patentOffice: z
      .string()
      .min(1, "Patent office is required")
      .max(100, "Patent office name is too long"),
    patentNumber: z
      .string()
      .min(1, "Patent/application number is required")
      .max(50, "Patent number is too long"),
    status: z.enum(["pending", "granted", "rejected"], {
      errorMap: () => ({ message: "Please select a valid status" }),
    }),
    filingDate: z
      .date({
        required_error: "Filing date is required",
        invalid_type_error: "Please enter a valid filing date",
      })
      .max(new Date(), "Filing date cannot be in the future"),
    issueDate: z.date().optional().nullable(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description is too long"),
  })
  .refine(
    (data) => {
      // If status is granted, issue date is required
      if (data.status === "granted" && !data.issueDate) {
        return false;
      }
      return true;
    },
    {
      message: "Issue date is required for granted patents",
      path: ["issueDate"],
    }
  )
  .refine(
    (data) => {
      // If both dates exist, ensure issue date is after filing date
      if (data.issueDate && data.filingDate > data.issueDate) {
        return false;
      }
      return true;
    },
    {
      message: "Issue date must be after filing date",
      path: ["issueDate"],
    }
  );

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
  {
    label: "Pending",
    value: "pending",
    icon: <Clock size={14} className="text-warning" />,
  },
  {
    label: "Granted",
    value: "granted",
    icon: <CheckCircle2 size={14} className="text-success" />,
  },
  {
    label: "Rejected",
    value: "rejected",
    icon: <XCircle size={14} className="text-danger" />,
  },
];

const Patents = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();
  const [editingPatent, setEditingPatent] = useState<string | null>(null);
  const [patentToDelete, setPatentToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PatentFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<PatentFormData>({
    title: "",
    patentOffice: "",
    patentNumber: "",
    status: "pending",
    filingDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    issueDate: null,
    description: "",
  });

  // Create initial empty state to avoid null references
  useEffect(() => {
    if (!user.patents) {
      setUser({ ...user, patents: [] });
    }
  }, [user, setUser]);

  // Format date for display
  const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return "—";
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Handle date picker change
  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "filingDate" | "issueDate"
  ) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setFormData((prev) => ({ ...prev, [field]: dateObj }));

    // Clear validation errors for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Additional validation for date relationships
    if (field === "issueDate" && formData.filingDate > dateObj) {
      setErrors((prev) => ({
        ...prev,
        issueDate: "Issue date must be after filing date",
      }));
    } else if (
      field === "filingDate" &&
      formData.issueDate &&
      dateObj > formData.issueDate
    ) {
      setErrors((prev) => ({
        ...prev,
        filingDate: "Filing date must be before issue date",
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof PatentFormData,
    value: string | Date | undefined | null
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

    // Special handling for status changes
    if (field === "status") {
      if (value !== "granted" && errors.issueDate) {
        setErrors((prev) => {
          const { issueDate, ...rest } = prev;
          return rest;
        });
      }

      // If changing to granted and no issue date, add warning
      if (value === "granted" && !formData.issueDate) {
        setErrors((prev) => ({
          ...prev,
          issueDate: "Issue date is required for granted patents",
        }));
      }
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
      issueDate: null,
      description: "",
    });
    setErrors({});
    setEditingPatent(null);
  };

  // Handle form submission
  const validateForm = (): boolean => {
    try {
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
    try {
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
          : null,
        description: patent.description,
      };

      setFormData(editData);
      setEditingPatent(patent._id || null);
      setErrors({});
      onOpen();
    } catch (error) {
      console.error("Error editing patent:", error);
      toast.error("Could not edit patent. Invalid data format.");
    }
  };

  // Confirm patent deletion
  const confirmDelete = (id: string) => {
    setPatentToDelete(id);
    deleteModal.onOpen();
  };

  // Delete a patent
  const handleDelete = () => {
    if (!patentToDelete || !user.patents) return;
    setIsSubmitting(true);

    try {
      const newPatents = user.patents.filter((p) => p._id !== patentToDelete);
      setUser({ ...user, patents: newPatents });
      toast.success("Patent deleted successfully");
    } catch (error) {
      toast.error("Failed to delete patent");
      console.error("Error deleting patent:", error);
    } finally {
      deleteModal.onClose();
      setPatentToDelete(null);
      setIsSubmitting(false);
    }
  };

  // Save new or updated patent
  const handleSave = () => {
    if (!validateForm()) {
      // Find the first error and show a toast
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "granted":
        return <CheckCircle2 size={16} className="text-success" />;
      case "pending":
        return <Clock size={16} className="text-warning" />;
      case "rejected":
        return <XCircle size={16} className="text-danger" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header section */}
      <div className="mb-6">
        <Breadcrumbs className="mb-4">
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Patents</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Patents & Intellectual Property
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Document your innovations and intellectual property
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onClick={handleAdd}
          >
            Add Patent
          </Button>
        </div>
      </div>
      {isLoading ? (
        // Skeleton loader for loading state
        <div className="space-y-4">
          <Skeleton className="w-full h-32 rounded-lg" />
          <Skeleton className="w-full h-32 rounded-lg" />
        </div>
      ) : !user.patents?.length ? (
        <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
          <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="bg-primary-50 p-5 rounded-full">
              <Award size={36} className="text-primary" />
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-medium mb-2">No Patents Added Yet</h3>
              <p className="text-gray-600 mb-6">
                Patents demonstrate your innovative contributions and
                intellectual property. Add information about patents you've
                filed, been granted, or are pending.
              </p>
              <Button
                color="primary"
                onClick={handleAdd}
                startContent={<PlusCircle size={18} />}
                size="lg"
              >
                Add Your First Patent
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        /* Patent card with table */
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-primary" />
              <h2 className="text-lg font-medium">Your Patents</h2>
              <Chip variant="flat">{user.patents.length}</Chip>
            </div>
          </CardHeader>
          <Divider />
          <Table aria-label="Patents table" removeWrapper>
            <TableHeader>
              <TableColumn>TITLE & DESCRIPTION</TableColumn>
              <TableColumn>PATENT INFO</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATES</TableColumn>
              <TableColumn align="end">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {user.patents.map((patent) => (
                <TableRow key={patent._id} className="border-b">
                  <TableCell>
                    <div className="font-medium mb-1 max-w-xs">
                      {patent.title}
                    </div>
                    {patent.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {patent.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {patent.patentOffice}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <BookOpen size={14} className="text-gray-400" />
                        {patent.patentNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={getStatusColor(patent.status)}
                      variant="flat"
                      className="flex items-center capitalize"
                    >
                      {getStatusIcon(patent.status)}
                      <p className="ml-2">{patent.status}</p>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm gap-1">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500">Filed:</span>
                        <span className="text-xs">
                          {formatDate(patent.filingDate)}
                        </span>
                      </div>
                      {patent.status === "granted" && patent.issueDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-success" />
                          <span className="text-xs text-gray-500">Issued:</span>
                          <span className="text-xs">
                            {formatDate(patent.issueDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Tooltip content="Edit patent">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(patent)}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete patent" color="danger">
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onClick={() =>
                            patent._id && confirmDelete(patent._id)
                          }
                        >
                          <Trash2 size={16} />
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
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => {
          if (!isSubmitting) {
            resetForm();
            onClose();
          }
        }}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  <h3 className="text-lg">
                    {editingPatent ? "Edit Patent" : "Add New Patent"}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  {editingPatent
                    ? "Update details of your patent or intellectual property"
                    : "Add information about your patent or intellectual property"}
                </p>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Patent Title"
                    placeholder="Enter the full patent title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    className="col-span-1 md:col-span-2"
                    description="Full title as it appears on the patent application"
                    isDisabled={isSubmitting}
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
                    isRequired
                    isInvalid={!!errors.patentOffice}
                    errorMessage={errors.patentOffice}
                    description="Organization where the patent was filed"
                    isDisabled={isSubmitting}
                  >
                    {patentOffices.map((office) => (
                      <SelectItem key={office.value}>{office.label}</SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Patent/Application Number"
                    placeholder="Enter the patent number"
                    value={formData.patentNumber}
                    onChange={(e) =>
                      handleInputChange("patentNumber", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.patentNumber}
                    errorMessage={errors.patentNumber}
                    description="Reference number assigned by the patent office"
                    isDisabled={isSubmitting}
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
                    labelPlacement="outside"
                    isRequired
                    isInvalid={!!errors.status}
                    errorMessage={errors.status}
                    description="Current status of your patent application"
                    isDisabled={isSubmitting}
                  >
                    {patentStatuses.map((stat) => (
                      <SelectItem key={stat.value} startContent={stat.icon}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Filing Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Filing Date"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(
                        formData.filingDate.toISOString()
                      )}
                      onChange={(date) => handleDateChange(date, "filingDate")}
                      isInvalid={!!errors.filingDate}
                      errorMessage={errors.filingDate}
                      className="w-full"
                      isDisabled={isSubmitting}
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      Date when the patent was filed
                    </p>
                  </div>

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Issue Date{" "}
                      {formData.status === "granted" && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <DatePicker
                      aria-label="Issue Date"
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
                      isDisabled={formData.status !== "granted" || isSubmitting}
                      isInvalid={!!errors.issueDate}
                      errorMessage={errors.issueDate}
                      className="w-full"
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      {formData.status === "granted"
                        ? "Date when the patent was granted (required)"
                        : "Only applicable for granted patents"}
                    </p>
                  </div>
                </div>

                <Textarea
                  label="Description"
                  placeholder="Enter a brief description of the patent and its significance"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  isRequired
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  className="mt-4"
                  minRows={3}
                  maxRows={5}
                  description="Brief explanation of the patent and its importance"
                  isDisabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    if (!isSubmitting) {
                      resetForm();
                      onClose();
                    }
                  }}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  {editingPatent ? "Update Patent" : "Save Patent"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={deleteModal.isOpen}
        onClose={() => !isSubmitting && deleteModal.onClose()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b">
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this patent? This action
                    cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  variant="light"
                  onPress={() => !isSubmitting && deleteModal.onClose()}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
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
