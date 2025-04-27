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
  Select,
  SelectItem,
  SelectSection,
  Checkbox,
  Textarea,
  Card,
  CardBody,
  Chip,
  DatePicker,
  Tooltip,
  Avatar,
  Skeleton,
  Divider,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  BriefcaseBusiness,
  MapPin,
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
import { Candidate, WorkExperience as Work } from "@shared-types/Candidate";
import { toast } from "sonner";
import { z } from "zod";

// Define schema for validation with improved error messages
const workExperienceSchema = z
  .object({
    company: z
      .string()
      .min(1, "Company name is required")
      .max(100, "Company name is too long"),
    sector: z.string().min(1, "Sector is required"),
    title: z
      .string()
      .min(1, "Job title is required")
      .max(100, "Job title is too long"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location is too long"),
    type: z.enum(
      ["fulltime", "parttime", "internship", "contract", "freelance"],
      {
        required_error: "Position type is required",
        invalid_type_error: "Please select a valid position type",
      }
    ),
    jobFunction: z.string().min(1, "Job function is required"),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    current: z.boolean(),
    endDate: z
      .date({
        invalid_type_error: "End date must be a valid date",
      })
      .optional()
      .nullable(),
    description: z.string().max(3000, "Description is too long").optional(),
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
      message: "End date is required when not currently employed",
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

// Position types with labels and descriptions
const positionTypes = [
  {
    value: "fulltime",
    label: "Full-time",
    color: "primary",
    description: "Standard full-time position",
  },
  {
    value: "parttime",
    label: "Part-time",
    color: "secondary",
    description: "Less than full-time hours",
  },
  {
    value: "internship",
    label: "Internship",
    color: "success",
    description: "Temporary training position",
  },
  {
    value: "contract",
    label: "Contract",
    color: "warning",
    description: "Fixed-term employment contract",
  },
  {
    value: "freelance",
    label: "Freelance",
    color: "default",
    description: "Independent contractor work",
  },
] as const;

// Job functions organized by category
const jobFunctionsByCategory = {
  "Engineering & Technology": [
    "Engineering - Web / Software",
    "Engineering - Mobile",
    "Engineering - Hardware",
    "Engineering - DevOps",
    "Engineering - QA",
    "Data Science",
    "Machine Learning",
    "IT Operations",
  ],
  "Design & Creative": [
    "Product Design",
    "UX/UI Design",
    "Graphic Design",
    "Content Creation",
    "Art Direction",
  ],
  "Business & Marketing": [
    "Marketing",
    "Sales",
    "Business Development",
    "Finance",
    "Human Resources",
    "Project Management",
    "Product Management",
  ],
  Other: ["Customer Support", "Operations", "Research", "Education", "Other"],
};

// Sectors with categories
const sectorsByCategory = {
  "Technology & Internet": [
    "Technology",
    "Software Development",
    "Information Technology",
    "E-commerce",
    "Telecommunications",
  ],
  "Finance & Business": [
    "Finance",
    "Banking",
    "Insurance",
    "Consulting",
    "Real Estate",
  ],
  "Healthcare & Education": [
    "Healthcare",
    "Pharmaceuticals",
    "Education",
    "Research",
  ],
  "Other Industries": [
    "Manufacturing",
    "Retail",
    "Media & Entertainment",
    "Transportation",
    "Hospitality",
    "Energy",
    "Agriculture",
    "Government",
    "Non-profit",
    "Other",
  ],
};

export default function WorkExperience() {
  const [editingExperience, setEditingExperience] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();

  // Form state in a single object for better management
  const [formData, setFormData] = useState<
    z.infer<typeof workExperienceSchema>
  >({
    company: "",
    sector: "",
    title: "",
    location: "",
    type: "fulltime" as Work["type"],
    jobFunction: "",
    startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    current: false,
    endDate: null,
    description: "",
  });

  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  useEffect(() => {
    // Reset form validation on modal close
    if (!isOpen) {
      setValidationErrors({});
    }
  }, [isOpen]);

  // Initialize workExperience array if it doesn't exist
  useEffect(() => {
    if (user && !user.workExperience && setUser) {
      setUser({
        ...user,
        workExperience: [],
      });
    }
  }, [user, setUser]);

  const handleAdd = () => {
    setEditingExperience(null);
    resetForm();
    onOpen();
  };

  const resetForm = () => {
    setFormData({
      company: "",
      sector: "",
      title: "",
      location: "",
      type: "fulltime",
      jobFunction: "",
      startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      current: false,
      endDate: null,
      description: "",
    });
    setValidationErrors({});
  };

  const handleEdit = (experience: Work) => {
    try {
      setEditingExperience(experience?._id || null);
      setFormData({
        company: experience.company || "",
        sector: experience.sector || "",
        title: experience.title || "",
        location: experience.location || "",
        type: experience.type || "fulltime",
        jobFunction: experience.jobFunction || "",
        startDate: new Date(experience.startDate),
        current: experience.current || false,
        endDate: experience.endDate ? new Date(experience.endDate) : null,
        description: experience.description || "",
      });
      setValidationErrors({});
      onOpen();
    } catch (error) {
      console.error("Error editing experience:", error);
      toast.error("Could not edit this experience. Invalid data format.");
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
    deleteModal.onOpen();
  };

  const handleDelete = () => {
    if (!deleteConfirmId || !user.workExperience) return;

    setIsSubmitting(true);

    try {
      const newExp = user.workExperience.filter(
        (exp) => exp._id !== deleteConfirmId
      );
      setUser({ ...user, workExperience: newExp });
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete experience");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmId(null);
      deleteModal.onClose();
    }
  };

  const validateForm = (): boolean => {
    try {
      workExperienceSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          errors[path] = err.message;
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

    // Clear validation errors
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validate date relationships
    if (
      field === "startDate" &&
      formData.endDate &&
      !formData.current &&
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

  const handleSave = async () => {
    if (!validateForm()) {
      // Find first error to display
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      let newWorkExperience: Work[] = [];

      // Create work experience object from form data
      const workData: Work = {
        company: formData.company,
        sector: formData.sector,
        title: formData.title,
        location: formData.location,
        type: formData.type,
        jobFunction: formData.jobFunction,
        startDate: formData.startDate,
        current: formData.current,
        endDate: formData.current ? undefined : formData.endDate || undefined,
        description: formData.description,
      };

      if (editingExperience) {
        // Update existing experience
        newWorkExperience = (user.workExperience || []).map((exp) =>
          exp._id === editingExperience
            ? { ...workData, _id: exp._id, createdAt: exp.createdAt }
            : exp
        );
        toast.success("Experience updated successfully");
      } else {
        // Add new experience
        const newExp: Work = {
          ...workData,
          createdAt: new Date(),
        };
        newWorkExperience = [...(user?.workExperience || []), newExp];
        toast.success("Experience added successfully");
      }

      // Sort by current first, then by most recent start date
      newWorkExperience.sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });

      setUser({
        ...user,
        workExperience: newWorkExperience,
      });

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save experience"
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
        month: "long",
      });
    } catch (e) {
      console.error("Invalid date format", e);
      return "Invalid date";
    }
  };

  const getPositionTypeBadge = (type: string) => {
    const positionType =
      positionTypes.find((p) => p.value === type) || positionTypes[0];

    return (
      <Chip color={positionType.color as any} variant="flat">
        {positionType.label}
      </Chip>
    );
  };

  // Calculate duration of experience
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

  // Handle form field changes
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Special handling for "current" checkbox
    if (field === "current" && value === true) {
      // Clear end date errors when setting to current position
      if (validationErrors.endDate) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.endDate;
          return newErrors;
        });
      }
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Get company avatar initials
  const getCompanyInitials = (company: string) => {
    if (!company) return "C";

    const words = company.trim().split(/\s+/);
    if (words.length === 1) {
      return company.charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div>
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/experience">
          Work Experience
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Work Experience</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your professional career history
          </p>
        </div>
        <Button
          color="primary"
          onClick={handleAdd}
          startContent={<Plus size={18} />}
        >
          Add Experience
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loader for loading state
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : !user.workExperience?.length ? (
          <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
            <CardBody className="flex flex-col items-center justify-center py-12">
              <div className="bg-primary-50 p-5 rounded-full">
                <Briefcase size={36} className="text-primary" />
              </div>
              <div className="text-center max-w-lg">
                <h3 className="text-xl font-medium mb-2">
                  No Work Experience Added Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Your professional history showcases your career progression
                  and skills. Add details about your current and past work
                  experiences to highlight your expertise and industry
                  background.
                </p>
                <Button
                  color="primary"
                  onClick={handleAdd}
                  startContent={<Plus size={18} />}
                  size="lg"
                >
                  Add Your First Experience
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            {user.workExperience.map((experience) => (
              <Card key={experience._id} className="w-full shadow-sm">
                <CardBody className="p-5">
                  <div className="flex items-start w-full gap-4">
                    <Avatar
                      name={getCompanyInitials(experience.company)}
                      size="md"
                      radius="md"
                      color="primary"
                      classNames={{
                        base: "bg-primary-100",
                        name: "text-primary-600 font-semibold",
                      }}
                    />
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">
                            {experience.title}
                          </h3>
                          {getPositionTypeBadge(experience.type)}
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

                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-gray-400" />
                          <p className="text-gray-600">{experience.company}</p>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500 text-sm">
                            {experience.sector}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="text-gray-600">
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
                              className="ml-1"
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
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-gray-600">
                              {experience.location}
                            </span>
                          </div>
                        </div>

                        {experience.description && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm">
                            <p className="whitespace-pre-line">
                              {experience.description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0 ml-2">
                        <Tooltip content="Edit experience">
                          <Button
                            isIconOnly
                            variant="light"
                            onClick={() => handleEdit(experience)}
                            aria-label="Edit experience"
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete experience" color="danger">
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onClick={() =>
                              experience._id && confirmDelete(experience._id)
                            }
                            aria-label="Delete experience"
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
      {/* Add/Edit Experience Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-w-2xl",
          body: "py-6",
          closeButton: "top-3 right-3",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b px-6 py-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-primary" />
                  <h2 className="text-lg">
                    {editingExperience
                      ? "Edit Work Experience"
                      : "Add New Work Experience"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {editingExperience
                    ? "Update details about your professional experience"
                    : "Share information about your work history and professional career"}
                </p>
              </ModalHeader>

              <ModalBody className="px-6">
                <div className="space-y-6">
                  {/* Company Information Section */}
                  <div>
                    <h3 className="text-md font-medium mb-3">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Company Name"
                        placeholder="Enter the organization where you worked"
                        isRequired
                        isInvalid={!!validationErrors.company}
                        errorMessage={validationErrors.company}
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        startContent={
                          <Building size={16} className="text-gray-400" />
                        }
                        description="Name of the company or organization"
                        isDisabled={isSubmitting}
                      />

                      <Select
                        label="Company Sector"
                        placeholder="Select company's industry"
                        selectedKeys={formData.sector ? [formData.sector] : []}
                        isRequired
                        isInvalid={!!validationErrors.sector}
                        errorMessage={validationErrors.sector}
                        onSelectionChange={(keys) => {
                          if (keys instanceof Set && keys.size > 0) {
                            handleInputChange("sector", Array.from(keys)[0]);
                          }
                        }}
                        startContent={
                          <BriefcaseBusiness
                            size={16}
                            className="text-gray-400"
                          />
                        }
                        description="Industry or business sector"
                        isDisabled={isSubmitting}
                      >
                        {Object.entries(sectorsByCategory).map(
                          ([category, sectors]) => (
                            <SelectSection key={category} title={category}>
                              {sectors.map((sector) => (
                                <SelectItem key={sector}>{sector}</SelectItem>
                              ))}
                            </SelectSection>
                          )
                        )}
                      </Select>
                    </div>
                  </div>

                  <Divider className="my-2" />

                  {/* Position Details Section */}
                  <div>
                    <h3 className="text-md font-medium mb-3">
                      Position Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        placeholder="Your position or role"
                        value={formData.title}
                        isRequired
                        isInvalid={!!validationErrors.title}
                        errorMessage={validationErrors.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        startContent={
                          <Briefcase size={16} className="text-gray-400" />
                        }
                        description="Your official job title"
                        isDisabled={isSubmitting}
                      />

                      <Select
                        label="Employment Type"
                        placeholder="Select position type"
                        isRequired
                        isInvalid={!!validationErrors.type}
                        errorMessage={validationErrors.type}
                        selectedKeys={formData.type ? [formData.type] : []}
                        onSelectionChange={(keys) => {
                          if (keys instanceof Set && keys.size > 0) {
                            handleInputChange("type", Array.from(keys)[0]);
                          }
                        }}
                        startContent={
                          <BriefcaseBusiness
                            size={16}
                            className="text-gray-400"
                          />
                        }
                        description="Type of employment arrangement"
                        isDisabled={isSubmitting}
                      >
                        {positionTypes.map((type) => (
                          <SelectItem
                            key={type.value}
                            description={type.description}
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Location"
                        placeholder="City, Country or Remote"
                        isRequired
                        isInvalid={!!validationErrors.location}
                        errorMessage={validationErrors.location}
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        startContent={
                          <MapPin size={16} className="text-gray-400" />
                        }
                        description="Where the work was performed"
                        isDisabled={isSubmitting}
                      />

                      <Select
                        label="Job Function"
                        placeholder="Select primary area of work"
                        isRequired
                        isInvalid={!!validationErrors.jobFunction}
                        errorMessage={validationErrors.jobFunction}
                        selectedKeys={
                          formData.jobFunction ? [formData.jobFunction] : []
                        }
                        onSelectionChange={(keys) => {
                          if (keys instanceof Set && keys.size > 0) {
                            handleInputChange(
                              "jobFunction",
                              Array.from(keys)[0]
                            );
                          }
                        }}
                        description="Your main professional field"
                        isDisabled={isSubmitting}
                      >
                        {Object.entries(jobFunctionsByCategory).map(
                          ([category, functions]) => (
                            <SelectSection key={category} title={category}>
                              {functions.map((func) => (
                                <SelectItem key={func}>{func}</SelectItem>
                              ))}
                            </SelectSection>
                          )
                        )}
                      </Select>
                    </div>
                  </div>

                  <Divider className="my-2" />

                  {/* Time Period Section */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Time Period</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-small font-medium text-foreground mb-1.5">
                          Start Date <span className="text-danger">*</span>
                        </label>
                        <DatePicker
                          aria-label="Start Date"
                          isRequired
                          isInvalid={!!validationErrors.startDate}
                          errorMessage={validationErrors.startDate}
                          maxValue={today(getLocalTimeZone())}
                          value={parseAbsoluteToLocal(
                            formData.startDate.toISOString()
                          )}
                          onChange={(date) =>
                            handleDateChange(date, "startDate")
                          }
                          showMonthAndYearPickers
                          isDisabled={isSubmitting}
                          hideTimeZone
                          granularity="day"
                          classNames={{
                            base: "w-full",
                          }}
                        />
                        <p className="text-tiny text-default-500 mt-1">
                          When you started this position
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
                              ? parseAbsoluteToLocal(
                                  formData.endDate.toISOString()
                                )
                              : undefined
                          }
                          onChange={(date) => handleDateChange(date, "endDate")}
                          maxValue={today(getLocalTimeZone())}
                          isDisabled={formData.current || isSubmitting}
                          showMonthAndYearPickers
                          hideTimeZone
                          granularity="day"
                          classNames={{
                            base: "w-full",
                          }}
                        />
                        <p className="text-tiny text-default-500 mt-1">
                          {formData.current
                            ? "Not required for current positions"
                            : "When you left this position"}
                        </p>
                      </div>

                      <div className="col-span-2 mt-1">
                        <Checkbox
                          isSelected={formData.current}
                          onValueChange={(checked) =>
                            handleInputChange("current", checked)
                          }
                          isDisabled={isSubmitting}
                        >
                          I currently work here
                        </Checkbox>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-2" />

                  {/* Description Section */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Description</h3>
                    <Textarea
                      placeholder="Describe your responsibilities, achievements, and skills utilized in this role. Consider including key projects, metrics, and outcomes."
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      minRows={3}
                      maxRows={5}
                      isDisabled={isSubmitting}
                      description="Highlight your key responsibilities and accomplishments"
                      classNames={{
                        base: "w-full",
                        inputWrapper: "min-h-[100px]",
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        Use bullet points by starting lines with • or - for
                        better readability
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.description?.length || 0}/3000
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t px-6 py-4">
                <Button
                  variant="light"
                  onPress={handleCloseModal}
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
                  {editingExperience ? "Update Experience" : "Save Experience"}
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
        className="max-w-md"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b px-6 py-4">
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody className="py-6 px-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-danger/10 p-3 flex-shrink-0">
                    <AlertCircle size={24} className="text-danger" />
                  </div>
                  <p className="text-gray-700">
                    Are you sure you want to delete this work experience? This
                    action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t px-6 py-4">
                <Button
                  variant="light"
                  onPress={() => !isSubmitting && deleteModal.onClose()}
                  isDisabled={isSubmitting}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                  fullWidth
                >
                  Delete Experience
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
