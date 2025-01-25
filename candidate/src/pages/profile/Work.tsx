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
import { parseDate, today, CalendarDate } from "@internationalized/date";
import { useOutletContext } from "react-router-dom";
import { Candidate } from "@shared-types/Candidate";

const positionTypes = [
  "fulltime",
  "parttime",
  "internship",
  "contract",
  "freelance",
] as const;

const jobFunctions = [
  "Engineering - Web / Software",
  "Computer Science - Software - IT",
  "Design",
  "Marketing",
] as const;

const sectors = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
] as const;

interface Work {
  _id?: string;
  company: string;
  sector: string;
  type: typeof positionTypes[number];
  title: string;
  location: string;
  jobFunction: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  createdAt?: string;
}

const initialWorkData: Work = {
  company: "",
  sector: "",
  type: "fulltime",
  title: "",
  location: "",
  jobFunction: "",
  startDate: today("IST").toString(),
  endDate: today("IST").toString(),
  current: false,
  description: "",
};

export default function WorkExperience() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingExperience, setEditingExperience] = useState<Work | null>(null);
  const [formData, setFormData] = useState<Work>(initialWorkData);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof Work, boolean>>>({});

  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  const handleAdd = () => {
    setEditingExperience(null);
    setFormData(initialWorkData);
    setValidationErrors({});
    onOpen();
  };

  const handleEdit = (experience: Work) => {
    setEditingExperience(experience);
    setFormData(experience);
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.workExperience) return;
    
    const newExp = user.workExperience.filter((exp) => exp._id !== id);
    setUser({ ...user, workExperience: newExp });
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof Work, boolean>> = {};
    const requiredFields: (keyof Work)[] = ['company', 'sector', 'title', 'location', 'type', 'jobFunction', 'startDate'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = true;
      }
    });

    if (!formData.current && !formData.endDate) {
      errors.endDate = true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDateChange = (date: CalendarDate | null, field: 'startDate' | 'endDate') => {
    if (!date) return;
    
    const dateObj = new Date(date.year, date.month - 1, date.day);
    
    setFormData({
      ...formData,
      [field]: dateObj.toISOString().split('T')[0],
    });
  };

  const handleSave = () => {
    if (!validateForm()) {
      console.error("Form validation failed");
      return;
    }

    let newWorkExperience: Work[] = [];

    const preparedData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.current ? undefined : formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    if (editingExperience?._id) {
      newWorkExperience = (user?.workExperience || []).map((exp) => 
        exp._id === editingExperience._id ? { ...preparedData, _id: exp._id } : exp
      );
    } else {
      const newExp: Work = {
        ...preparedData,
        createdAt: new Date().toISOString(),
      };
      newWorkExperience = [...(user?.workExperience || []), newExp];
    }
    newWorkExperience.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    setUser({
      ...user,
      workExperience: newWorkExperience,
    });

    setFormData(initialWorkData);
    setEditingExperience(null);
    setValidationErrors({});
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
        {!user.workExperience?.length ? (
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
            <Button onClick={handleAdd} startContent={<Plus size={18} />}>
              Add new
            </Button>
          </motion.div>
        ) : (
          <>
            {user.workExperience.map((experience) => (
              <Card key={experience._id} className="w-full">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-default-100 rounded-full flex items-center justify-center">
                        {experience.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {experience.title}
                        </h3>
                        <p className="text-default-500 text-sm">
                          {experience.company} | {new Date(experience.startDate).toLocaleDateString()} -{" "}
                          {experience.current ? "Present" : experience.endDate ? new Date(experience.endDate).toLocaleDateString() : ""}{" "}
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
                        onClick={() => experience._id && handleDelete(experience._id)}
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
                    placeholder="Enter Company Name"
                    value={formData.company}
                    isRequired
                    isInvalid={validationErrors.company}
                    errorMessage={validationErrors.company ? "Company name is required" : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                  <Select
                    label="Company Sector"
                    placeholder="Select Company Sector"
                    selectedKeys={formData.sector ? [formData.sector] : []}
                    isRequired
                    isInvalid={validationErrors.sector}
                    errorMessage={validationErrors.sector ? "Sector is required" : ""}
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
                    isRequired
                    isInvalid={validationErrors.title}
                    errorMessage={validationErrors.title ? "Job title is required" : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <Input
                    label="Location"
                    placeholder="Enter Job Location"
                    value={formData.location}
                    isRequired
                    isInvalid={validationErrors.location}
                    errorMessage={validationErrors.location ? "Location is required" : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <Select
                    label="Position Type"
                    placeholder="Select Position Type"
                    selectedKeys={[formData.type]}
                    isRequired
                    isInvalid={validationErrors.type}
                    errorMessage={validationErrors.type ? "Position type is required" : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as typeof positionTypes[number],
                      })
                    }
                  >
                    {positionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Job Function"
                    placeholder="Select Job Function"
                    selectedKeys={formData.jobFunction ? [formData.jobFunction] : []}
                    isRequired
                    isInvalid={validationErrors.jobFunction}
                    errorMessage={validationErrors.jobFunction ? "Job function is required" : ""}
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
                    value={parseDate(formData.startDate.split('T')[0])}
                    isRequired
                    isInvalid={validationErrors.startDate}
                    errorMessage={validationErrors.startDate ? "Start date is required" : ""}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                  />
                  <DateInput
                    label="End Date"
                    value={formData.endDate ? parseDate(formData.endDate.split('T')[0]) : today("IST")}
                    isDisabled={formData.current}
                    isRequired={!formData.current}
                    isInvalid={validationErrors.endDate}
                    errorMessage={validationErrors.endDate ? "End date is required when not current" : ""}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                  />
                  <div className="col-span-2">
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
                  className="mt-4"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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