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
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { Edit2, Trash2, Download, Plus, BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";
import { Candidate, Work as Experience } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { parseDate, today } from "@internationalized/date";

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

export default function InternshipExperience() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  const [formData, setFormData] = useState<Experience>({
    company: "",
    sector: "",
    type: "freelance",
    title: "",
    location: "",
    jobFunction: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const handleAdd = () => {
    setEditingExperience(null);
    setFormData({
      company: "",
      sector: "",
      title: "",
      location: "",
      type: "freelance",
      jobFunction: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    onOpen();
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData(experience);
    onOpen();
  };

  const handleDelete = (id: string) => {
    const newExp = user?.workExperience?.filter((exp) => exp._id !== id);
    const newUser = { ...user, workExperience: newExp };
    setUser(newUser);
  };

  const handleSave = async () => {
    let newExp: Experience[] = [];
    if (editingExperience) {
      newExp = (user?.workExperience || []).map((exp) => {
        if (exp._id === editingExperience._id) {
          return formData as Experience;
        }
        return exp as Experience;
      });
    }

    const newUser = { ...user, workExperience: newExp };
    setUser(newUser);

    onClose();
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/experience">Experience</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-end items-center">
        {user.workExperience && user.workExperience.length > 0 && (
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
        {user.workExperience && user.workExperience.length === 0 ? (
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
            {user?.workExperience?.map((experience) => (
              <Card key={experience._id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center">
                        {experience.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {experience.title}
                        </h3>
                        <p className="text-default-500 text-sm">
                          {experience.company} | {experience.startDate} -{" "}
                          {experience.current ? "Present" : experience.endDate}{" "}
                          | {experience.location}
                        </p>
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
                        onClick={() => handleDelete(experience._id || "")}
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
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
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
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
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
                    selectedKeys={formData.type ? [formData.type] : []}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as
                          | "freelance"
                          | "fulltime"
                          | "parttime"
                          | "internship"
                          | "contract",
                      })
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
                  <DateInput
                    label="Start Date"
                    value={
                      formData?.startDate?.toString()
                        ? parseDate(
                            formData?.startDate?.toString()?.split("T")[0]
                          )
                        : today("IST")
                    }
                    onChange={(date) =>
                      setFormData({ ...formData, startDate: date.toString() })
                    }
                  />

                  <DateInput
                    label="End Date"
                    isDisabled={formData.current}
                    value={
                      formData?.endDate?.toString()
                        ? parseDate(
                            formData?.endDate?.toString()?.split("T")[0]
                          )
                        : today("IST")
                    }
                    onChange={(date) =>
                      setFormData({ ...formData, endDate: date.toString() })
                    }
                  />

                  <div className="flex items-center">
                    <Checkbox
                      isSelected={formData.current}
                      onValueChange={(isSelected) =>
                        setFormData({ ...formData, current: isSelected })
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
