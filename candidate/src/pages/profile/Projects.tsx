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
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { Plus, Edit2, Trash2, PanelsTopLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { Candidate, Project } from "@shared-types/Candidate";

// Validation schema
const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  domain: z.string().min(1, "Domain is required").max(100),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  associatedWith: z.string().min(1, "Association is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const Projects = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form states
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [startDate, setStartDate] = useState<CalendarDate>(today("IST"));
  const [endDate, setEndDate] = useState<CalendarDate | null>(null);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [associatedWith, setAssociatedWith] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setDomain("");
    setStartDate(today("IST"));
    setEndDate(null);
    setIsCurrentlyWorking(false);
    setAssociatedWith("");
    setDescription("");
    setEditingProject(null);
    setErrors({});
  };

  const validateForm = () => {
    try {
      const projectData: Project = {
        title,
        domain,
        startDate: startDate.toString(),
        endDate: endDate?.toString() || "",
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
        throw new Error("End date is required when not currently working");
      }

      if (endDate && startDate.compare(endDate) > 0) {
        throw new Error("End date must be after start date");
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
      setEditingProject(project);
      setTitle(project.title);
      setDomain(project.domain);
      setStartDate(parseDate(project.startDate?.split("T")[0]));
      setEndDate(project.endDate ? parseDate(project.endDate?.split("T")[0]) : null);
      setIsCurrentlyWorking(project.current);
      setAssociatedWith(project.associatedWith);
      setDescription(project.description);
    }
    onOpen();
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    const validation = validateForm();
    if (!validation.isValid || !validation.data) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingProject) {
        const newProjects = user?.projects?.map((p) =>
          p._id === editingProject._id ? validation.data : p
        );
        setUser({ ...user, projects: newProjects });
      } else {
        setUser({
          ...user,
          projects: [...(user.projects || []), validation.data],
        });
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const handleDelete = (id: string) => {
    try {
      const newProjects = user?.projects?.filter((p) => p._id !== id);
      setUser({ ...user, projects: newProjects });
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const associationOptions = [
    { label: "Personal", value: "personal" },
    { label: "Academic", value: "academic" },
    { label: "Professional", value: "professional" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5"
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/projects">Projects</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <AnimatePresence mode="wait">
          {user?.projects?.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center gap-4 p-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <PanelsTopLeft size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">No Projects Added Yet</h3>
              <p className="text-gray-500">
                Start by adding your first project!
              </p>
              <Button
                onClick={() => handleOpenModal()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl">Projects</h3>
                <Button
                  color="primary"
                  onClick={() => handleOpenModal()}
                  startContent={<Plus size={18} />}
                >
                  Add new
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <AnimatePresence>
                  {user?.projects &&
                    user?.projects?.map((project) => (
                      <motion.div
                        key={project._id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                      >
                        <Card>
                          <CardBody>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{project.title}</h4>
                                <p className="text-sm text-gray-500">
                                  {project.domain}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleOpenModal(project)}
                                >
                                  <Edit2 size={18} />
                                </Button>
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  color="danger"
                                  onClick={() =>
                                    handleDelete(project._id || "")
                                  }
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm">{project.description}</p>
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingProject ? "Edit Project" : "Add New Project"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Project Title"
                    placeholder="Enter Project Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                  />
                  <Input
                    label="Project Domain"
                    placeholder="Enter Project domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    isInvalid={!!errors.domain}
                    errorMessage={errors.domain}
                  />
                  <div className="flex gap-4">
                    <DateInput
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                    />
                    <DateInput
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      isDisabled={isCurrentlyWorking}
                    />
                  </div>
                  <Checkbox
                    isSelected={isCurrentlyWorking}
                    onValueChange={setIsCurrentlyWorking}
                  >
                    I am currently working on this project
                  </Checkbox>
                  <Select
                    label="Associated With"
                    placeholder="Select association"
                    value={associatedWith}
                    onChange={(e) => setAssociatedWith(e.target.value)}
                    isInvalid={!!errors.associatedWith}
                    errorMessage={errors.associatedWith}
                  >
                    {associationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    label="Description"
                    placeholder="Enter project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={4}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default Projects;
