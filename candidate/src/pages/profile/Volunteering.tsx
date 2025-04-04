import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Checkbox,
  Textarea,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  DatePicker,
  Divider,
  Chip,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Edit2, Trash2, Calendar, Plus, Briefcase, Award } from "lucide-react";
import { toast } from "sonner";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Interface matching the backend schema
interface Volunteer {
  _id?: string;
  organization: string;
  role: string;
  cause: string;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  description: string;
  createdAt?: string;
}

// User context interface
interface UserContext {
  user: {
    volunteering?: Volunteer[];
  };
  setUser: (user: any) => void;
}

// Available causes as a const array
const causes = [
  "Education",
  "Healthcare",
  "Environment",
  "Animal Welfare",
  "Community Development",
  "Arts & Culture",
  "Social Justice",
  "Disaster Relief",
] as const;

// Zod schema for form validation
const volunteerSchema = z.object({
  organization: z.string().min(1, "Organization name is required"),
  role: z.string().min(1, "Role is required"),
  cause: z.string().min(1, "Cause is required"),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean(),
  description: z.string(),
});

// Error type for form validation
type ValidationErrors = {
  [K in keyof z.infer<typeof volunteerSchema>]?: string;
};

const Volunteering = () => {
  // State for editing experience
  const [editingExperience, setEditingExperience] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState({
    organization: "",
    role: "",
    cause: "",
    startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    current: false,
    endDate: undefined as Date | undefined,
    description: "",
  });

  // Access user context
  const { user, setUser } = useOutletContext<UserContext>();

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Reset form state
  const resetForm = () => {
    setEditingExperience(null);
    setValidationErrors({});
    setFormData({
      organization: "",
      role: "",
      cause: "",
      startDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      current: false,
      endDate: undefined,
      description: "",
    });
  };

  // Handle add new experience
  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  // Handle edit experience
  const handleEdit = (experience: Volunteer) => {
    setEditingExperience(experience?._id || null);
    setFormData({
      organization: experience.organization,
      role: experience.role,
      cause: experience.cause,
      startDate: new Date(experience.startDate),
      current: experience.current,
      endDate: experience.endDate ? new Date(experience.endDate) : undefined,
      description: experience.description || "",
    });
    setValidationErrors({});
    onOpen();
  };

  // Handle delete experience
  const handleDelete = (id: string) => {
    if (!user.volunteering) return;

    try {
      const newVolunteering = user.volunteering.filter((exp) => exp._id !== id);
      setUser({ ...user, volunteering: newVolunteering });
      toast.success("Volunteer experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete volunteer experience");
    }
  };

  // Validate form using zod
  const validateForm = (): boolean => {
    try {
      // Special validation for end date
      const dateValidation = formData.current
        ? {}
        : {
            endDate: formData.endDate
              ? undefined
              : "End date is required when not currently volunteering",
          };

      // Additional validation for dates
      if (formData.endDate && formData.startDate > formData.endDate) {
        setValidationErrors({
          ...validationErrors,
          endDate: "End date cannot be before start date",
        });
        return false;
      }

      // Validate with zod schema
      volunteerSchema.parse(formData);

      // Check for date-specific validations
      if (Object.keys(dateValidation).length > 0) {
        setValidationErrors(dateValidation);
        return false;
      }

      // Clear errors if validation passes
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ValidationErrors;
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Handle date change
  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setFormData({
      ...formData,
      [field]: dateObj,
    });
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: undefined,
      });
    }
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      let newVolunteering: Volunteer[] = [];

      const preparedData: Volunteer = {
        ...formData,
      };

      if (editingExperience) {
        newVolunteering = (user?.volunteering || []).map((exp) =>
          exp._id === editingExperience
            ? { ...preparedData, _id: exp._id }
            : { ...exp }
        );
        toast.success("Volunteer experience updated successfully");
      } else {
        const newExp: Volunteer = {
          ...preparedData,
          startDate: new Date(preparedData.startDate),
          endDate: preparedData.endDate
            ? new Date(preparedData.endDate)
            : undefined,
          createdAt: new Date().toISOString(),
          _id: Date.now().toString(), // Temporary ID until we get one from API
        };
        newVolunteering = [...(user?.volunteering || []), newExp];
        toast.success("Volunteer experience added successfully");
      }

      // Sort by most recent
      newVolunteering.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setUser({
        ...user,
        volunteering: newVolunteering,
      });

      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to save volunteer experience");
      console.error(error);
    }
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate duration
  const getDuration = (
    startDate: Date | string,
    endDate?: Date | string,
    current?: boolean
  ) => {
    const start = new Date(startDate);
    const end = current ? new Date() : endDate ? new Date(endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let result = "";
    if (years > 0) {
      result += `${years} year${years > 1 ? "s" : ""}`;
    }
    if (remainingMonths > 0 || years === 0) {
      if (years > 0) result += " ";
      result += `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
    }

    return result;
  };

  // Handle modal close
  const closeModal = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Volunteer Experience</h1>
          <p className="text-default-500">Manage your volunteering history</p>
        </div>
        <Button
          color="primary"
          variant="flat"
          onClick={handleAdd}
          startContent={<Plus size={18} />}
          size="md"
        >
          Add Experience
        </Button>
      </div>

      {!user.volunteering?.length ? (
        <Card className="w-full bg-default-50">
          <CardBody className="flex flex-col items-center justify-center py-12">
            <Award size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">
              No Volunteering Added Yet
            </h3>
            <p className="text-default-500 mb-6 text-center max-w-md">
              Share your volunteer work to showcase your community involvement
              and leadership skills.
            </p>
            <Button
              color="primary"
              onClick={handleAdd}
              startContent={<Plus size={18} />}
            >
              Add Volunteer Experience
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {user.volunteering.map((experience) => (
            <Card key={experience._id} className="w-full border-none shadow-md">
              <CardHeader className="flex justify-between pb-2">
                <div className="flex gap-4 items-center">
                  <Avatar
                    name={experience.organization}
                    color="primary"
                    size="md"
                    radius="md"
                    showFallback
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{experience.role}</h3>
                    <p className="text-default-500">
                      {experience.organization}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      variant="light"
                      onClick={() => handleEdit(experience)}
                      aria-label="Edit"
                    >
                      <Edit2 size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onClick={() =>
                        experience._id && handleDelete(experience._id)
                      }
                      aria-label="Delete"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </Tooltip>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-default-500" />
                    <span>
                      {formatDate(experience.startDate)} -{" "}
                      {experience.current
                        ? "Present"
                        : experience.endDate
                        ? formatDate(experience.endDate)
                        : ""}
                    </span>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="ml-2"
                    >
                      {getDuration(
                        experience.startDate,
                        experience.endDate,
                        experience.current
                      )}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-default-500" />
                    <span>Cause: {experience.cause}</span>
                  </div>
                </div>
                {experience.description && (
                  <div className="mt-4 bg-default-50 p-3 rounded-lg text-sm">
                    {experience.description}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h2 className="text-xl">
                  {editingExperience ? "Edit" : "Add New"} Volunteer Experience
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Organization Name"
                    placeholder="Enter organization name"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    isRequired
                    isInvalid={!!validationErrors.organization}
                    errorMessage={validationErrors.organization}
                    classNames={{
                      inputWrapper: "border-1",
                    }}
                  />
                  <Input
                    label="Your Role"
                    placeholder="Enter your volunteer role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    isRequired
                    isInvalid={!!validationErrors.role}
                    errorMessage={validationErrors.role}
                    classNames={{
                      inputWrapper: "border-1",
                    }}
                  />
                  <Select
                    label="Select Cause"
                    placeholder="Select cause area"
                    selectedKeys={formData.cause ? [formData.cause] : []}
                    onChange={(e) => handleInputChange("cause", e.target.value)}
                    isRequired
                    isInvalid={!!validationErrors.cause}
                    errorMessage={validationErrors.cause}
                    classNames={{
                      trigger: "border-1",
                    }}
                  >
                    {causes.map((cause) => (
                      <SelectItem key={cause} value={cause}>
                        {cause}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="md:col-span-2">
                    <Checkbox
                      isSelected={formData.current}
                      onValueChange={(checked) => {
                        handleInputChange("current", checked);
                        if (checked) {
                          handleInputChange("endDate", undefined as any);
                        }
                      }}
                      className="mb-4"
                    >
                      I am currently volunteering with this organization
                    </Checkbox>
                  </div>
                  <DatePicker
                    label="Start Date"
                    value={parseAbsoluteToLocal(
                      formData.startDate.toISOString()
                    )}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    maxValue={today(getLocalTimeZone())}
                    isInvalid={!!validationErrors.startDate}
                    errorMessage={validationErrors.startDate}
                    showMonthAndYearPickers
                    classNames={{
                      base: "max-w-full",
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={
                      formData.endDate
                        ? parseAbsoluteToLocal(formData.endDate.toISOString())
                        : undefined
                    }
                    onChange={(date) => handleDateChange(date, "endDate")}
                    maxValue={today(getLocalTimeZone())}
                    isDisabled={formData.current}
                    isInvalid={!!validationErrors.endDate}
                    errorMessage={validationErrors.endDate}
                    showMonthAndYearPickers
                    classNames={{
                      base: "max-w-full",
                    }}
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Description"
                      placeholder="Describe your responsibilities, achievements, and impact"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      minRows={4}
                      maxRows={8}
                      isInvalid={!!validationErrors.description}
                      errorMessage={validationErrors.description}
                      classNames={{
                        inputWrapper: "border-1",
                      }}
                    />
                    <p className="text-xs text-default-400 mt-1">
                      Describe the nature of your volunteer work, skills
                      utilized, and meaningful impacts.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={closeModal}>
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
};

export default Volunteering;
