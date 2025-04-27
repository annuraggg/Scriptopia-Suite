import {
  BreadcrumbItem,
  Breadcrumbs,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Textarea,
  Card,
  CardBody,
  Chip,
  DatePicker,
  Divider,
  Tooltip,
  Skeleton,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Award,
  Calendar,
  Building,
  Briefcase,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useOutletContext } from "react-router-dom";
import { Candidate, Responsibility } from "@shared-types/Candidate";
import { toast } from "sonner";
import { z } from "zod";

// Define schema for validation with improved error messages
const responsibilitySchema = z
  .object({
    title: z
      .string()
      .min(1, "Position title is required")
      .max(100, "Title is too long"),
    organization: z
      .string()
      .min(1, "Organization name is required")
      .max(100, "Organization name is too long"),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Invalid date format",
    }),
    current: z.boolean(),
    endDate: z
      .date({
        invalid_type_error: "Invalid date format",
      })
      .optional()
      .nullable(),
    description: z
      .string()
      .min(10, "Description should be at least 10 characters")
      .max(1000, "Description is too long"),
  })
  .refine(
    (data) => {
      // If not current, end date is required
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required when not a current position",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Ensure end date is after start date
      if (data.endDate && data.startDate > data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );

export default function Responsibilities() {
  const [editingResponsibility, setEditingResponsibility] = useState<
    string | null
  >(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    current: false,
    endDate: null as Date | null,
    description: "",
  });

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();

  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  // Ensure responsibilities array exists
  useEffect(() => {
    if (!user.responsibilities) {
      setUser({ ...user, responsibilities: [] });
    }
  }, [user, setUser]);

  useEffect(() => {
    // Reset form validation on modal close
    if (!isOpen) {
      setValidationErrors({});
    }
  }, [isOpen]);

  const handleAdd = () => {
    setEditingResponsibility(null);
    resetForm();
    onOpen();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      current: false,
      endDate: null,
      description: "",
    });
    setValidationErrors({});
  };

  const handleEdit = (responsibility: Responsibility) => {
    try {
      setEditingResponsibility(responsibility?._id || null);
      setFormData({
        title: responsibility.title,
        organization: responsibility.organization,
        startDate: new Date(responsibility.startDate),
        current: responsibility.current,
        endDate: responsibility.endDate
          ? new Date(responsibility.endDate)
          : null,
        description: responsibility.description || "",
      });
      setValidationErrors({});
      onOpen();
    } catch (error) {
      console.error("Error editing responsibility:", error);
      toast.error("Could not edit this position. Invalid data format.");
    }
  };

  const confirmDeletePosition = (id: string) => {
    setConfirmDelete(id);
    deleteModal.onOpen();
  };

  const handleDelete = () => {
    if (!confirmDelete || !user.responsibilities) return;
    setIsSubmitting(true);

    try {
      const newResponsibilities = user.responsibilities.filter(
        (resp) => resp._id !== confirmDelete
      );
      setUser({ ...user, responsibilities: newResponsibilities });
      toast.success("Position deleted successfully");
    } catch (error) {
      toast.error("Failed to delete position");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setConfirmDelete(null);
      deleteModal.onClose();
    }
  };

  const validateForm = (): boolean => {
    try {
      // Validate with zod schema
      responsibilitySchema.parse(formData);

      // Clear validation errors if all is good
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    setFormData((prev) => ({
      ...prev,
      [field]: dateObj,
    }));

    // Clear errors for this field
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }

    // Additional validations
    if (field === "startDate" && formData.endDate && !formData.current) {
      if (dateObj > formData.endDate) {
        setValidationErrors((prev) => ({
          ...prev,
          startDate: "Start date cannot be after end date",
        }));
      }
    } else if (field === "endDate" && dateObj < formData.startDate) {
      setValidationErrors((prev) => ({
        ...prev,
        endDate: "End date cannot be before start date",
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Find the first error to show in toast
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      let newResponsibilities: Responsibility[] = [];

      const preparedData: Responsibility = {
        title: formData.title,
        organization: formData.organization,
        startDate: formData.startDate,
        current: formData.current,
        endDate: formData.current ? undefined : formData.endDate || undefined,
        description: formData.description,
      };

      if (editingResponsibility) {
        // Make sure the edited responsibility still exists
        const responsibilityExists = (user.responsibilities || []).some(
          (resp) => resp._id === editingResponsibility
        );

        if (!responsibilityExists) {
          throw new Error("Position to edit not found");
        }

        newResponsibilities = (user.responsibilities || []).map((resp) =>
          resp._id === editingResponsibility
            ? { ...preparedData, _id: resp._id, createdAt: resp.createdAt }
            : resp
        );
        toast.success("Position updated successfully");
      } else {
        const newResp: Responsibility = {
          ...preparedData,
          createdAt: new Date(),
        };
        newResponsibilities = [...(user?.responsibilities || []), newResp];
        toast.success("Position added successfully");
      }

      // Sort by most recent first
      newResponsibilities.sort((a, b) => {
        // Current positions first
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        // Then by start date (most recent first)
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });

      setUser({
        ...user,
        responsibilities: newResponsibilities,
      });

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save position"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch (e) {
      console.error("Invalid date format", e);
      return "Invalid date";
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }

    // Special handling for current checkbox
    if (field === "current" && value === true) {
      // Clear end date errors when setting to current
      if (validationErrors.endDate) {
        const newErrors = { ...validationErrors };
        delete newErrors.endDate;
        setValidationErrors(newErrors);
      }
    }
  };

  // Get organization avatar initials
  const getOrganizationInitials = (name: string): string => {
    if (!name) return "?";

    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return name.charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div>
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/responsibilities">
          Positions & Responsibilities
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Positions of Responsibility
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Showcase your leadership roles and organizational responsibilities
          </p>
        </div>
        <Button
          color="primary"
          onClick={handleAdd}
          startContent={<Plus size={18} />}
        >
          Add Position
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loader for loading state
          <div className="space-y-4">
            <Skeleton className="w-full h-32 rounded-lg" />
            <Skeleton className="w-full h-32 rounded-lg" />
          </div>
        ) : !user.responsibilities?.length ? (
          <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
            <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="bg-primary-50 p-5 rounded-full">
                <Award size={36} className="text-primary" />
              </div>
              <div className="text-center max-w-lg">
                <h3 className="text-xl font-medium mb-2">
                  No Positions Added Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Leadership positions and responsibilities demonstrate your
                  management skills, accountability, and ability to take
                  initiative. Add positions like club president, team leader,
                  event coordinator, or committee member.
                </p>
                <Button
                  color="primary"
                  onClick={handleAdd}
                  startContent={<Plus size={18} />}
                  size="lg"
                >
                  Add Your First Position
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            {user.responsibilities.map((responsibility) => (
              <Card key={responsibility._id} className="w-full shadow-sm">
                <CardBody className="p-5">
                  <div className="flex items-start w-full gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary shrink-0 font-medium">
                      {getOrganizationInitials(responsibility.organization)}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">
                            {responsibility.title}
                          </h3>
                          {responsibility.current && (
                            <Chip
                              color="success"
                              variant="flat"
                              startContent={<Clock size={12} />}
                            >
                              Current
                            </Chip>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Building size={14} className="text-gray-400" />
                          <p className="text-sm">
                            {responsibility.organization}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Calendar size={14} className="text-gray-400" />
                          <p className="text-sm">
                            {formatDate(responsibility.startDate)} -{" "}
                            {responsibility.current
                              ? "Present"
                              : responsibility.endDate
                              ? formatDate(responsibility.endDate)
                              : ""}
                          </p>
                        </div>

                        {responsibility.description && (
                          <>
                            <Divider className="my-3" />
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {responsibility.description}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2 self-start">
                        <Tooltip content="Edit position">
                          <Button
                            isIconOnly
                            variant="light"
                            onClick={() => handleEdit(responsibility)}
                            aria-label="Edit position"
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete position" color="danger">
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onClick={() =>
                              responsibility._id &&
                              confirmDeletePosition(responsibility._id)
                            }
                            aria-label="Delete position"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        )}
      </div>
      {/* Add/Edit Position Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => !isSubmitting && onClose()}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  <h3 className="text-lg">
                    {editingResponsibility
                      ? "Edit Position"
                      : "Add New Position"}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  {editingResponsibility
                    ? "Update details about your leadership role or responsibility"
                    : "Share information about a position of responsibility you've held"}
                </p>
              </ModalHeader>

              <ModalBody className="py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Position Title"
                    placeholder="E.g. Club President, Team Leader, Committee Head"
                    isRequired
                    isInvalid={!!validationErrors.title}
                    errorMessage={validationErrors.title}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    startContent={
                      <Briefcase size={16} className="text-gray-400" />
                    }
                    description="Your role or position in the organization"
                    isDisabled={isSubmitting}
                  />

                  <Input
                    label="Organization"
                    placeholder="E.g. Student Council, IEEE, Red Cross"
                    isRequired
                    isInvalid={!!validationErrors.organization}
                    errorMessage={validationErrors.organization}
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    startContent={
                      <Building size={16} className="text-gray-400" />
                    }
                    description="Name of the organization or group"
                    isDisabled={isSubmitting}
                  />

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Start Date"
                      isInvalid={!!validationErrors.startDate}
                      errorMessage={validationErrors.startDate}
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(
                        formData.startDate.toISOString()
                      )}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      isDisabled={isSubmitting}
                      hideTimeZone
                      granularity="day"
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      When you began this position
                    </p>
                  </div>

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      End Date{" "}
                      {!formData.current && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <DatePicker
                      aria-label="End Date"
                      isInvalid={!!validationErrors.endDate}
                      errorMessage={validationErrors.endDate}
                      value={
                        formData.endDate
                          ? parseAbsoluteToLocal(formData.endDate.toISOString())
                          : undefined
                      }
                      onChange={(date) => handleDateChange(date, "endDate")}
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={formData.current || isSubmitting}
                      hideTimeZone
                      granularity="day"
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      {formData.current
                        ? "Not required for current positions"
                        : "When you completed this position"}
                    </p>
                  </div>

                  <div className="col-span-2 mt-1">
                    <Checkbox
                      isSelected={formData.current}
                      onValueChange={(value) =>
                        handleInputChange("current", value)
                      }
                      isDisabled={isSubmitting}
                    >
                      I currently hold this position
                    </Checkbox>
                  </div>
                </div>

                <Textarea
                  label="Description"
                  placeholder="Describe your responsibilities, achievements, and impact in this role. You can use bullet points for better readability."
                  className="mt-4"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  minRows={4}
                  maxRows={8}
                  isRequired
                  isInvalid={!!validationErrors.description}
                  errorMessage={validationErrors.description}
                  isDisabled={isSubmitting}
                  description="Provide details about what you did and accomplished in this role"
                />

                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Consider using bullet points by starting lines with • or -
                    for better readability
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.description.length}/1000 characters
                  </p>
                </div>
              </ModalBody>

              <ModalFooter className="border-t">
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
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
                  {editingResponsibility ? "Update" : "Save"}
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
                    Are you sure you want to delete this position? This action
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
}
