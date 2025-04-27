import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Checkbox,
  Textarea,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  DatePicker,
  Chip,
  Avatar,
  Tooltip,
  Breadcrumbs,
  BreadcrumbItem,
  Skeleton,
  Badge,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Calendar,
  Plus,
  Briefcase,
  Award,
  Clock,
  Heart,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";
import { Candidate, Volunteering } from "@shared-types/Candidate";

// Available causes with categories
const causes = [
  { value: "Education", category: "Youth & Education" },
  { value: "Youth Development", category: "Youth & Education" },
  { value: "Healthcare", category: "Health & Wellness" },
  { value: "Mental Health", category: "Health & Wellness" },
  { value: "Environment", category: "Environment & Animals" },
  { value: "Animal Welfare", category: "Environment & Animals" },
  { value: "Community Development", category: "Community & Society" },
  { value: "Arts & Culture", category: "Community & Society" },
  { value: "Social Justice", category: "Humanitarian" },
  { value: "Disaster Relief", category: "Humanitarian" },
  { value: "Poverty Alleviation", category: "Humanitarian" },
  { value: "Elderly Care", category: "Health & Wellness" },
  { value: "Technology", category: "Community & Society" },
  { value: "Other", category: "Other" },
];

// Grouped causes for the dropdown
const causesGrouped = [
  {
    category: "Youth & Education",
    items: causes.filter((c) => c.category === "Youth & Education"),
  },
  {
    category: "Health & Wellness",
    items: causes.filter((c) => c.category === "Health & Wellness"),
  },
  {
    category: "Environment & Animals",
    items: causes.filter((c) => c.category === "Environment & Animals"),
  },
  {
    category: "Community & Society",
    items: causes.filter((c) => c.category === "Community & Society"),
  },
  {
    category: "Humanitarian",
    items: causes.filter((c) => c.category === "Humanitarian"),
  },
  {
    category: "Other",
    items: causes.filter((c) => c.category === "Other"),
  },
];

// Zod schema for form validation with improved error messages
const volunteerSchema = z
  .object({
    organization: z
      .string()
      .min(1, "Organization name is required")
      .max(100, "Organization name is too long"),
    role: z.string().min(1, "Role is required").max(100, "Role is too long"),
    cause: z.string().min(1, "Cause is required"),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Invalid date format",
    }),
    endDate: z
      .date({
        invalid_type_error: "Invalid date format",
      })
      .optional(),
    current: z.boolean(),
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
      message: "End date is required when not currently volunteerings",
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

// Error type for form validation
type ValidationErrors = {
  [K in keyof z.infer<typeof volunteerSchema>]?: string;
};

