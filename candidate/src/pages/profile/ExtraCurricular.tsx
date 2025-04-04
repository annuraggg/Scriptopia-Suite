import { useState } from "react";
import { z } from "zod";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Input,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  DatePicker,
  Checkbox,
  Card,
  CardBody,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { Plus, Edit2, Trash2, BookIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Candidate,
  ExtraCurricular as IExtraCurricular,
} from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

// Define Zod schema for validation
const extraCurricularSchema = z.object({
  title: z.string().optional(),
  category: z.string().min(2, "Category must be at least 2 characters"),
  startDate: z
    .date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    })
    .max(new Date(), "Start date cannot be in the future"),
  endDate: z
    .date({
      invalid_type_error: "End date must be a valid date",
    })
    .max(new Date(), "End date cannot be in the future")
    .optional(),
  current: z.boolean().default(false),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
});

// Type derived from Zod schema
type ExtraCurricularFormData = z.infer<typeof extraCurricularSchema>;

const ExtraCurricular = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  // State for form data
  const [formData, setFormData] = useState<ExtraCurricularFormData>({
    title: "",
    category: "",
    startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    current: false,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle input changes
  const handleInputChange = (
    field: keyof ExtraCurricularFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for the field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle date changes
  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    handleInputChange(field, dateObj);
  };

  // Validate form with Zod
  const validateForm = () => {
    try {
      // Additional validation for endDate if not current activity
      if (!formData.current && formData.startDate && formData.endDate) {
        if (formData.startDate > formData.endDate) {
          setErrors((prev) => ({
            ...prev,
            endDate: "End date must be after start date",
          }));
          return false;
        }
      }

      extraCurricularSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      endDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      current: false,
      description: "",
    });
    setErrors({});
    setEditingActivityId(null);
  };

  // Handle opening the add modal
  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  // Handle editing an activity
  const handleEdit = (activity: IExtraCurricular) => {
    setEditingActivityId(activity._id || null);
    setFormData({
      title: activity.title || "",
      category: activity.category,
      startDate: new Date(activity.startDate),
      endDate: activity.endDate ? new Date(activity.endDate) : undefined,
      current: activity.current || false,
      description: activity.description || "",
    });
    setErrors({});
    onOpen();
  };

  // Handle deleting an activity with confirmation
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      const newActivities = user?.extraCurriculars?.filter(
        (activity) => activity._id !== id
      );
      setUser({ ...user, extraCurriculars: newActivities });
      toast.success("Activity deleted successfully");
    }
  };

  // Handle saving the form
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const isValid = validateForm();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Prepare the data object
      const preparedData: IExtraCurricular = {
        title: formData.title || "",
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : formData.endDate,
        current: formData.current,
        description: formData.description || "",
      };

      let newActivities: IExtraCurricular[] = [];

      if (editingActivityId) {
        // Update existing activity
        newActivities = (user?.extraCurriculars || []).map((activity) =>
          activity._id === editingActivityId
            ? { ...preparedData, _id: activity._id }
            : activity
        );
        toast.success("Activity updated successfully");
      } else {
        // Add new activity
        const newActivity = {
          ...preparedData,
          _id: crypto.randomUUID(),
          createdAt: new Date(),
        } as IExtraCurricular;

        newActivities = [...(user?.extraCurriculars || []), newActivity];
        toast.success("Activity added successfully");
      }

      setUser({ ...user, extraCurriculars: newActivities });
      closeAndReset();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Failed to save activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset form
  const closeAndReset = () => {
    resetForm();
    onClose();
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Breadcrumbs size="sm">
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Extra-curricular Activities</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Extra-curricular Activities</h1>
        <Button
          color="primary"
          onPress={handleAdd}
          startContent={<Plus size={18} />}
          size="sm"
        >
          Add Activity
        </Button>
      </div>

      {!user?.extraCurriculars?.length ? (
        <Card className="w-full shadow-sm">
          <CardBody className="py-8 flex flex-col items-center justify-center gap-4">
            <BookIcon size={36} className="text-gray-400" />
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">No Activities Added</h3>
              <p className="text-gray-500 mb-4">
                Share activities you've participated in outside your academic
                curriculum
              </p>
              <Button
                color="primary"
                onPress={handleAdd}
                startContent={<Plus size={16} />}
                size="sm"
              >
                Add Activity
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Table
          aria-label="Extra-curricular activities table"
          removeWrapper
          shadow="sm"
          className="rounded-md border"
        >
          <TableHeader>
            <TableColumn>ACTIVITY</TableColumn>
            <TableColumn>PERIOD</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn width={100}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {user.extraCurriculars.map((activity) => (
              <TableRow key={activity._id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{activity.category}</p>
                    {activity.title && (
                      <p className="text-sm text-gray-500">{activity.title}</p>
                    )}
                    {activity.description && (
                      <p className="text-sm mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(new Date(activity.startDate))} -{" "}
                  {activity.current
                    ? "Present"
                    : activity.endDate
                    ? formatDate(new Date(activity.endDate))
                    : ""}
                </TableCell>
                <TableCell>
                  {activity.current ? (
                    <Chip size="sm" color="success" variant="flat">
                      Active
                    </Chip>
                  ) : (
                    <Chip size="sm" color="default" variant="flat">
                      Completed
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(activity)}
                      aria-label="Edit activity"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(activity._id || "")}
                      aria-label="Delete activity"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeAndReset}
        size="md"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {editingActivityId
                  ? "Edit Activity"
                  : "Add New Extra-curricular Activity"}
              </ModalHeader>
              <Divider />
              <ModalBody className="py-4">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Title (Optional)"
                    placeholder="Activity title or position"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    variant="bordered"
                  />

                  <Input
                    label="Category"
                    placeholder="e.g. Singing, Dancing, Sports"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.category}
                    errorMessage={errors.category}
                    variant="bordered"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <DatePicker
                        label="Start Date"
                        granularity="day"
                        maxValue={today(getLocalTimeZone())}
                        value={parseAbsoluteToLocal(
                          formData.startDate.toISOString()
                        )}
                        onChange={(date) => handleDateChange(date, "startDate")}
                        isInvalid={!!errors.startDate}
                      />
                      {errors.startDate && (
                        <p className="text-xs text-danger mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <DatePicker
                        label="End Date"
                        granularity="day"
                        value={
                          formData.endDate
                            ? parseAbsoluteToLocal(
                                formData.endDate.toISOString()
                              )
                            : undefined
                        }
                        onChange={(date) => handleDateChange(date, "endDate")}
                        maxValue={today(getLocalTimeZone())}
                        isDisabled={formData.current}
                        isInvalid={!!errors.endDate}
                      />
                      {errors.endDate && (
                        <p className="text-xs text-danger mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <Checkbox
                      isSelected={formData.current}
                      onValueChange={(checked) => {
                        handleInputChange("current", checked);
                        // Clear end date error if currently active
                        if (checked && errors.endDate) {
                          setErrors((prev) => {
                            const { endDate, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                    >
                      I currently do this activity
                    </Checkbox>
                  </div>

                  <Textarea
                    label="Description"
                    placeholder="Briefly describe your role, achievements or experience"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    maxRows={5}
                    variant="bordered"
                  />
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  color="default"
                  variant="flat"
                  onPress={closeAndReset}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                  size="sm"
                >
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

export default ExtraCurricular;
