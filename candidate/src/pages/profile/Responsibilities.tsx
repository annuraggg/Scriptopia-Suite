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
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Award } from "lucide-react";
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

// Define schema for validation
const responsibilitySchema = z.object({
  title: z.string().min(1, "Position title is required"),
  organization: z.string().min(1, "Organization name is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  current: z.boolean(),
  endDate: z.date().optional().nullable(),
  description: z.string().min(1, "Description is required"),
});

// Custom validation to check date logic
const validateDateLogic = (data: z.infer<typeof responsibilitySchema>) => {
  if (!data.current && !data.endDate) {
    throw new Error("End date is required when not a current position");
  }

  if (!data.current && data.endDate && data.startDate > data.endDate) {
    throw new Error("End date cannot be before start date");
  }

  return data;
};

export default function Responsibilities() {
  const [editingResponsibility, setEditingResponsibility] = useState<
    string | null
  >(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [current, setCurrent] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");

  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

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
    setTitle("");
    setOrganization("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setEndDate(null);
    setDescription("");
    setValidationErrors({});
  };

  const handleEdit = (responsibility: Responsibility) => {
    setEditingResponsibility(responsibility?._id || null);
    setTitle(responsibility.title);
    setOrganization(responsibility.organization);
    setStartDate(new Date(responsibility.startDate));
    setCurrent(responsibility.current);
    setEndDate(
      responsibility.endDate ? new Date(responsibility.endDate) : null
    );
    setDescription(responsibility.description || "");
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.responsibilities) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this position?"
    );
    if (!confirmDelete) return;

    try {
      const newResponsibilities = user.responsibilities.filter(
        (resp) => resp._id !== id
      );
      setUser({ ...user, responsibilities: newResponsibilities });
      toast.success("Position deleted successfully");
    } catch (error) {
      toast.error("Failed to delete position");
      console.error(error);
    }
  };

  const validateForm = (): boolean => {
    try {
      const formData = {
        title,
        organization,
        startDate,
        current,
        endDate: current ? null : endDate,
        description,
      };

      // Validate with zod schema
      responsibilitySchema.parse(formData);

      // Additional date validation
      validateDateLogic(formData);

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
      } else if (error instanceof Error) {
        // Handle custom validation errors
        if (error.message.includes("End date")) {
          setValidationErrors({
            ...validationErrors,
            endDate: error.message,
          });
        }
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

    if (field === "startDate") {
      setStartDate(dateObj);

      // Update validation errors
      if (validationErrors.startDate) {
        const newErrors = { ...validationErrors };
        delete newErrors.startDate;
        setValidationErrors(newErrors);
      }

      // Validate against end date if it exists
      if (endDate && !current && dateObj > endDate) {
        setValidationErrors({
          ...validationErrors,
          startDate: "Start date cannot be after end date",
        });
      }
    } else {
      setEndDate(dateObj);

      // Update validation errors
      if (validationErrors.endDate) {
        const newErrors = { ...validationErrors };
        delete newErrors.endDate;
        setValidationErrors(newErrors);
      }

      // Validate against start date
      if (dateObj < startDate) {
        setValidationErrors({
          ...validationErrors,
          endDate: "End date cannot be before start date",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let newResponsibilities: Responsibility[] = [];

      const preparedData: Responsibility = {
        title,
        organization,
        startDate,
        current,
        endDate: current ? undefined : endDate || undefined,
        description,
      };

      if (editingResponsibility) {
        // Make sure we have responsibilities array
        if (!user.responsibilities) {
          throw new Error("Responsibilities data not found");
        }

        // Check if the edited responsibility still exists
        const responsibilityExists = user.responsibilities.some(
          (resp) => resp._id === editingResponsibility
        );

        if (!responsibilityExists) {
          throw new Error("Position to edit not found");
        }

        newResponsibilities = (user.responsibilities || []).map((resp) =>
          resp._id === editingResponsibility
            ? { ...preparedData, _id: resp._id }
            : resp
        );
        toast.success("Position updated successfully");
      } else {
        const newResp: Responsibility = {
          ...preparedData,
          _id: `resp_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          startDate: new Date(preparedData.startDate),
          endDate: preparedData.endDate
            ? new Date(preparedData.endDate)
            : undefined,
          createdAt: new Date(),
        };
        newResponsibilities = [...(user?.responsibilities || []), newResp];
        toast.success("Position added successfully");
      }

      // Sort by most recent first
      newResponsibilities.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setUser({
        ...user,
        responsibilities: newResponsibilities,
      });

      setEditingResponsibility(null);
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
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch (e) {
      console.error("Invalid date format", e);
      return "Invalid date";
    }
  };

  const handleInputChange = (
    value: string,
    field: keyof Responsibility,
    setter: (value: string) => void
  ) => {
    setter(value);
    if (validationErrors[field] && value.trim()) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleCurrentChange = (isSelected: boolean) => {
    setCurrent(isSelected);
    if (isSelected && validationErrors.endDate) {
      const newErrors = { ...validationErrors };
      delete newErrors.endDate;
      setValidationErrors(newErrors);
    }
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/responsibilities">
          Responsibilities
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Positions of Responsibility</h1>
          <p className="text-sm text-neutral-500">
            Manage your leadership roles and responsibilities
          </p>
        </div>
        <Button
          variant="flat"
          onClick={handleAdd}
          startContent={<Plus size={18} />}
          color="primary"
        >
          Add Position
        </Button>
      </div>

      <div className="space-y-4">
        {!user.responsibilities?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full">
              <Award size={32} className="text-neutral-500" />
            </div>

            <h3 className="text-lg font-medium mt-2">No Positions Added</h3>
            <p className="text-neutral-500 text-center max-w-md">
              Add your leadership roles and positions of responsibility to
              enhance your profile.
            </p>
            <Button
              color="primary"
              onClick={handleAdd}
              startContent={<Plus size={16} />}
              size="sm"
            >
              Add Position
            </Button>
          </div>
        ) : (
          <>
            {user.responsibilities.map((responsibility) => (
              <Card
                key={responsibility._id}
                className="w-full border border-neutral-200 dark:border-neutral-800 shadow-sm"
              >
                <CardBody>
                  <div className="flex items-start w-full gap-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-700 dark:text-neutral-300 shrink-0 font-medium">
                      {responsibility.organization.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-medium">
                            {responsibility.title}
                          </h3>
                          {responsibility.current && (
                            <Chip size="sm" color="primary" variant="flat">
                              Current
                            </Chip>
                          )}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          {responsibility.organization}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                          {formatDate(responsibility.startDate)} -{" "}
                          {responsibility.current
                            ? "Present"
                            : responsibility.endDate
                            ? formatDate(responsibility.endDate)
                            : ""}
                        </p>
                        {responsibility.description && (
                          <div className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                            {responsibility.description}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 shrink-0 ml-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(responsibility)}
                          size="sm"
                          aria-label="Edit position"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onClick={() =>
                            responsibility._id &&
                            handleDelete(responsibility._id)
                          }
                          size="sm"
                          aria-label="Delete position"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b">
                {editingResponsibility ? "Edit Position" : "Add New Position"}
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Position Title"
                    placeholder="Enter position title"
                    isRequired
                    isInvalid={!!validationErrors.title}
                    errorMessage={validationErrors.title}
                    value={title}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "title", setTitle)
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <Input
                    label="Organization"
                    placeholder="Enter organization name"
                    isRequired
                    isInvalid={!!validationErrors.organization}
                    errorMessage={validationErrors.organization}
                    value={organization}
                    onChange={(e) =>
                      handleInputChange(
                        e.target.value,
                        "organization",
                        setOrganization
                      )
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <div className="flex flex-col">
                    <DatePicker
                      label="Start Date"
                      isRequired
                      isInvalid={!!validationErrors.startDate}
                      errorMessage={validationErrors.startDate}
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(startDate.toISOString())}
                      onChange={(date) => handleDateChange(date, "startDate")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <DatePicker
                      label="End Date"
                      isInvalid={!!validationErrors.endDate}
                      errorMessage={validationErrors.endDate}
                      value={
                        endDate
                          ? parseAbsoluteToLocal(endDate.toISOString())
                          : undefined
                      }
                      onChange={(date) => handleDateChange(date, "endDate")}
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={current}
                    />
                  </div>
                  <div className="col-span-2 mt-1">
                    <Checkbox
                      isSelected={current}
                      onValueChange={handleCurrentChange}
                    >
                      I currently hold this position
                    </Checkbox>
                  </div>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Describe your responsibilities, achievements, and impact"
                  className="mt-4"
                  value={description}
                  onChange={(e) =>
                    handleInputChange(
                      e.target.value,
                      "description",
                      setDescription
                    )
                  }
                  minRows={3}
                  isRequired
                  isInvalid={!!validationErrors.description}
                  errorMessage={validationErrors.description}
                  classNames={{
                    inputWrapper: "border-neutral-300 dark:border-neutral-700",
                  }}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Use bullet points to highlight key achievements and
                  responsibilities
                </p>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button color="default" variant="light" onPress={onClose}>
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
    </div>
  );
}
