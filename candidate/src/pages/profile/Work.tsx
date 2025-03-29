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
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import { Edit2, Trash2, Download, Plus, BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useOutletContext } from "react-router-dom";
import { Candidate, WorkExperience as Work } from "@shared-types/Candidate";

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

export default function WorkExperience() {
  const [editingExperience, setEditingExperience] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof Work, boolean>>
  >({});

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<Work["type"]>("fulltime");
  const [jobFunction, setJobFunction] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [current, setCurrent] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");

  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  const handleAdd = () => {
    setEditingExperience(null);
    setValidationErrors({});
    onOpen();
  };

  const handleEdit = (experience: Work) => {
    setEditingExperience(experience?._id || null);
    setCompany(experience.company);
    setSector(experience.sector);
    setTitle(experience.title);
    setLocation(experience.location);
    setType(experience.type);
    setJobFunction(experience.jobFunction);
    setStartDate(new Date(experience.startDate));
    setCurrent(experience.current);
    setEndDate(experience.endDate ? new Date(experience.endDate) : undefined);
    setDescription(experience.description || "");
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.workExperience) return;

    const newExp = user.workExperience.filter((exp) => exp._id !== id);
    setUser({ ...user, workExperience: newExp });
  };

  const validateForm = (): boolean => {
    const errors = {
      company: false,
      sector: false,
      title: false,
      location: false,
      type: false,
      jobFunction: false,
    };

    if (!company) errors.company = true;
    if (!sector) errors.sector = true;
    if (!title) errors.title = true;
    if (!location) errors.location = true;
    if (!type) errors.type = true;
    if (!jobFunction) errors.jobFunction = true;

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (field === "startDate") {
      setStartDate(dateObj);
    } else {
      setEndDate(dateObj);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    let newWorkExperience: Work[] = [];

    const preparedData: Work = {
      company,
      sector,
      title,
      location,
      type,
      jobFunction,
      startDate,
      current,
      endDate,
      description,
    };

    if (editingExperience) {
      newWorkExperience = (user?.workExperience || []).map((exp) =>
        exp._id === editingExperience
          ? { ...preparedData, _id: exp._id }
          : {
              ...exp,
            }
      );
    } else {
      const newExp: Work = {
        ...preparedData,
        startDate: new Date(preparedData.startDate),
        endDate: preparedData.endDate
          ? new Date(preparedData.endDate)
          : undefined,
        createdAt: new Date(),
      };
      newWorkExperience = [...(user?.workExperience || []), newExp];
    }
    newWorkExperience.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    setUser({
      ...user,
      workExperience: newWorkExperience,
    });

    setEditingExperience(null);
    setValidationErrors({});
    onClose();
  };

  const closeAndReset = () => {
    setEditingExperience(null);
    setValidationErrors({});
    setCompany("");
    setSector("");
    setTitle("");
    setLocation("");
    setType("fulltime");
    setJobFunction("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setEndDate(undefined);
    setDescription("");
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
                  <div className="flex items-center w-full gap-5">
                    <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center">
                      {experience.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold">
                          {experience.title}
                        </h3>
                        <p className="text-default-500 text-sm">
                          {experience.company} |{" "}
                          {new Date(experience.startDate).toLocaleDateString()}{" "}
                          -{" "}
                          {experience.current
                            ? "Present"
                            : experience.endDate
                            ? new Date(experience.endDate).toLocaleDateString()
                            : ""}{" "}
                          | {experience.location}
                        </p>
                        <div className="mt-4 whitespace-pre-line">
                          {experience.description}
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
                          onClick={() =>
                            experience._id && handleDelete(experience._id)
                          }
                        >
                          <Trash2 size={18} />
                        </Button>
                        <Button isIconOnly variant="light">
                          <Download size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeAndReset} size="2xl">
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
                    isRequired
                    isInvalid={validationErrors.company}
                    errorMessage={
                      validationErrors.company ? "Company name is required" : ""
                    }
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <Select
                    label="Company Sector"
                    placeholder="Select Company Sector"
                    selectedKeys={[sector]}
                    isRequired
                    isInvalid={validationErrors.sector}
                    errorMessage={
                      validationErrors.sector ? "Sector is required" : ""
                    }
                    onSelectionChange={(e) => setSector(e.currentKey as string)}
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
                    value={title}
                    isRequired
                    isInvalid={validationErrors.title}
                    errorMessage={
                      validationErrors.title ? "Job title is required" : ""
                    }
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    label="Location"
                    placeholder="Enter Job Location"
                    isRequired
                    isInvalid={validationErrors.location}
                    errorMessage={
                      validationErrors.location ? "Location is required" : ""
                    }
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Select
                    label="Position Type"
                    placeholder="Select Position Type"
                    isRequired
                    isInvalid={validationErrors.type}
                    errorMessage={
                      validationErrors.type ? "Position type is required" : ""
                    }
                    selectedKeys={[type]}
                    onSelectionChange={(e) =>
                      setType(e.currentKey as Work["type"])
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
                    isRequired
                    isInvalid={validationErrors.jobFunction}
                    errorMessage={
                      validationErrors.jobFunction
                        ? "Job function is required"
                        : ""
                    }
                    selectedKeys={[jobFunction]}
                    onSelectionChange={(e) =>
                      setJobFunction(e.currentKey as string)
                    }
                  >
                    {jobFunctions.map((func) => (
                      <SelectItem key={func} value={func}>
                        {func}
                      </SelectItem>
                    ))}
                  </Select>
                  <DatePicker
                    className="max-w-xs"
                    label="Start Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(startDate.toISOString())}
                    onChange={(date) => handleDateChange(date, "startDate")}
                  />
                  <DatePicker
                    className="max-w-xs"
                    defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
                    label="End Date (mm/dd/yyyy)"
                    granularity="day"
                    value={
                      endDate
                        ? parseAbsoluteToLocal(endDate.toISOString())
                        : undefined
                    }
                    onChange={(date) => handleDateChange(date, "endDate")}
                    maxValue={today(getLocalTimeZone())}
                    isDisabled={current}
                  />
                  <p className="text-xs">Time Zone: {getLocalTimeZone()}</p>
                  <div className="col-span-2">
                    <Checkbox
                      checked={current}
                      onChange={(e) => setCurrent(e.target.checked)}
                    >
                      I currently work here
                    </Checkbox>
                  </div>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Enter job description"
                  className="mt-4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
