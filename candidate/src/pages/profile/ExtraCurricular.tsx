import { useState, useEffect } from "react";
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
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Badge,
  Skeleton,
} from "@heroui/react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Award,
  Clock,
  AlertCircle,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Candidate,
  ExtraCurricular as IExtraCurricular,
} from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

// Define Zod schema for validation with improved error messages
const extraCurricularSchema = z
  .object({
    title: z.string().optional(),
    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .max(100, "Category name is too long"),
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
      .optional()
      .nullable(),
    current: z.boolean().default(false),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
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
      message: "End date is required when not a current activity",
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

// Type derived from Zod schema
type ExtraCurricularFormData = z.infer<typeof extraCurricularSchema>;

const ExtraCurricular = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

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
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Initialize extraCurriculars array if it doesn't exist
  useEffect(() => {
    if (user && !user.extraCurriculars) {
      setUser({ ...user, extraCurriculars: [] });
    }
  }, [user, setUser]);

  // Calculate active vs. completed activities
  const activeActivities =
    user?.extraCurriculars?.filter((a) => a.current)?.length || 0;
  const completedActivities =
    (user?.extraCurriculars?.length || 0) - activeActivities;

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

    setFormData((prev) => ({
      ...prev,
      [field]: dateObj,
    }));

    // Clear validation errors
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Additional validation for date relationships
    if (
      field === "startDate" &&
      formData.endDate &&
      !formData.current &&
      dateObj > formData.endDate
    ) {
      setErrors((prev) => ({
        ...prev,
        startDate: "Start date cannot be after end date",
      }));
    } else if (
      field === "endDate" &&
      formData.startDate &&
      dateObj < formData.startDate
    ) {
      setErrors((prev) => ({
        ...prev,
        endDate: "End date cannot be before start date",
      }));
    }
  };

  // Validate form with Zod
  const validateForm = () => {
    try {
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
    try {
      setEditingActivityId(activity._id || null);
      setFormData({
        title: activity.title || "",
        category: activity.category,
        startDate: new Date(activity.startDate),
        endDate: activity.endDate ? new Date(activity.endDate) : null,
        current: activity.current || false,
        description: activity.description || "",
      });
      setErrors({});
      onOpen();
    } catch (error) {
      console.error("Error editing activity:", error);
      toast.error("Could not edit this activity. Invalid data format.");
    }
  };

  // Confirm delete
  const confirmDelete = (id: string) => {
    setActivityToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  // Handle deleting an activity
  const handleDelete = () => {
    if (!activityToDelete) return;

    setIsSubmitting(true);

    try {
      const newActivities = user?.extraCurriculars?.filter(
        (activity) => activity._id !== activityToDelete
      );
      setUser({ ...user, extraCurriculars: newActivities });
      toast.success("Activity deleted successfully");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    } finally {
      setIsSubmitting(false);
      setActivityToDelete(null);
      setDeleteConfirmationOpen(false);
    }
  };

  // Handle saving the form
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const isValid = validateForm();
      if (!isValid) {
        // Find first error to show in toast
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast.error(firstError);
        }
        setIsSubmitting(false);
        return;
      }

      // Prepare the data object
      const preparedData: IExtraCurricular = {
        title: formData.title || "",
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : formData.endDate || undefined,
        current: formData.current,
        description: formData.description || "",
      };

      let newActivities: IExtraCurricular[] = [];

      if (editingActivityId) {
        // Update existing activity
        newActivities = (user?.extraCurriculars || []).map((activity) =>
          activity._id === editingActivityId
            ? {
                ...preparedData,
                createdAt: activity.createdAt,
              }
            : activity
        );
        toast.success("Activity updated successfully");
      } else {
        // Add new activity
        const newActivity = {
          ...preparedData,
          createdAt: new Date(),
        } as IExtraCurricular;

        newActivities = [...(user?.extraCurriculars || []), newActivity];
        toast.success("Activity added successfully");
      }

      // Sort by most recent first, with current activities at the top
      newActivities.sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });

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
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
    } catch (e) {
      console.error("Invalid date format", e);
      return "Invalid date";
    }
  };

  // Calculate duration of activity
  const getDuration = (
    startDate: Date | string,
    endDate?: Date | string,
    current?: boolean
  ) => {
    try {
      const start = new Date(startDate);
      const end = current
        ? new Date()
        : endDate
        ? new Date(endDate)
        : new Date();

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      let result = "";
      if (years > 0) {
        result += `${years} year${years > 1 ? "s" : ""}`;
      }
      if (remainingMonths > 0 || years === 0) {
        if (years > 0) result += " ";
        result += `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
      }

      return result;
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Extra-curricular Activities</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Extra-curricular Activities
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Showcase your involvements and interests outside of academics
          </p>
        </div>
        <Button
          color="primary"
          onPress={handleAdd}
          startContent={<Plus size={18} />}
        >
          Add Activity
        </Button>
      </div>
      {isLoading ? (
        // Skeleton loader for loading state
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : !user?.extraCurriculars?.length ? (
        <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
          <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="bg-primary-50 p-5 rounded-full">
              <BookOpen size={36} className="text-primary" />
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-medium mb-2">
                No Activities Added Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Extra-curricular activities demonstrate your well-roundedness
                and interests outside of academics. Add activities like sports,
                music, clubs, volunteering, or any other involvement to showcase
                your diverse talents.
              </p>
              <Button
                color="primary"
                onPress={handleAdd}
                startContent={<Plus size={18} />}
                size="lg"
              >
                Add Your First Activity
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-primary" />
              <h2 className="text-lg font-medium">Your Activities</h2>
              <Badge variant="flat">
                {user?.extraCurriculars?.length || 0}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Chip color="success" variant="flat">
                {activeActivities} Active
              </Chip>
              <Chip color="default" variant="flat">
                {completedActivities} Completed
              </Chip>
            </div>
          </CardHeader>
          <Divider />
          <Table aria-label="Extra-curricular activities table" removeWrapper>
            <TableHeader>
              <TableColumn>ACTIVITY</TableColumn>
              <TableColumn>PERIOD</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn width={100} align="center">
                ACTIONS
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent="No activities found">
              {user.extraCurriculars.map((activity) => (
                <TableRow key={activity._id} className="border-b">
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{activity.category}</p>
                        <Badge variant="flat" color="primary">
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            {activity.title || activity.category}
                          </div>
                        </Badge>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <div>
                        <span>
                          {formatDate(activity.startDate)} -{" "}
                          {activity.current
                            ? "Present"
                            : activity.endDate
                            ? formatDate(activity.endDate)
                            : ""}
                        </span>
                        <Tooltip content="Duration of activity">
                          <Chip
                            variant="flat"
                            color="primary"
                            className="ml-2"
                            startContent={<Clock size={12} />}
                          >
                            {getDuration(
                              activity.startDate,
                              activity.endDate,
                              activity.current
                            )}
                          </Chip>
                        </Tooltip>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {activity.current ? (
                      <Chip color="success" variant="flat">
                        Active
                      </Chip>
                    ) : (
                      <Chip color="default" variant="flat">
                        Completed
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Tooltip content="Edit activity">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleEdit(activity)}
                          aria-label="Edit activity"
                        >
                          <Edit2 size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete activity" color="danger">
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onPress={() => confirmDelete(activity._id || "")}
                          aria-label="Delete activity"
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
      {/* Add/Edit Activity Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={closeAndReset}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-primary" />
                  <h2 className="text-lg">
                    {editingActivityId
                      ? "Edit Activity"
                      : "Add New Extra-curricular Activity"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {editingActivityId
                    ? "Update details about your involvement and experiences"
                    : "Share information about your involvements outside of academics"}
                </p>
              </ModalHeader>

              <ModalBody className="py-5">
                <div className="flex flex-col gap-5">
                  <div>
                    <Input
                      label="Activity Category"
                      placeholder="e.g. Sports, Music, Volunteering"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      isRequired
                      isInvalid={!!errors.category}
                      errorMessage={errors.category}
                      startContent={<Tag size={16} className="text-gray-400" />}
                      description="The type of activity or involvement"
                      isDisabled={isSubmitting}
                    />
                  </div>

                  <Input
                    label="Role or Position (Optional)"
                    placeholder="e.g. Team Captain, Club President, Member"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    startContent={<Award size={16} className="text-gray-400" />}
                    description="Your specific role within the activity"
                    isDisabled={isSubmitting}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-small font-medium text-foreground mb-1.5">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        aria-label="Start Date"
                        maxValue={today(getLocalTimeZone())}
                        value={parseAbsoluteToLocal(
                          formData.startDate.toISOString()
                        )}
                        onChange={(date) => handleDateChange(date, "startDate")}
                        isInvalid={!!errors.startDate}
                        errorMessage={errors.startDate}
                        isDisabled={isSubmitting}
                        hideTimeZone
                        granularity="day"
                      />
                      <p className="text-tiny text-default-500 mt-1">
                        When you began this activity
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
                        value={
                          formData.endDate
                            ? parseAbsoluteToLocal(
                                formData.endDate.toISOString()
                              )
                            : undefined
                        }
                        onChange={(date) => handleDateChange(date, "endDate")}
                        maxValue={today(getLocalTimeZone())}
                        isDisabled={formData.current || isSubmitting}
                        isInvalid={!!errors.endDate}
                        errorMessage={errors.endDate}
                        hideTimeZone
                        granularity="day"
                      />
                      <p className="text-tiny text-default-500 mt-1">
                        {formData.current
                          ? "Not required for current activities"
                          : "When you completed this activity"}
                      </p>
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
                      isDisabled={isSubmitting}
                    >
                      I currently participate in this activity
                    </Checkbox>
                  </div>

                  <Textarea
                    label="Description (Optional)"
                    placeholder="Describe your involvement, achievements, or experiences related to this activity"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    maxRows={5}
                    description="Share details about what you did and what you accomplished"
                    isDisabled={isSubmitting}
                  />

                  {formData.description && (
                    <div className="flex justify-end">
                      <p className="text-xs text-gray-500">
                        {formData.description.length}/1000 characters
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>

              <Divider />

              <ModalFooter className="border-t">
                <Button
                  color="default"
                  variant="light"
                  onPress={closeAndReset}
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
                  {editingActivityId ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={deleteConfirmationOpen}
        onClose={() => !isSubmitting && setDeleteConfirmationOpen(false)}
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
                    Are you sure you want to delete this activity? This action
                    cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  variant="light"
                  onPress={() =>
                    !isSubmitting && setDeleteConfirmationOpen(false)
                  }
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

export default ExtraCurricular;
