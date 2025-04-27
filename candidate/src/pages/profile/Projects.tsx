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
  Textarea,
  Checkbox,
  Select,
  SelectItem,
  Card,
  CardBody,
  DatePicker,
  Divider,
  Chip,
  Tooltip,
  Badge,
  Skeleton,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Briefcase,
  GraduationCap,
  User,
  LinkIcon,
  Code,
  Clock,
  AlertCircle,
  ExternalLink,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  ZonedDateTime,
} from "@internationalized/date";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { Candidate, Project } from "@shared-types/Candidate";

// Validation schema with improved error messages
const ProjectSchema = z
  .object({
    title: z
      .string()
      .min(1, "Project title is required")
      .max(100, "Title cannot exceed 100 characters"),
    domain: z
      .string()
      .min(1, "Project domain is required")
      .max(100, "Domain cannot exceed 100 characters"),
    startDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Invalid start date format",
    }),
    endDate: z
      .date({
        invalid_type_error: "Invalid end date format",
      })
      .optional()
      .nullable(),
    current: z.boolean(),
    associatedWith: z.enum(["personal", "academic", "professional"], {
      errorMap: () => ({ message: "Please select a valid association type" }),
    }),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description cannot exceed 500 characters"),
    url: z
      .string()
      .url("Please enter a valid URL")
      .or(z.string().max(0))
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
      message: "End date is required when not currently working on the project",
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
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type ProjectFormData = z.infer<typeof ProjectSchema>;

