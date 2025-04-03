import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Card,
  CardBody,
  Chip,
  Input,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Candidate } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Define schema for validation
const skillSchema = z.object({
  name: z.string().min(2, "Skill name must be at least 2 characters"),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Professional"]),
});

// Type definitions for better type safety
type SkillCategory = "technical" | "languages" | "subjects";
type ProficiencyLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Professional";
type SkillFormData = {
  name: string;
  proficiency: ProficiencyLevel | null;
};

// Initial data
const initialSkillsList = [
  "React.js",
  "React Native",
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "C++",
  "C#",
];

const proficiencyLevels: ProficiencyLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced", // Fixed typo from "Advance" to "Advanced"
  "Professional",
];

const Skills = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCustomSkillModalOpen,
    onOpen: onCustomSkillOpen,
    onClose: onCustomSkillClose,
  } = useDisclosure();

  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory | null>(null);
  const [skillsList, setSkillsList] = useState(initialSkillsList);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    proficiency: null,
  });
  const [customSkill, setCustomSkill] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    proficiency?: string;
  }>({});

  // Reset form data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", proficiency: null });
      setFormErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors: { name?: string; proficiency?: string } = {};

    if (!formData.name) {
      errors.name = "Please select or add a skill";
    }

    if (!formData.proficiency) {
      errors.proficiency = "Please select a proficiency level";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomSkill = () => {
    try {
      // Validate custom skill name
      const trimmedSkill = customSkill.trim();
      skillSchema.shape.name.parse(trimmedSkill);

      if (skillsList.includes(trimmedSkill)) {
        toast.error("This skill already exists in the list.");
        return;
      }

      // Add to skills list and select it
      setSkillsList((prev) => [...prev, trimmedSkill]);
      setFormData({ ...formData, name: trimmedSkill });
      setCustomSkill("");
      onCustomSkillClose();
      toast.success("Custom skill added.");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to add custom skill.");
      }
    }
  };

  const getProficiencyNumber = (
    proficiency: ProficiencyLevel | null
  ): number => {
    switch (proficiency) {
      case "Beginner":
        return 1;
      case "Intermediate":
        return 2;
      case "Advanced":
        return 3;
      case "Professional":
        return 4;
      default:
        return 1;
    }
  };

  const getProficiencyLabel = (level: number): string => {
    switch (level) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      case 4:
        return "Professional";
      default:
        return "Beginner";
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (!selectedCategory || !formData.name || !formData.proficiency) {
        toast.error("Missing required information.");
        return;
      }

      // Create a copy of the user object to avoid direct state mutations
      const updatedUser = { ...user };

      if (selectedCategory === "technical") {
        const newSkill = {
          _id: Date.now().toString(), // Temporary ID for new items
          skill: formData.name,
          proficiency: getProficiencyNumber(formData.proficiency),
        };
        updatedUser.technicalSkills = [
          ...(updatedUser.technicalSkills || []),
          newSkill,
        ];
      } else if (selectedCategory === "languages") {
        const newSkill = {
          _id: Date.now().toString(),
          language: formData.name,
          proficiency: getProficiencyNumber(formData.proficiency),
        };
        updatedUser.languages = [...(updatedUser.languages || []), newSkill];
      } else if (selectedCategory === "subjects") {
        const newSkill = {
          _id: Date.now().toString(),
          subject: formData.name,
          proficiency: getProficiencyNumber(formData.proficiency),
        };
        updatedUser.subjects = [...(updatedUser.subjects || []), newSkill];
      }

      setUser(updatedUser);
      onClose();
      toast.success("Skill added successfully.");
    } catch (error) {
      toast.error("Failed to add skill. Please try again.");
    }
  };

  const handleDelete = (id: string, category: SkillCategory) => {
    try {
      const updatedUser = { ...user };

      if (category === "technical") {
        updatedUser.technicalSkills =
          updatedUser.technicalSkills?.filter((item) => item._id !== id) || [];
      } else if (category === "languages") {
        updatedUser.languages =
          updatedUser.languages?.filter((item) => item._id !== id) || [];
      } else if (category === "subjects") {
        updatedUser.subjects =
          updatedUser.subjects?.filter((item) => item._id !== id) || [];
      }

      setUser(updatedUser);
      toast.success("Skill removed successfully.");
    } catch (error) {
      toast.error("Failed to remove skill. Please try again.");
    }
  };

  const renderSkillList = (
    category: SkillCategory,
    items: Array<any> | undefined,
    labelKey: string
  ) => {
    if (!items || items.length === 0) {
      return (
        <p className="text-default-500 my-3">
          You have not added any{" "}
          {category === "technical"
            ? "Technical Skills"
            : category === "languages"
            ? "Languages"
            : "Subjects"}{" "}
          yet.
        </p>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Chip
            key={item._id}
            onClose={() => handleDelete(item._id as string, category)}
            variant="flat"
            className="py-2 px-3"
            color="primary"
            size="md"
          >
            {item[labelKey]} • {getProficiencyLabel(item.proficiency)}
          </Chip>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/skills">Skills</BreadcrumbItem>
      </Breadcrumbs>

      <div className="space-y-6">
        {/* Technical Skills Card */}
        <Card shadow="sm">
          <CardBody className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Technical Skills</h3>
              <Button
                onClick={() => {
                  setSelectedCategory("technical");
                  onOpen();
                }}
                startContent={<Plus size={18} />}
                color="primary"
                variant="flat"
                size="sm"
              >
                Add Skill
              </Button>
            </div>
            {renderSkillList("technical", user.technicalSkills, "skill")}
          </CardBody>
        </Card>

        {/* Languages Card */}
        <Card shadow="sm">
          <CardBody className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Languages</h3>
              <Button
                onClick={() => {
                  setSelectedCategory("languages");
                  onOpen();
                }}
                startContent={<Plus size={18} />}
                color="primary"
                variant="flat"
                size="sm"
              >
                Add Language
              </Button>
            </div>
            {renderSkillList("languages", user.languages, "language")}
          </CardBody>
        </Card>

        {/* Subjects Card */}
        <Card shadow="sm">
          <CardBody className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Subjects</h3>
              <Button
                onClick={() => {
                  setSelectedCategory("subjects");
                  onOpen();
                }}
                startContent={<Plus size={18} />}
                color="primary"
                variant="flat"
                size="sm"
              >
                Add Subject
              </Button>
            </div>
            {renderSkillList("subjects", user.subjects, "subject")}
          </CardBody>
        </Card>
      </div>

      {/* Main Skill Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          body: "py-6",
          backdrop: "bg-[rgba(0,0,0,0.5)]",
          base: "border-0 shadow-lg",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New{" "}
            {selectedCategory === "technical"
              ? "Technical Skill"
              : selectedCategory === "languages"
              ? "Language"
              : "Subject"}
          </ModalHeader>
          <ModalBody>
            <Select
              label="Select a Skill"
              placeholder="Choose from list or add custom"
              selectedKeys={formData.name ? [formData.name] : []}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isInvalid={!!formErrors.name}
              errorMessage={formErrors.name}
              className="mb-4"
            >
              {skillsList.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Proficiency Level"
              placeholder="Select your proficiency level"
              selectedKeys={formData.proficiency ? [formData.proficiency] : []}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proficiency: e.target.value as ProficiencyLevel,
                })
              }
              isInvalid={!!formErrors.proficiency}
              errorMessage={formErrors.proficiency}
              className="mb-4"
            >
              {proficiencyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </Select>
            <Button
              variant="light"
              onPress={onCustomSkillOpen}
              className="text-primary"
            >
              Add Custom Skill
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Custom Skill Modal */}
      <Modal
        isOpen={isCustomSkillModalOpen}
        onClose={onCustomSkillClose}
        classNames={{
          backdrop: "bg-[rgba(0,0,0,0.5)]",
          base: "border-0 shadow-lg",
        }}
      >
        <ModalContent>
          <ModalHeader>Add Custom Skill</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter skill name"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              fullWidth
              label="Custom Skill Name"
              type="text"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddCustomSkill();
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onCustomSkillClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddCustomSkill}>
              Add Skill
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Skills;
