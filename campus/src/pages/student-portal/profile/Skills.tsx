import { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react"
import { ChevronDown, ChevronUp, Plus, Pencil } from "lucide-react"

interface Skill {
  name: string;
  level: string;
}

const skillLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

const Skills = () => {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [skills, setSkills] = useState<Skill[]>([
    { name: "Web Design", level: "Intermediate" },
    { name: "MySQL", level: "Intermediate" },
    { name: "UI/UX", level: "Intermediate" },
  ]);
  const [showAll, setShowAll] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSkill = {
      name: formData.get('skillName') as string,
      level: formData.get('skillLevel') as string,
    };
    setSkills([...skills, newSkill]);
    onAddOpenChange();
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSkill = {
      name: formData.get('skillName') as string,
      level: formData.get('skillLevel') as string,
    };
    const updatedSkills = skills.map(skill => 
      skill.name === editingSkill?.name ? updatedSkill : skill
    );
    setSkills(updatedSkills);
    onEditOpenChange();
  };

  const displayedSkills = showAll ? skills : skills.slice(0, 3);

  return (
    <>
      <Card className="w-full rounded-xl p-1">
        <CardBody>
          <div className="flex flex-row justify-between items-center mb-3">
            <p className="text-xl text-white">Skills</p>
            <Button size="sm" variant="ghost" className="flex flex-row border-none text-white" onPress={onAddOpen}>
              <Plus size={16} />
              Add
            </Button>
          </div>
          <div className="mb-3 bg-gray-700 w-[100%] h-[1px] justify-center items-center rounded-full"></div>
          {displayedSkills.map((skill, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-sm text-white">{skill.name}</p>
              <div className="flex items-center">
                <p className="text-sm text-gray-400 mr-2">{skill.level}</p>
                <Button size="sm" variant="ghost" className="p-0" onPress={() => {
                  setEditingSkill(skill);
                  onEditOpen();
                }}>
                  <Pencil size={14} className="text-gray-400" />
                </Button>
              </div>
            </div>
          ))}
          {skills.length > 3 && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-full mt-2 text-gray-400"
              onPress={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show less <ChevronUp size={14} className="ml-1" />
                </>
              ) : (
                <>
                  Show all {skills.length} Skills <ChevronDown size={14} className="ml-1" />
                </>
              )}
            </Button>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleAddSubmit}>
              <ModalHeader className="flex flex-col gap-1">Add New Skill</ModalHeader>
              <ModalBody>
                <Input
                  label="Skill"
                  placeholder="Enter skill name"
                  name="skillName"
                />
                <Select
                  label="Level"
                  placeholder="Select level"
                  name="skillLevel"
                >
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Add Skill
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleEditSubmit}>
              <ModalHeader className="flex flex-col gap-1">Edit Skill</ModalHeader>
              <ModalBody>
                <Input
                  label="Skill"
                  placeholder="Enter skill name"
                  name="skillName"
                  defaultValue={editingSkill?.name}
                />
                <Select
                  label="Level"
                  placeholder="Select level"
                  name="skillLevel"
                  defaultSelectedKeys={editingSkill ? [editingSkill.level] : []}
                >
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Skills