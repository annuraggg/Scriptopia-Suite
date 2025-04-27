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
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Divider,
  Tooltip,
  Badge,
  Skeleton,
} from "@heroui/react";
import {
  Plus,
  Code,
  Globe,
  BookOpen,
  Star,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Candidate } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

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

interface CategoryData {
  icon: JSX.Element;
  title: string;
  description: string;
  placeholder: string;
  color: "primary" | "success" | "warning";
  buttonText: string;
}

// Initial skill lists by category
const skillsData = {
  technical: [
    "React.js",
    "React Native",
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
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "Firebase",
    "GraphQL",
    "REST API",
    "Redux",
    "Angular",
    "Vue.js",
  ],
  languages: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Hindi",
    "Arabic",
    "Portuguese",
    "Russian",
    "Italian",
    "Korean",
    "Dutch",
    "Swedish",
    "Turkish",
    "Thai",
  ],
  subjects: [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Business",
    "Literature",
    "History",
    "Psychology",
    "Sociology",
    "Marketing",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Statistics",
  ],
};

const proficiencyLevels: ProficiencyLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];

// Category metadata
const categoryInfo: Record<SkillCategory, CategoryData> = {
  technical: {
    icon: <Code />,
    title: "Technical Skills",
    description: "Programming languages, frameworks, tools, and technologies",
    placeholder: "Choose a technical skill",
    color: "primary",
    buttonText: "Add Skill",
  },
  languages: {
    icon: <Globe />,
    title: "Languages",
    description: "Human languages you can read, write, or speak",
    placeholder: "Select a language",
    color: "success",
    buttonText: "Add Language",
  },
  subjects: {
    icon: <BookOpen />,
    title: "Subjects",
    description: "Academic and professional fields of knowledge",
    placeholder: "Select a subject",
    color: "warning",
    buttonText: "Add Subject",
  },
};