const Projects = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("personal");

  // Form states
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    domain: "",
    startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    endDate: null,
    current: false,
    associatedWith: "personal",
    description: "",
    url: "",
  });

  // Initialize projects array if undefined
  useEffect(() => {
    if (!user.projects) {
      setUser({ ...user, projects: [] });
    }
  }, [user, setUser]);

  // Reset error when input changes
  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user makes a change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      domain: "",
      startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      endDate: null,
      current: false,
      associatedWith: "personal",
      description: "",
      url: "",
    });
    setErrors({});
  };

  const validateForm = (): {
    isValid: boolean;
    data: ProjectFormData | null;
  } => {
    try {
      ProjectSchema.parse(formData);
      setErrors({});
      return { isValid: true, data: formData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      return { isValid: false, data: null };
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      // Editing existing project
      setEditingProject(project._id || null);
      setFormData({
        title: project.title,
        domain: project.domain,
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : null,
        current: project.current,
        associatedWith: project.associatedWith,
        description: project.description,
        url: project.url || "",
      });
    } else {
      // Adding new project
      resetForm();
      setEditingProject(null);
    }
    onOpen();
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const validation = validateForm();

    if (!validation.isValid || !validation.data) {
      setIsSubmitting(false);
      return;
    }

    try {
      const projectData = validation.data;

      // Create project object with proper typing
      const newProject: Project = {
        title: projectData.title,
        domain: projectData.domain,
        startDate: projectData.startDate,
        endDate: projectData.current
          ? undefined
          : projectData.endDate || undefined,
        current: projectData.current,
        associatedWith: projectData.associatedWith,
        description: projectData.description,
        url: projectData.url || undefined,
      };

      if (editingProject) {
        // Update existing project
        const newProjects = (user?.projects || []).map((p) =>
          p._id === editingProject ? { ...newProject, _id: editingProject } : p
        );

        setUser({ ...user, projects: newProjects });
        toast.success("Project updated successfully");
      } else {
        // Add new project with temporary ID and creation timestamp
        const projectWithId: Project = {
          ...newProject,
          createdAt: new Date(),
        };

        setUser({
          ...user,
          projects: [...(user.projects || []), projectWithId],
        });
        toast.success("Project added successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to save project");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!projectToDelete) return;
    setIsSubmitting(true);

    try {
      const newProjects = (user?.projects || []).filter(
        (p) => p._id !== projectToDelete
      );
      setUser({ ...user, projects: newProjects });
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      setProjectToDelete(null);
      setIsConfirmDeleteOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (field === "startDate") {
      handleInputChange("startDate", dateObj);

      // If end date is before new start date, clear end date
      if (formData.endDate && dateObj > formData.endDate) {
        handleInputChange("endDate", null);
      }
    } else {
      handleInputChange("endDate", dateObj);
    }
  };

  const getAssociationIcon = (type: string) => {
    switch (type) {
      case "personal":
        return <User size={16} />;
      case "academic":
        return <GraduationCap size={16} />;
      case "professional":
        return <Briefcase size={16} />;
      default:
        return null;
    }
  };

  const getAssociationColor = (
    type: string
  ): "default" | "primary" | "success" => {
    switch (type) {
      case "personal":
        return "default";
      case "academic":
        return "primary";
      case "professional":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  };

  const associationOptions = [
    { label: "Personal", value: "personal", icon: <User size={16} /> },
    { label: "Academic", value: "academic", icon: <GraduationCap size={16} /> },
    {
      label: "Professional",
      value: "professional",
      icon: <Briefcase size={16} />,
    },
  ];

  // Filter and sort projects
  const filteredProjects = (user?.projects || [])
    .filter((p) => activeTab === "all" || p.associatedWith === activeTab)
    .sort((a, b) => {
      // Sort by current first, then by start date (newest first)
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

  // Count projects by type
  const projectCounts = {
    all: (user?.projects || []).length,
    personal: (user?.projects || []).filter(
      (p) => p.associatedWith === "personal"
    ).length,
    academic: (user?.projects || []).filter(
      (p) => p.associatedWith === "academic"
    ).length,
    professional: (user?.projects || []).filter(
      (p) => p.associatedWith === "professional"
    ).length,
  };

  const renderEmptyState = () => (
    <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
      <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
        <div className="bg-primary-50 p-5 rounded-full">
          <Briefcase size={36} className="text-primary" />
        </div>
        <div className="text-center max-w-lg">
          <h3 className="text-xl font-medium mb-2">No Projects Added Yet</h3>
          <p className="text-gray-600 mb-6">
            Projects showcase your skills and experience. Add details about
            personal, academic, or professional projects you've worked on.
          </p>
          <Button
            color="primary"
            onClick={() => handleOpenModal()}
            startContent={<Plus size={18} />}
            size="lg"
          >
            Add Your First Project
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Projects</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            Showcase your development projects and achievements
          </p>
        </div>
        {!isLoading && (user?.projects?.length ?? 0) > 0 && (
          <Button
            color="primary"
            onClick={() => handleOpenModal()}
            startContent={<Plus size={16} />}
          >
            Add Project
          </Button>
        )}
      </div>
      {isLoading ? (
        // Skeleton loader for loading state
        <div className="space-y-4">
          <Skeleton className="w-full h-32 rounded-lg" />
          <Skeleton className="w-full h-32 rounded-lg" />
        </div>
      ) : !user?.projects?.length ? (
        renderEmptyState()
      ) : (
        <>
          {/* Project type filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeTab === "all" ? "flat" : "light"}
              color={activeTab === "all" ? "primary" : "default"}
              onClick={() => setActiveTab("all")}
              className="px-3"
            >
              All
              <Badge color="default" shape="circle">
                {projectCounts.all}
              </Badge>
            </Button>

            <Button
              variant={activeTab === "personal" ? "flat" : "light"}
              color={activeTab === "personal" ? "default" : "default"}
              onClick={() => setActiveTab("personal")}
              startContent={<User size={14} />}
              className="px-3"
            >
              Personal
              <Badge color="default" shape="circle">
                {projectCounts.personal}
              </Badge>
            </Button>

            <Button
              variant={activeTab === "academic" ? "flat" : "light"}
              color={activeTab === "academic" ? "primary" : "default"}
              onClick={() => setActiveTab("academic")}
              startContent={<GraduationCap size={14} />}
              className="px-3"
            >
              Academic
              <Badge color="primary" shape="circle">
                {projectCounts.academic}
              </Badge>
            </Button>

            <Button
              variant={activeTab === "professional" ? "flat" : "light"}
              color={activeTab === "professional" ? "success" : "default"}
              onClick={() => setActiveTab("professional")}
              startContent={<Briefcase size={14} />}
              className="px-3"
            >
              Professional
              <Badge color="success" shape="circle">
                {projectCounts.professional}
              </Badge>
            </Button>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No {activeTab !== "all" ? activeTab : ""} projects found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project._id} className="w-full shadow-sm">
                  <CardBody className="p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="space-y-3 flex-grow">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              {project.title}
                            </h3>
                            {project.current && (
                              <Chip
                                color="success"
                                variant="flat"
                                startContent={<Clock size={12} />}
                              >
                                Current
                              </Chip>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Code size={14} className="text-gray-400" />
                            <p className="text-sm text-gray-500">
                              {project.domain}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            {formatDate(project.startDate)} -{" "}
                            {project.current
                              ? "Present"
                              : formatDate(project.endDate)}
                          </span>
                        </div>

                        <Chip
                          startContent={getAssociationIcon(
                            project.associatedWith
                          )}
                          variant="flat"
                          color={getAssociationColor(project.associatedWith)}
                        >
                          {project.associatedWith.charAt(0).toUpperCase() +
                            project.associatedWith.slice(1)}
                        </Chip>

                        <Divider className="my-3" />

                        <p className="text-sm whitespace-pre-wrap">
                          {project.description}
                        </p>

                        {project.url && (
                          <div className="mt-3">
                            <Button
                              as="a"
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="flat"
                              color="primary"
                              startContent={<ExternalLink size={14} />}
                            >
                              View Project
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 self-start">
                        <Tooltip content="Edit project">
                          <Button
                            isIconOnly
                            variant="light"
                            onClick={() => handleOpenModal(project)}
                            aria-label="Edit project"
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete project" color="danger">
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onClick={() => confirmDelete(project._id || "")}
                            aria-label="Delete project"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      {/* Project Form Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-primary" />
                  <h3 className="text-lg">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  {editingProject
                    ? "Update the details of your project"
                    : "Add information about your personal, academic, or professional project"}
                </p>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Project Title"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                    startContent={<Star size={16} className="text-gray-400" />}
                    description="Name of your project"
                  />

                  <Input
                    label="Project Domain"
                    placeholder="E.g., Web Development, Machine Learning"
                    value={formData.domain}
                    onChange={(e) =>
                      handleInputChange("domain", e.target.value)
                    }
                    isInvalid={!!errors.domain}
                    errorMessage={errors.domain}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                    startContent={<Code size={16} className="text-gray-400" />}
                    description="Field or technology area of the project"
                  />

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
                      isDisabled={isSubmitting}
                      isInvalid={!!errors.startDate}
                      errorMessage={errors.startDate}
                      hideTimeZone
                      granularity="day"
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      When you started working on this project
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
                      granularity="day"
                      value={
                        formData.endDate
                          ? parseAbsoluteToLocal(formData.endDate.toISOString())
                          : undefined
                      }
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={formData.current || isSubmitting}
                      onChange={(date) => handleDateChange(date, "endDate")}
                      isInvalid={!!errors.endDate}
                      errorMessage={errors.endDate}
                      hideTimeZone
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      {formData.current
                        ? "Not required for current projects"
                        : "When you completed this project"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <Checkbox
                      isSelected={formData.current}
                      onValueChange={(value) =>
                        handleInputChange("current", value)
                      }
                      isDisabled={isSubmitting}
                    >
                      I am currently working on this project
                    </Checkbox>
                  </div>

                  <Select
                    label="Associated With"
                    placeholder="Select association type"
                    selectedKeys={[formData.associatedWith]}
                    onSelectionChange={(keys) => {
                      if (
                        Array.from(keys).includes("academic") ||
                        Array.from(keys).includes("professional") ||
                        Array.from(keys).includes("personal")
                      ) {
                        handleInputChange(
                          "associatedWith",
                          Array.from(keys)[0]
                        );
                      }
                    }}
                    isInvalid={!!errors.associatedWith}
                    errorMessage={errors.associatedWith}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                    description="Category that best describes this project"
                  >
                    {associationOptions.map((option) => (
                      <SelectItem key={option.value} startContent={option.icon}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Project URL (Optional)"
                    placeholder="https://github.com/username/project"
                    value={formData.url || ""}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    isInvalid={!!errors.url}
                    errorMessage={errors.url}
                    isDisabled={isSubmitting}
                    className="col-span-2"
                    startContent={
                      <LinkIcon size={16} className="text-gray-400" />
                    }
                    description="Link to GitHub repository, demo, or any relevant website"
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe your project, responsibilities, and technologies used"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    minRows={3}
                    maxRows={5}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                    description="Details about the project's purpose, your role, and technologies used"
                  />

                  <div className="col-span-2 flex justify-between">
                    <p className="text-xs text-gray-500">
                      {formData.description.length}/500 characters
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  color="danger"
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
                  {editingProject ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Confirmation Modal for Delete */}
      <Modal
        isDismissable={false}
        isOpen={isConfirmDeleteOpen}
        onClose={() => !isSubmitting && setIsConfirmDeleteOpen(false)}
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
                    Are you sure you want to delete this project? This action
                    cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  variant="light"
                  onPress={() => !isSubmitting && setIsConfirmDeleteOpen(false)}
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

export default Projects;
