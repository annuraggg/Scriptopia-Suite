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
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Briefcase,
  GraduationCap,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { Candidate, Project } from "@shared-types/Candidate";

// Validation schema with appropriate error messages
const ProjectSchema = z.object({
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
});

const Projects = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [associatedWith, setAssociatedWith] = useState("");
  const [description, setDescription] = useState("");

  // Reset error when input changes
  useEffect(() => {
    if (errors.title && title) setErrors((prev) => ({ ...prev, title: "" }));
  }, [title, errors]);

  useEffect(() => {
    if (errors.domain && domain) setErrors((prev) => ({ ...prev, domain: "" }));
  }, [domain, errors]);

  useEffect(() => {
    if (errors.description && description)
      setErrors((prev) => ({ ...prev, description: "" }));
  }, [description, errors]);

  useEffect(() => {
    if (errors.associatedWith && associatedWith)
      setErrors((prev) => ({ ...prev, associatedWith: "" }));
  }, [associatedWith, errors]);

  const resetForm = () => {
    setTitle("");
    setDomain("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setEndDate(null);
    setIsCurrentlyWorking(false);
    setAssociatedWith("");
    setDescription("");
    setEditingProject(null);
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    try {
      const projectData: Project = {
        title,
        domain,
        startDate: new Date(startDate.toString()),
        endDate: endDate ? new Date(endDate.toString()) : undefined,
        current: isCurrentlyWorking,
        associatedWith: associatedWith as
          | "personal"
          | "academic"
          | "professional",
        description,
      };

      ProjectSchema.parse(projectData);

      // Additional date validation
      if (!isCurrentlyWorking && !endDate) {
        setErrors((prev) => ({
          ...prev,
          endDate: "End date is required when not currently working",
        }));
        return { isValid: false, data: null };
      }

      if (endDate && startDate > endDate) {
        setErrors((prev) => ({
          ...prev,
          endDate: "End date must be after start date",
        }));
        return { isValid: false, data: null };
      }

      return { isValid: true, data: projectData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
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
      setEditingProject(project._id || null);
      setTitle(project.title);
      setDomain(project.domain);
      setStartDate(new Date(project.startDate));
      setEndDate(project.endDate ? new Date(project.endDate) : null);
      setIsCurrentlyWorking(project.current);
      setAssociatedWith(project.associatedWith);
      setDescription(project.description);
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
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

      // Add an _id if it's a new project
      if (!editingProject) {
        projectData._id = Date.now().toString();
      }

      if (editingProject) {
        const newProjects = user?.projects?.map((p) =>
          p._id === editingProject ? { ...projectData, _id: editingProject } : p
        );
        setUser({ ...user, projects: newProjects });
        toast.success("Project updated successfully");
      } else {
        setUser({
          ...user,
          projects: [...(user.projects || []), projectData],
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

    try {
      const newProjects = user?.projects?.filter(
        (p) => p._id !== projectToDelete
      );
      setUser({ ...user, projects: newProjects });
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setProjectToDelete(null);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleDateChange = (date: any, field: "startDate" | "endDate") => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (field === "startDate") {
      setStartDate(dateObj);
      // If end date is before new start date, clear end date
      if (endDate && dateObj > endDate) {
        setEndDate(null);
      }
    } else {
      setEndDate(dateObj);
    }

    // Clear related errors
    setErrors((prev) => ({ ...prev, [field]: "" }));
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

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const associationOptions = [
    { label: "Personal", value: "personal" },
    { label: "Academic", value: "academic" },
    { label: "Professional", value: "professional" },
  ];

  const renderEmptyState = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-200 rounded-full">
          <Briefcase size={28} className="text-gray-600" />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2">No Projects Added Yet</h3>
      <p className="text-gray-500 mb-6">
        Showcase your work by adding details about your projects
      </p>
      <Button
        color="primary"
        variant="flat"
        onClick={() => handleOpenModal()}
        startContent={<Plus size={16} />}
      >
        Add your first project
      </Button>
    </div>
  );

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <Breadcrumbs size="sm">
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Projects</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        {user?.projects?.length && user?.projects?.length  > 0 && (
          <Button
            color="primary"
            onClick={() => handleOpenModal()}
            startContent={<Plus size={16} />}
          >
            Add Project
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {!user?.projects?.length ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {user.projects.map((project) => (
              <Card key={project._id} className="w-full shadow-sm">
                <CardBody className="p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="space-y-3 flex-grow">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.domain}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>
                          {formatDate(project.startDate)} -{" "}
                          {project.current
                            ? "Present"
                            : formatDate(project.endDate || "")}
                        </span>
                      </div>

                      <Chip
                        startContent={getAssociationIcon(
                          project.associatedWith
                        )}
                        variant="flat"
                        size="sm"
                        className="mt-1"
                        color={
                          project.associatedWith === "personal"
                            ? "default"
                            : project.associatedWith === "academic"
                            ? "primary"
                            : "success"
                        }
                      >
                        {project.associatedWith.charAt(0).toUpperCase() +
                          project.associatedWith.slice(1)}
                      </Chip>

                      <Divider className="my-3" />

                      <p className="text-sm">{project.description}</p>
                    </div>

                    <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={() => handleOpenModal(project)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="danger"
                        onClick={() => confirmDelete(project._id || "")}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        isDismissable={!isSubmitting}
        hideCloseButton={isSubmitting}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-xl">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Project Title"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                  />

                  <Input
                    label="Project Domain"
                    placeholder="E.g., Web Development, Machine Learning"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    isInvalid={!!errors.domain}
                    errorMessage={errors.domain}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                  />

                  <DatePicker
                    label="Start Date"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(startDate.toISOString())}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    isDisabled={isSubmitting}
                    isRequired
                    isInvalid={!!errors.startDate}
                    errorMessage={errors.startDate}
                  />

                  <DatePicker
                    label="End Date"
                    granularity="day"
                    value={
                      endDate
                        ? parseAbsoluteToLocal(endDate.toISOString())
                        : undefined
                    }
                    maxValue={today(getLocalTimeZone())}
                    isDisabled={isCurrentlyWorking || isSubmitting}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    isInvalid={!!errors.endDate}
                    errorMessage={errors.endDate}
                  />

                  <div className="col-span-2">
                    <Checkbox
                      isSelected={isCurrentlyWorking}
                      onValueChange={setIsCurrentlyWorking}
                      isDisabled={isSubmitting}
                    >
                      I am currently working on this project
                    </Checkbox>
                  </div>

                  <Select
                    label="Associated With"
                    placeholder="Select association type"
                    selectedKeys={associatedWith ? [associatedWith] : []}
                    onChange={(e) => setAssociatedWith(e.target.value)}
                    isInvalid={!!errors.associatedWith}
                    errorMessage={errors.associatedWith}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                  >
                    {associationOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        startContent={getAssociationIcon(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    label="Description"
                    placeholder="Describe your project, responsibilities, and technologies used"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={4}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    isRequired
                    isDisabled={isSubmitting}
                    className="col-span-2"
                    maxLength={500}
                  />

                  {errors.description && (
                    <p className="text-sm text-danger col-span-2">
                      {errors.description}
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
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
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
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

export default Projects;