const Skills = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: onConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
  } = useDisclosure();

  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategory | null>(null);
  const [skillsList] = useState<Record<SkillCategory, string[]>>({
    technical: skillsData.technical,
    languages: skillsData.languages,
    subjects: skillsData.subjects,
  });

  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    proficiency: null,
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    proficiency?: string;
  }>({});

  const [skillToDelete, setSkillToDelete] = useState<{
    id: string;
    name: string;
    category: SkillCategory;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", proficiency: null });
      setFormErrors({});
    }
  }, [isOpen]);

  // Initialize empty arrays for skills if they don't exist
  useEffect(() => {
    const updatedUser = { ...user };
    let hasChanges = false;

    if (!updatedUser.technicalSkills) {
      updatedUser.technicalSkills = [];
      hasChanges = true;
    }

    if (!updatedUser.languages) {
      updatedUser.languages = [];
      hasChanges = true;
    }

    if (!updatedUser.subjects) {
      updatedUser.subjects = [];
      hasChanges = true;
    }

    if (hasChanges && setUser) {
      setUser(updatedUser);
    }
  }, [user, setUser]);

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

  const getProficiencyColor = (
    level: number
  ): "default" | "primary" | "success" | "warning" | "danger" => {
    switch (level) {
      case 1:
        return "default";
      case 2:
        return "primary";
      case 3:
        return "success";
      case 4:
        return "warning";
      default:
        return "default";
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!selectedCategory || !formData.name || !formData.proficiency) {
        toast.error("Missing required information.");
        setIsSubmitting(false);
        return;
      }

      // Check if skill already exists in the user's skills
      let isDuplicate = false;

      if (selectedCategory === "technical" && user.technicalSkills) {
        isDuplicate = user.technicalSkills.some(
          (item) => item.skill.toLowerCase() === formData.name.toLowerCase()
        );
      } else if (selectedCategory === "languages" && user.languages) {
        isDuplicate = user.languages.some(
          (item) => item.language.toLowerCase() === formData.name.toLowerCase()
        );
      } else if (selectedCategory === "subjects" && user.subjects) {
        isDuplicate = user.subjects.some(
          (item) => item.subject.toLowerCase() === formData.name.toLowerCase()
        );
      }

      if (isDuplicate) {
        toast.error(
          `This ${
            selectedCategory === "languages" ? "language" : "skill"
          } is already in your profile.`
        );
        setIsSubmitting(false);
        return;
      }

      // Create a copy of the user object to avoid direct state mutations
      const updatedUser = { ...user };

      if (selectedCategory === "technical") {
        const newSkill = {
          skill: formData.name,
          proficiency: getProficiencyNumber(formData.proficiency),
        };
        updatedUser.technicalSkills = [
          ...(updatedUser.technicalSkills || []),
          newSkill,
        ];
      } else if (selectedCategory === "languages") {
        const newSkill = {
          language: formData.name,
          proficiency: getProficiencyNumber(formData.proficiency),
        };
        updatedUser.languages = [...(updatedUser.languages || []), newSkill];
      } else if (selectedCategory === "subjects") {
        const newSkill = {
          subject: formData.name,
          proficiency: getProficiencyNumber(formData.proficiency),
        };
        updatedUser.subjects = [...(updatedUser.subjects || []), newSkill];
      }

      setUser(updatedUser);
      onClose();
      toast.success(
        `${
          selectedCategory === "languages" ? "Language" : "Skill"
        } added successfully.`
      );
    } catch (error) {
      toast.error(
        `Failed to add ${
          selectedCategory === "languages" ? "language" : "skill"
        }. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, name: string, category: SkillCategory) => {
    setSkillToDelete({ id, name, category });
    onConfirmDeleteOpen();
  };

  const handleDelete = () => {
    if (!skillToDelete) return;

    setIsSubmitting(true);

    try {
      const { id, category } = skillToDelete;
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
      toast.success(
        `${
          category === "languages" ? "Language" : "Skill"
        } removed successfully.`
      );
    } catch (error) {
      toast.error(
        `Failed to remove ${
          skillToDelete.category === "languages" ? "language" : "skill"
        }. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
      setSkillToDelete(null);
      onConfirmDeleteClose();
    }
  };

  // Filter skills based on input text
  const filterSkills = (category: SkillCategory, inputText: string = "") => {
    if (!inputText) return skillsList[category];

    return skillsList[category].filter((skill) =>
      skill.toLowerCase().includes(inputText.toLowerCase())
    );
  };

  const renderSkillList = (
    category: SkillCategory,
    items: Array<any> | undefined,
    labelKey: string
  ) => {
    if (isLoading) {
      return (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-full" />
          ))}
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <p className="text-default-500 my-3">
          You have not added any{" "}
          {category === "technical"
            ? "technical skills"
            : category === "languages"
            ? "languages"
            : "subjects"}{" "}
          yet.
        </p>
      );
    }

    // Sort by proficiency level (highest first)
    const sortedItems = [...items].sort(
      (a, b) => b.proficiency - a.proficiency
    );

    return (
      <div className="flex flex-wrap gap-2">
        {sortedItems.map((item) => {
          const profLevel = item.proficiency;
          const profLabel = getProficiencyLabel(profLevel);
          const profColor = getProficiencyColor(profLevel);

          return (
            <Chip
              key={item._id}
              onClose={() =>
                confirmDelete(item._id as string, item[labelKey], category)
              }
              variant="flat"
              className="py-2 px-3"
              color={profColor}
              size="md"
              startContent={
                profLevel >= 3 ? (
                  <Star size={14} className="text-warning" />
                ) : undefined
              }
            >
              {item[labelKey]} • {profLabel}
            </Chip>
          );
        })}
      </div>
    );
  };

  // Calculate skill totals and proficiency distribution
  const getSkillsStats = () => {
    const technical = user.technicalSkills?.length || 0;
    const languages = user.languages?.length || 0;
    const subjects = user.subjects?.length || 0;
    const total = technical + languages + subjects;

    // Calculate average proficiency
    const allProficiencies = [
      ...(user.technicalSkills || []).map((s) => s.proficiency),
      ...(user.languages || []).map((s) => s.proficiency),
      ...(user.subjects || []).map((s) => s.proficiency),
    ];

    const proficiencyDistribution = {
      Beginner: allProficiencies.filter((p) => p === 1).length,
      Intermediate: allProficiencies.filter((p) => p === 2).length,
      Advanced: allProficiencies.filter((p) => p === 3).length,
      Professional: allProficiencies.filter((p) => p === 4).length,
    };

    return {
      technical,
      languages,
      subjects,
      total,
      proficiencyDistribution,
    };
  };

  const stats = getSkillsStats();

  return (
    <div>
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/skills">
          Skills & Expertise
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Skills & Expertise</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your skills, languages, and subject knowledge
          </p>
        </div>

        {stats.total > 0 && (
          <div className="flex gap-3">
            <Badge content={stats.total} color="primary">
              <Tooltip content="Total skills">
                <Button isIconOnly variant="light" aria-label="Total skills">
                  <MoreHorizontal size={20} />
                </Button>
              </Tooltip>
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Technical Skills Card */}
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center bg-primary-50/30 border-b-1 border-primary-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-100 rounded-md">
                <Code size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                {categoryInfo.technical.title}
              </h3>
              <Badge color="primary" variant="flat">
                {user.technicalSkills?.length || 0}
              </Badge>
            </div>
            <Button
              onClick={() => {
                setSelectedCategory("technical");
                onOpen();
              }}
              startContent={<Plus size={16} />}
              color="primary"
              variant="flat"
            >
              Add Skill
            </Button>
          </CardHeader>

          <CardBody className="p-5">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {categoryInfo.technical.description}
              </p>
            </div>
            {renderSkillList("technical", user.technicalSkills, "skill")}
          </CardBody>
        </Card>

        {/* Languages Card */}
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center bg-success-50/30 border-b-1 border-success-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success-100 rounded-md">
                <Globe size={18} className="text-success" />
              </div>
              <h3 className="text-lg font-semibold">
                {categoryInfo.languages.title}
              </h3>
              <Badge color="success" variant="flat">
                {user.languages?.length || 0}
              </Badge>
            </div>
            <Button
              onClick={() => {
                setSelectedCategory("languages");
                onOpen();
              }}
              startContent={<Plus size={16} />}
              color="success"
              variant="flat"
            >
              Add Language
            </Button>
          </CardHeader>

          <CardBody className="p-5">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {categoryInfo.languages.description}
              </p>
            </div>
            {renderSkillList("languages", user.languages, "language")}
          </CardBody>
        </Card>

        {/* Subjects Card */}
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center bg-warning-50/30 border-b-1 border-warning-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning-100 rounded-md">
                <BookOpen size={18} className="text-warning" />
              </div>
              <h3 className="text-lg font-semibold">
                {categoryInfo.subjects.title}
              </h3>
              <Badge color="warning" variant="flat">
                {user.subjects?.length || 0}
              </Badge>
            </div>
            <Button
              onClick={() => {
                setSelectedCategory("subjects");
                onOpen();
              }}
              startContent={<Plus size={16} />}
              color="warning"
              variant="flat"
            >
              Add Subject
            </Button>
          </CardHeader>

          <CardBody className="p-5">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {categoryInfo.subjects.description}
              </p>
            </div>
            {renderSkillList("subjects", user.subjects, "subject")}
          </CardBody>
        </Card>
      </div>

      {/* Main Skill Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={() => !isSubmitting && onClose()}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 border-b">
            <div className="flex items-center gap-2">
              {selectedCategory && categoryInfo[selectedCategory].icon}
              <span>
                Add New{" "}
                {selectedCategory === "technical"
                  ? "Technical Skill"
                  : selectedCategory === "languages"
                  ? "Language"
                  : "Subject"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {selectedCategory && categoryInfo[selectedCategory].description}
            </p>
          </ModalHeader>
          <ModalBody className="py-3">
            {/* Two column layout: Input on left, Proficiency on right */}
            <div className="flex flex-col">
              {/* Left Column - Input and Suggestions */}
              <div>
                <h3 className="text-medium font-medium mb-2">Name</h3>
                <Input
                  label={
                    selectedCategory === "languages" ? "Language" : "Skill"
                  }
                  placeholder={
                    selectedCategory
                      ? `Type ${
                          selectedCategory === "languages"
                            ? "language"
                            : "skill"
                        } name...`
                      : "Type name..."
                  }
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  isDisabled={isSubmitting}
                />
                {formErrors.name && (
                  <p className="text-danger text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Right Column - Proficiency Selection */}
              <div>
                <h3 className="text-medium font-medium">Proficiency Level</h3>
                <div className="flex gap-2">
                  {proficiencyLevels.map((level) => {
                    const isSelected = formData.proficiency === level;
                    let progressColor:
                      | "default"
                      | "primary"
                      | "success"
                      | "warning" = "default";

                    if (level === "Beginner") {
                      progressColor = "default";
                    } else if (level === "Intermediate") {
                      progressColor = "primary";
                    } else if (level === "Advanced") {
                      progressColor = "success";
                    } else {
                      progressColor = "warning";
                    }

                    return (
                      <Button
                        key={level}
                        variant={isSelected ? "flat" : "bordered"}
                        color={isSelected ? progressColor : "default"}
                        onClick={() =>
                          setFormData({ ...formData, proficiency: level })
                        }
                        className="justify-start w-1/4"
                        isDisabled={isSubmitting}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{level}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                {formErrors.proficiency && (
                  <p className="text-danger text-sm mt-1">
                    {formErrors.proficiency}
                  </p>
                )}
              </div>
            </div>

            {/* Suggestions Section */}
            <div className="mt-3">
              <h3 className="text-sm font-medium mb-2">Suggestions</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {selectedCategory &&
                filterSkills(selectedCategory, formData.name).length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No matching suggestions found
                  </p>
                ) : (
                  selectedCategory &&
                  filterSkills(selectedCategory, formData.name)
                    .slice(0, 20) // Limit to 20 suggestions
                    .map((skill) => (
                      <Chip
                        key={skill}
                        variant={formData.name === skill ? "flat" : "bordered"}
                        color={
                          selectedCategory === "languages"
                            ? "success"
                            : selectedCategory === "subjects"
                            ? "warning"
                            : "primary"
                        }
                        onClick={() =>
                          setFormData({ ...formData, name: skill })
                        }
                        className="cursor-pointer"
                        size="sm"
                      >
                        {skill}
                      </Chip>
                    ))
                )}
              </div>
            </div>
          </ModalBody>
          <Divider />
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
              color={
                selectedCategory === "languages"
                  ? "success"
                  : selectedCategory === "subjects"
                  ? "warning"
                  : "primary"
              }
              onPress={handleSave}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={isConfirmDeleteOpen}
        onClose={() => !isSubmitting && onConfirmDeleteClose()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b">
                <h3>Confirm Delete</h3>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold">{skillToDelete?.name}</span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter className="border-t">
                <Button
                  variant="light"
                  onPress={() => !isSubmitting && onConfirmDeleteClose()}
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

export default Skills;
