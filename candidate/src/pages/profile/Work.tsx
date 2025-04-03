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
  DatePicker,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, BriefcaseBusiness } from "lucide-react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useOutletContext } from "react-router-dom";
import { Candidate, WorkExperience as Work } from "@shared-types/Candidate";
import { toast } from "sonner";
import { z } from "zod";

// Define schema for validation
const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(
    ["fulltime", "parttime", "internship", "contract", "freelance"],
    {
      required_error: "Position type is required",
    }
  ),
  jobFunction: z.string().min(1, "Job function is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  current: z.boolean(),
  endDate: z.date().optional().nullable(),
  description: z.string().optional(),
});

// Custom validation to check date logic
const validateDateLogic = (data: z.infer<typeof workExperienceSchema>) => {
  if (!data.current && !data.endDate) {
    throw new Error("End date is required when not current job");
  }

  if (!data.current && data.endDate && data.startDate > data.endDate) {
    throw new Error("End date cannot be before start date");
  }

  return data;
};

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
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");

  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  useEffect(() => {
    // Reset form validation on modal close
    if (!isOpen) {
      setValidationErrors({});
    }
  }, [isOpen]);

  const handleAdd = () => {
    setEditingExperience(null);
    resetForm();
    onOpen();
  };

  const resetForm = () => {
    setCompany("");
    setSector("");
    setTitle("");
    setLocation("");
    setType("fulltime");
    setJobFunction("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setEndDate(null);
    setDescription("");
    setValidationErrors({});
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
    setEndDate(experience.endDate ? new Date(experience.endDate) : null);
    setDescription(experience.description || "");
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.workExperience) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this experience?"
    );
    if (!confirmDelete) return;

    try {
      const newExp = user.workExperience.filter((exp) => exp._id !== id);
      setUser({ ...user, workExperience: newExp });
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete experience");
      console.error(error);
    }
  };

  const validateForm = (): boolean => {
    try {
      const formData = {
        company,
        sector,
        title,
        location,
        type,
        jobFunction,
        startDate,
        current,
        endDate: current ? null : endDate,
        description,
      };

      // Validate with zod schema
      workExperienceSchema.parse(formData);

      // Additional date validation
      validateDateLogic(formData);

      // Clear validation errors if all is good
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setValidationErrors(errors);
      } else if (error instanceof Error) {
        // Handle custom validation errors
        if (error.message.includes("End date")) {
          setValidationErrors({
            ...validationErrors,
            endDate: error.message,
          });
        }
      }
      return false;
    }
  };

  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (field === "startDate") {
      setStartDate(dateObj);

      // Update validation errors
      if (validationErrors.startDate) {
        const newErrors = { ...validationErrors };
        delete newErrors.startDate;
        setValidationErrors(newErrors);
      }

      // Validate against end date if it exists
      if (endDate && !current && dateObj > endDate) {
        setValidationErrors({
          ...validationErrors,
          startDate: "Start date cannot be after end date",
        });
      }
    } else {
      setEndDate(dateObj);

      // Update validation errors
      if (validationErrors.endDate) {
        const newErrors = { ...validationErrors };
        delete newErrors.endDate;
        setValidationErrors(newErrors);
      }

      // Validate against start date
      if (dateObj < startDate) {
        setValidationErrors({
          ...validationErrors,
          endDate: "End date cannot be before start date",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
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
        endDate: current ? undefined : endDate || undefined,
        description,
      };

      if (editingExperience) {
        // Make sure we have work experience array
        if (!user.workExperience) {
          throw new Error("Work experience data not found");
        }

        // Check if the edited experience still exists
        const experienceExists = user.workExperience.some(
          (exp) => exp._id === editingExperience
        );

        if (!experienceExists) {
          throw new Error("Experience to edit not found");
        }

        newWorkExperience = (user.workExperience || []).map((exp) =>
          exp._id === editingExperience
            ? { ...preparedData, _id: exp._id }
            : exp
        );
        toast.success("Experience updated successfully");
      } else {
        const newExp: Work = {
          ...preparedData,
          _id: `exp_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`, // More unique ID generation
          startDate: new Date(preparedData.startDate),
          endDate: preparedData.endDate
            ? new Date(preparedData.endDate)
            : undefined,
          createdAt: new Date(),
        };
        newWorkExperience = [...(user?.workExperience || []), newExp];
        toast.success("Experience added successfully");
      }

      // Sort by most recent first
      newWorkExperience.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setUser({
        ...user,
        workExperience: newWorkExperience,
      });

      setEditingExperience(null);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save experience"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch (e) {
      console.error("Invalid date format", e);
      return "Invalid date";
    }
  };

  const getPositionTypeBadge = (type: string) => {
    const colors: Record<string, any> = {
      fulltime: "primary",
      parttime: "secondary",
      internship: "success",
      contract: "warning",
      freelance: "default",
    };

    return (
      <Chip size="sm" color={colors[type] || "default"} variant="flat">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Chip>
    );
  };

  const handleInputChange = (
    value: string,
    field: keyof Work,
    setter: (value: string) => void
  ) => {
    setter(value);
    if (validationErrors[field] && value.trim()) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleSelectionChange = (
    value: string,
    field: keyof Work,
    setter: (value: any) => void
  ) => {
    setter(value);
    if (validationErrors[field] && value) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleCurrentChange = (isSelected: boolean) => {
    setCurrent(isSelected);
    if (isSelected && validationErrors.endDate) {
      const newErrors = { ...validationErrors };
      delete newErrors.endDate;
      setValidationErrors(newErrors);
    }
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/experience">Experience</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Work Experience</h1>
          <p className="text-sm text-neutral-500">
            Manage your professional history
          </p>
        </div>
        <Button
          variant="flat"
          onClick={handleAdd}
          startContent={<Plus size={18} />}
          color="primary"
        >
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {!user.workExperience?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full">
              <BriefcaseBusiness size={32} className="text-neutral-500" />
            </div>

            <h3 className="text-lg font-medium mt-2">
              No Work Experience Added
            </h3>
            <p className="text-neutral-500 text-center max-w-md">
              Add your professional history to complete your profile.
            </p>
            <Button
              color="primary"
              onClick={handleAdd}
              startContent={<Plus size={16} />}
              size="sm"
            >
              Add Experience
            </Button>
          </div>
        ) : (
          <>
            {user.workExperience.map((experience) => (
              <Card
                key={experience._id}
                className="w-full border border-neutral-200 dark:border-neutral-800 shadow-sm"
              >
                <CardBody>
                  <div className="flex items-start w-full gap-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-700 dark:text-neutral-300 shrink-0 font-medium">
                      {experience.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-medium">
                            {experience.title}
                          </h3>
                          {getPositionTypeBadge(experience.type)}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          {experience.company} · {experience.sector}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current
                            ? "Present"
                            : experience.endDate
                            ? formatDate(experience.endDate)
                            : ""}{" "}
                          · {experience.location}
                        </p>
                        {experience.description && (
                          <div className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                            {experience.description}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 shrink-0 ml-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(experience)}
                          size="sm"
                          aria-label="Edit experience"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onClick={() =>
                            experience._id && handleDelete(experience._id)
                          }
                          size="sm"
                          aria-label="Delete experience"
                        >
                          <Trash2 size={16} />
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    placeholder="Enter company name"
                    isRequired
                    isInvalid={!!validationErrors.company}
                    errorMessage={validationErrors.company}
                    value={company}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "company", setCompany)
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <Select
                    label="Company Sector"
                    placeholder="Select company sector"
                    selectedKeys={sector ? [sector] : []}
                    isRequired
                    isInvalid={!!validationErrors.sector}
                    errorMessage={validationErrors.sector}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      handleSelectionChange(selected, "sector", setSector);
                    }}
                    classNames={{
                      trigger: "border-neutral-300 dark:border-neutral-700",
                    }}
                  >
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Job Title"
                    placeholder="Enter job title"
                    value={title}
                    isRequired
                    isInvalid={!!validationErrors.title}
                    errorMessage={validationErrors.title}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "title", setTitle)
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <Input
                    label="Location"
                    placeholder="City, Country"
                    isRequired
                    isInvalid={!!validationErrors.location}
                    errorMessage={validationErrors.location}
                    value={location}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "location", setLocation)
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <Select
                    label="Position Type"
                    placeholder="Select position type"
                    isRequired
                    isInvalid={!!validationErrors.type}
                    errorMessage={validationErrors.type}
                    selectedKeys={type ? [type] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as Work["type"];
                      handleSelectionChange(selected, "type", setType);
                    }}
                    classNames={{
                      trigger: "border-neutral-300 dark:border-neutral-700",
                    }}
                  >
                    {positionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Job Function"
                    placeholder="Select job function"
                    isRequired
                    isInvalid={!!validationErrors.jobFunction}
                    errorMessage={validationErrors.jobFunction}
                    selectedKeys={jobFunction ? [jobFunction] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      handleSelectionChange(
                        selected,
                        "jobFunction",
                        setJobFunction
                      );
                    }}
                    classNames={{
                      trigger: "border-neutral-300 dark:border-neutral-700",
                    }}
                  >
                    {jobFunctions.map((func) => (
                      <SelectItem key={func} value={func}>
                        {func}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex flex-col">
                    <DatePicker
                      label="Start Date"
                      isRequired
                      isInvalid={!!validationErrors.startDate}
                      errorMessage={validationErrors.startDate}
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(startDate.toISOString())}
                      onChange={(date) => handleDateChange(date, "startDate")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <DatePicker
                      label="End Date"
                      isInvalid={!!validationErrors.endDate}
                      errorMessage={validationErrors.endDate}
                      value={
                        endDate
                          ? parseAbsoluteToLocal(endDate.toISOString())
                          : undefined
                      }
                      onChange={(date) => handleDateChange(date, "endDate")}
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={current}
                    />
                  </div>
                  <div className="col-span-2 mt-1">
                    <Checkbox
                      isSelected={current}
                      onValueChange={handleCurrentChange}
                    >
                      I currently work here
                    </Checkbox>
                  </div>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Describe your responsibilities, achievements, and skills"
                  className="mt-4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minRows={3}
                  classNames={{
                    inputWrapper: "border-neutral-300 dark:border-neutral-700",
                  }}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Use bullet points to highlight key achievements and
                  responsibilities
                </p>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  {editingExperience ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
