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
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  proficiency: string;
}

const initialSkillsList = [
  "React.js",
  "React Native",
  "React",
  "Reactive",
  "Reactor",
  "REACH Compliance",
  "Reaction Engineering",
  "Reaction Kinetics",
  "Reactor Design",
];

const proficiencyLevels = [
  "Beginner",
  "Intermediate",
  "Advance",
  "Professional",
];

const Skills = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCustomSkillModalOpen,
    onOpen: onCustomSkillOpen,
    onClose: onCustomSkillClose,
  } = useDisclosure();

  const [selectedCategory, setSelectedCategory] = useState<
    "technical" | "languages" | "subjects" | null
  >(null);
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
  const [languageSkills, setLanguageSkills] = useState<Skill[]>([]);
  const [subjectSkills, setSubjectSkills] = useState<Skill[]>([]);
  const [skillsList, setSkillsList] = useState(initialSkillsList);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedProficiency, setSelectedProficiency] = useState<string | null>(
    null
  );
  const [customSkill, setCustomSkill] = useState("");

  const handleAddCustomSkill = () => {
    if (customSkill && !skillsList.includes(customSkill)) {
      setSkillsList([...skillsList, customSkill]);
      setSelectedSkill(customSkill);
      setCustomSkill("");
      onCustomSkillClose();
      toast.success("Custom skill added.");
    } else {
      toast.error("Please enter a valid and unique skill name.");
    }
  };

  const validateInputs = () => {
    if (!selectedSkill) {
      toast.error("Please select or add a skill.");
      return false;
    }
    if (!selectedProficiency) {
      toast.error("Please select a proficiency level.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateInputs()) {
      const newSkill = {
        id: Date.now().toString(),
        name: selectedSkill!,
        proficiency: selectedProficiency!,
      };

      if (selectedCategory === "technical") {
        setTechnicalSkills([...technicalSkills, newSkill]);
      } else if (selectedCategory === "languages") {
        setLanguageSkills([...languageSkills, newSkill]);
      } else if (selectedCategory === "subjects") {
        setSubjectSkills([...subjectSkills, newSkill]);
      }

      setSelectedSkill(null);
      setSelectedProficiency(null);
      onClose();
      toast.success("Skill added successfully.");
    }
  };

  const handleDelete = (
    id: string,
    category: "technical" | "languages" | "subjects"
  ) => {
    if (category === "technical") {
      setTechnicalSkills(technicalSkills.filter((skill) => skill.id !== id));
    } else if (category === "languages") {
      setLanguageSkills(languageSkills.filter((skill) => skill.id !== id));
    } else if (category === "subjects") {
      setSubjectSkills(subjectSkills.filter((skill) => skill.id !== id));
    }
    toast.success("Skill removed successfully.");
  };

  const handleModalClose = () => {
    setSelectedSkill(null);
    setSelectedProficiency(null);
    onClose();
  };

  const memoizedSkillsList = useMemo(() => skillsList, [skillsList]);

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/skills">Skills</BreadcrumbItem>
      </Breadcrumbs>

      <div className="space-y-8 mt-5">
        {/* Technical Skills Card */}
        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h4>Technical Skills</h4>
              <Button
                onClick={() => {
                  setSelectedCategory("technical");
                  onOpen();
                }}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </div>
            {technicalSkills.length === 0 ? (
              <p className="text-default-500">
                You have not added any Technical Skills yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      onClose={() => handleDelete(skill.id, "technical")}
                      variant="flat"
                      className="py-3 px-3"
                    >
                      {skill.name} • {skill.proficiency}
                    </Chip>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Languages Card */}
        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h4>Languages</h4>
              <Button
                onClick={() => {
                  setSelectedCategory("languages");
                  onOpen();
                }}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </div>
            {languageSkills.length === 0 ? (
              <p className="text-default-500">
                You have not added any Languages yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {languageSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      onClose={() => handleDelete(skill.id, "languages")}
                      variant="flat"
                    >
                      {skill.name} • {skill.proficiency}
                    </Chip>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Subjects Card */}
        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h4>Subjects</h4>
              <Button
                onClick={() => {
                  setSelectedCategory("subjects");
                  onOpen();
                }}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </div>
            {subjectSkills.length === 0 ? (
              <p className="text-default-500">
                You have not added any Subjects yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjectSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      onClose={() => handleDelete(skill.id, "subjects")}
                      variant="flat"
                    >
                      {skill.name} • {skill.proficiency}
                    </Chip>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Main Skill Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalContent>
          <ModalHeader>Add New Skill</ModalHeader>
          <ModalBody>
            <Select
              label="Select a Skill"
              placeholder="Select a skill or add a custom skill"
              selectedKeys={selectedSkill ? [selectedSkill] : []}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              {memoizedSkillsList.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Select Proficiency"
              placeholder="Select proficiency level"
              selectedKeys={selectedProficiency ? [selectedProficiency] : []}
              onChange={(e) => setSelectedProficiency(e.target.value)}
            >
              {proficiencyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </Select>
            <Button variant="light" onPress={onCustomSkillOpen}>
              Add Custom Skill
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Custom Skill Modal */}
      <Modal isOpen={isCustomSkillModalOpen} onClose={onCustomSkillClose}>
        <ModalContent>
          <ModalHeader>Add Custom Skill</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter custom skill name"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              fullWidth
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onCustomSkillClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddCustomSkill}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Skills;
