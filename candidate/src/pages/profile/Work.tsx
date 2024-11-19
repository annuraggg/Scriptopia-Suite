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
  Checkbox,
  Textarea,
  Card,
  CardBody,
  Chip,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { Edit2, Trash2, Download, Plus, BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";

interface Experience {
  id: string;
  companyName: string;
  sector: string;
  jobTitle: string;
  location: string;
  positionType: string;
  jobFunction: string;
  startDate: string;
  endDate: string;
  currentlyWork: boolean;
  salary: string;
  description: string;
  tags: string[];
}

const positionTypes = [
  "Internship",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
];

const jobFunctions = [
  "Engineering - Web / Software",
  "Computer Science - Software - IT",
  "Design",
  "Marketing",
];

const sectors = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
];

const salaryRanges = ["0-10k", "10k-20k", "20k-30k", "30k-40k", "40k+"];

export default function InternshipExperience() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [formData, setFormData] = useState<Experience>({
    id: "",
    companyName: "",
    sector: "",
    jobTitle: "",
    location: "",
    positionType: "",
    jobFunction: "",
    startDate: "",
    endDate: "",
    currentlyWork: false,
    salary: "",
    description: "",
    tags: [],
  });

  const handleAdd = () => {
    setEditingExperience(null);
    setFormData({
      id: Date.now().toString(),
      companyName: "",
      sector: "",
      jobTitle: "",
      location: "",
      positionType: "",
      jobFunction: "",
      startDate: "",
      endDate: "",
      currentlyWork: false,
      salary: "",
      description: "",
      tags: [],
    });
    onOpen();
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData(experience);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleSave = () => {
    if (editingExperience) {
      setExperiences(
        experiences.map((exp) =>
          exp.id === editingExperience.id ? formData : exp
        )
      );
    } else {
      setExperiences([...experiences, formData]);
    }
    onClose();
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/experience">Experience</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-end items-center">
        {experiences.length > 0 && (
          <Button
            variant="flat"
            onClick={handleAdd}
            startContent={<Plus size={18} />}
          >
            Add New
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {experiences.length === 0 ? (
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
              <BriefcaseBusiness size={50} />
            </motion.div>

            <h3 className="text-xl mt-3">No Work Experience Added Yet</h3>
            <p className="text-gray-500">
              Start by adding your first work experience!
            </p>
            <Button onClick={() => onOpen()} startContent={<Plus size={18} />}>
              Add new
            </Button>
          </motion.div>
        ) : (
          <>
            {experiences.map((experience) => (
              <Card key={experience.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center">
                        {experience.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {experience.jobTitle}
                        </h3>
                        <p className="text-default-500 text-sm">
                          {experience.companyName} | {experience.startDate} -{" "}
                          {experience.currentlyWork
                            ? "Present"
                            : experience.endDate}{" "}
                          | {experience.location}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {experience.tags.map((tag) => (
                            <Chip key={tag}>{tag}</Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={() => handleEdit(experience)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={() => handleDelete(experience.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                      <Button isIconOnly variant="light">
                        <Download size={18} />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 whitespace-pre-line">
                    {experience.description}
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    placeholder="Search Company Name"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                  <Select
                    label="Company Sector"
                    placeholder="Select Company Sector"
                    selectedKeys={formData.sector ? [formData.sector] : []}
                    onChange={(e) =>
                      setFormData({ ...formData, sector: e.target.value })
                    }
                  >
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Job Title"
                    placeholder="Enter Job Title"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, jobTitle: e.target.value })
                    }
                  />
                  <Input
                    label="Location"
                    placeholder="Enter Job Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <Select
                    label="Position Type"
                    placeholder="Select Position Type"
                    selectedKeys={
                      formData.positionType ? [formData.positionType] : []
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, positionType: e.target.value })
                    }
                  >
                    {positionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Job Function"
                    placeholder="Select Job Function"
                    selectedKeys={
                      formData.jobFunction ? [formData.jobFunction] : []
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, jobFunction: e.target.value })
                    }
                  >
                    {jobFunctions.map((func) => (
                      <SelectItem key={func} value={func}>
                        {func}
                      </SelectItem>
                    ))}
                  </Select>
                  <DateInput label="Start Date" />
                  <DateInput
                    label="End Date"
                    isDisabled={formData.currentlyWork}
                  />
                  <Select
                    label="Salary/Stipend Range"
                    placeholder="Select Salary Range"
                    selectedKeys={formData.salary ? [formData.salary] : []}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  >
                    {salaryRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex items-center">
                    <Checkbox
                      isSelected={formData.currentlyWork}
                      onValueChange={(isSelected) =>
                        setFormData({ ...formData, currentlyWork: isSelected })
                      }
                    >
                      I currently work here
                    </Checkbox>
                  </div>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Enter job description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-4"
                />
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
    </div>
  );
}