const VolunteeringComponent = () => {
  // State for editing experience
  const [editingExperience, setEditingExperience] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();

  // Form state
  const [formData, setFormData] = useState<z.infer<typeof volunteerSchema>>({
    organization: "",
    role: "",
    cause: "",
    startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    current: false,
    endDate: undefined,
    description: "",
  });

  // Access user context
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Initialize volunteerings array if it doesn't exist
  useEffect(() => {
    if (user && !user.volunteerings && setUser) {
      setUser({
        ...user,
        volunteerings: [],
      });
    }
  }, [user, setUser]);

  // Reset form state
  const resetForm = () => {
    setEditingExperience(null);
    setValidationErrors({});
    setFormData({
      organization: "",
      role: "",
      cause: "",
      startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      current: false,
      endDate: undefined,
      description: "",
    });
  };

  // Handle add new experience
  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  // Handle edit experience
  const handleEdit = (experience: Volunteering) => {
    try {
      setEditingExperience(experience?._id || null);
      setFormData({
        organization: experience.organization,
        role: experience.role,
        cause: experience.cause,
        startDate: new Date(experience.startDate),
        current: experience.current,
        endDate: experience.endDate ? new Date(experience.endDate) : undefined,
        description: experience.description || "",
      });
      setValidationErrors({});
      onOpen();
    } catch (error) {
      console.error("Error editing volunteer experience:", error);
      toast.error("Could not edit this experience. Invalid data format.");
    }
  };

  // Confirm delete
  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
    deleteModal.onOpen();
  };

  // Handle delete experience
  const handleDelete = () => {
    if (!deleteConfirmId || !user.volunteerings) return;

    setIsSubmitting(true);

    try {
      const newVolunteering = user.volunteerings?.filter(
        (exp) => exp._id !== deleteConfirmId
      );
      setUser({ ...user, volunteerings: newVolunteering });
      toast.success("Volunteer experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete volunteer experience");
      console.error("Delete error:", error);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmId(null);
      deleteModal.onClose();
    }
  };

  // Validate form using zod
  const validateForm = (): boolean => {
    try {
      volunteerSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ValidationErrors;
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Handle date change
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
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Validate date relationships
    if (
      field === "startDate" &&
      formData.endDate &&
      dateObj > formData.endDate
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        startDate: "Start date cannot be after end date",
      }));
    } else if (
      field === "endDate" &&
      formData.startDate &&
      dateObj < formData.startDate
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        endDate: "End date cannot be before start date",
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Handle "current" checkbox special case
    if (field === "current" && value === true) {
      // Clear end date errors when setting to current
      if (validationErrors.endDate) {
        setValidationErrors((prev) => ({
          ...prev,
          endDate: undefined,
        }));
      }
    }
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      // Find first error to display
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        toast.error(firstError);
      } else {
        toast.error("Please correct the errors in the form");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      let newVolunteering: Volunteering[] = [];

      // Create a new volunteer experience object
      const volunteerData: Volunteering = {
        organization: formData.organization,
        role: formData.role,
        cause: formData.cause,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : formData.endDate,
        current: formData.current,
        description: formData.description || "",
      };

      if (editingExperience) {
        // Update existing volunteer experience
        newVolunteering = (user?.volunteerings || []).map((exp) =>
          exp._id === editingExperience
            ? { ...volunteerData, _id: exp._id, createdAt: exp.createdAt }
            : { ...exp }
        );
        toast.success("Volunteer experience updated successfully");
      } else {
        // Add new volunteer experience
        const newExp: Volunteering = {
          ...volunteerData,
          createdAt: new Date(),
        };
        newVolunteering = [...(user?.volunteerings || []), newExp];
        toast.success("Volunteer experience added successfully");
      }

      // Sort by current first, then by most recent start date
      newVolunteering.sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });

      setUser({
        ...user,
        volunteerings: newVolunteering,
      });

      onClose();
    } catch (error) {
      toast.error("Failed to save volunteer experience");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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

  // Calculate duration
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

  // Handle modal close
  const closeModal = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Get color for cause chip
  const getCauseColor = (
    cause: string
  ): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    if (cause.includes("Education") || cause.includes("Youth")) {
      return "primary";
    } else if (cause.includes("Health") || cause.includes("Mental")) {
      return "success";
    } else if (cause.includes("Environment") || cause.includes("Animal")) {
      return "secondary";
    } else if (
      cause.includes("Disaster") ||
      cause.includes("Justice") ||
      cause.includes("Poverty")
    ) {
      return "danger";
    } else if (
      cause.includes("Community") ||
      cause.includes("Arts") ||
      cause.includes("Culture") ||
      cause.includes("Technology")
    ) {
      return "warning";
    }
    return "default";
  };

  // Get avatar for organization
  const getOrganizationAvatar = (organization: string) => {
    // Generate initials from organization name
    const initials = organization
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    return initials;
  };

  // Filter by volunteerings type
  const [activeTab, setActiveTab] = useState<string>("all");

  // Count volunteer experiences by cause category
  const getVolunteerCountByCategory = () => {
    const counts: Record<string, number> = {
      all: (user?.volunteerings || []).length,
      "Youth & Education": 0,
      "Health & Wellness": 0,
      "Environment & Animals": 0,
      "Community & Society": 0,
      Humanitarian: 0,
      Other: 0,
    };

    user?.volunteerings?.forEach((vol) => {
      const cause = causes.find((c) => c.value === vol.cause);
      if (cause) {
        counts[cause.category] = (counts[cause.category] || 0) + 1;
      }
    });

    return counts;
  };

  const volunteerCounts = getVolunteerCountByCategory();

  // Filter volunteerings experiences by category
  const filteredVolunteering = (user?.volunteerings || [])
    .filter((vol) => {
      if (activeTab === "all") return true;
      const cause = causes.find((c) => c.value === vol.cause);
      return cause?.category === activeTab;
    })
    .sort((a, b) => {
      // Sort by current first, then by most recent start date
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Volunteer Experience</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Volunteer Experience</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your community service and volunteer contributions
          </p>
        </div>
        {!isLoading && (user?.volunteerings?.length ?? 0) > 0 && (
          <Button
            color="primary"
            onClick={handleAdd}
            startContent={<Plus size={18} />}
          >
            Add Experience
          </Button>
        )}
      </div>
      {isLoading ? (
        // Skeleton loading state
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      ) : !user.volunteerings?.length ? (
        <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
          <CardBody className="flex flex-col items-center justify-center py-12">
            <div className="bg-primary-50 p-5 rounded-full">
              <Heart size={36} className="text-primary" />
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-medium mb-2">
                No volunteerings Added Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Volunteer experience demonstrates your commitment to causes you
                care about and showcases valuable skills like leadership,
                teamwork, and community engagement. Add your contributions to
                show recruiters your well-rounded background.
              </p>
              <Button
                color="primary"
                onClick={handleAdd}
                startContent={<Plus size={18} />}
                size="lg"
              >
                Add Volunteer Experience
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Filter tabs by cause category */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeTab === "all" ? "flat" : "light"}
              color={activeTab === "all" ? "primary" : "default"}
              onClick={() => setActiveTab("all")}
              className="px-3"
            >
              All
              <Badge color="default" shape="circle">
                {volunteerCounts.all}
              </Badge>
            </Button>

            {Object.entries(volunteerCounts)
              .filter(([key]) => key !== "all" && volunteerCounts[key] > 0)
              .map(([category, count]) => (
                <Button
                  key={category}
                  variant={activeTab === category ? "flat" : "light"}
                  color={
                    activeTab === category ? getCauseColor(category) : "default"
                  }
                  onClick={() => setActiveTab(category)}
                  className="px-3"
                  startContent={<Heart size={14} />}
                >
                  {category}
                  <Badge color="default" shape="circle">
                    {count}
                  </Badge>
                </Button>
              ))}
          </div>

          {filteredVolunteering.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No volunteer experience found for this category
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVolunteering.map((experience) => (
                <Card key={experience._id} className="w-full shadow-sm">
                  <CardHeader className="flex justify-between pb-0">
                    <div className="flex gap-4 items-center">
                      <Avatar
                        name={getOrganizationAvatar(experience.organization)}
                        color="primary"
                        size="md"
                        radius="md"
                        showFallback
                        className="bg-primary-100 text-primary-600"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            {experience.role}
                          </h3>
                          {experience.current && (
                            <Chip
                              color="success"
                              variant="flat"
                              startContent={<Clock size={12} />}
                            >
                              Current
                            </Chip>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {experience.organization}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip content="Edit">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(experience)}
                          aria-label="Edit"
                        >
                          <Edit2 size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete" color="danger">
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onClick={() =>
                            experience._id && confirmDelete(experience._id)
                          }
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </CardHeader>

                  <CardBody className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current
                            ? "Present"
                            : experience.endDate
                            ? formatDate(experience.endDate)
                            : ""}
                        </span>
                        <Chip
                          variant="flat"
                          color="primary"
                          startContent={<Clock size={12} />}
                        >
                          {getDuration(
                            experience.startDate,
                            experience.endDate,
                            experience.current
                          )}
                        </Chip>
                      </div>

                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-gray-400" />
                        <span>Cause:</span>
                        <Chip
                          variant="flat"
                          color={getCauseColor(experience.cause)}
                        >
                          {experience.cause}
                        </Chip>
                      </div>
                    </div>

                    {experience.description && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
                        <p className="whitespace-pre-line">
                          {experience.description}
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      {/* Add/Edit Experience Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={closeModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-primary" />
                  <h2 className="text-lg">
                    {editingExperience ? "Edit" : "Add New"} Volunteer
                    Experience
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {editingExperience
                    ? "Update details about your volunteer work"
                    : "Share information about your volunteer service and community contributions"}
                </p>
              </ModalHeader>

              <ModalBody className="py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Organization Name"
                    placeholder="E.g., Red Cross, Habitat for Humanity"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    isRequired
                    isInvalid={!!validationErrors.organization}
                    errorMessage={validationErrors.organization}
                    startContent={
                      <Briefcase size={16} className="text-gray-400" />
                    }
                    description="Name of the nonprofit or organization"
                    isDisabled={isSubmitting}
                  />
                  <Input
                    label="Your Role"
                    placeholder="E.g., Volunteer Coordinator, Mentor"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    isRequired
                    isInvalid={!!validationErrors.role}
                    errorMessage={validationErrors.role}
                    startContent={<Award size={16} className="text-gray-400" />}
                    description="Your position or title"
                    isDisabled={isSubmitting}
                  />

                  <Select
                    label="Select Cause"
                    placeholder="Select cause area"
                    selectedKeys={formData.cause ? [formData.cause] : []}
                    onChange={(e) => handleInputChange("cause", e.target.value)}
                    isRequired
                    isInvalid={!!validationErrors.cause}
                    errorMessage={validationErrors.cause}
                    startContent={<Heart size={16} className="text-gray-400" />}
                    description="Category of volunteer work"
                    isDisabled={isSubmitting}
                  >
                    {causesGrouped.map((group) => (
                      <SelectItem
                        key={group.category}
                        textValue={group.category}
                      >
                        <div className="font-semibold text-small">
                          {group.category}
                        </div>
                        {group.items.map((cause) => (
                          <SelectItem key={cause.value}>
                            {cause.value}
                          </SelectItem>
                        ))}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="md:col-span-2 mt-2">
                    <Checkbox
                      isSelected={formData.current}
                      onValueChange={(checked) => {
                        handleInputChange("current", checked);
                        if (checked) {
                          handleInputChange("endDate", undefined as any);
                        }
                      }}
                      isDisabled={isSubmitting}
                    >
                      I am currently volunteerings with this organization
                    </Checkbox>
                  </div>

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Start Date"
                      value={parseAbsoluteToLocal(
                        formData.startDate.toISOString()
                      )}
                      onChange={(date) => handleDateChange(date, "startDate")}
                      maxValue={today(getLocalTimeZone())}
                      isInvalid={!!validationErrors.startDate}
                      errorMessage={validationErrors.startDate}
                      showMonthAndYearPickers
                      isDisabled={isSubmitting}
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      When you began volunteerings
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
                          ? parseAbsoluteToLocal(formData.endDate.toISOString())
                          : undefined
                      }
                      onChange={(date) => handleDateChange(date, "endDate")}
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={formData.current || isSubmitting}
                      isInvalid={!!validationErrors.endDate}
                      errorMessage={validationErrors.endDate}
                      showMonthAndYearPickers
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      {formData.current
                        ? "Not required for current positions"
                        : "When you stopped volunteerings"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <Textarea
                      label="Description"
                      placeholder="Describe your responsibilities, achievements, and impact as a volunteer"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      minRows={3}
                      maxRows={5}
                      isInvalid={!!validationErrors.description}
                      errorMessage={validationErrors.description}
                      isDisabled={isSubmitting}
                      description="Describe your contributions and their impact"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        Consider using bullet points for highlighting key
                        contributions
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.description?.length || 0}/1000
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t">
                <Button
                  variant="flat"
                  onPress={closeModal}
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
                  {editingExperience ? "Update" : "Save"}
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
                    Are you sure you want to delete this volunteer experience?
                    This action cannot be undone.
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

export default VolunteeringComponent;
