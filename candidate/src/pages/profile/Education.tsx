import {
  BreadcrumbItem,
  Breadcrumbs,
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
  Checkbox,
  Chip,
} from "@nextui-org/react";
import { Edit2, Calendar, Plus, GraduationCap, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Candidate, Education as IEducation } from "@shared-types/Candidate";
import { toast } from "sonner";
import { z } from "zod";

// Define schema for validation
const educationSchema = z.object({
  school: z.string().min(1, "Institution name is required"),
  board: z.string().min(1, "Board/University is required"),
  degree: z.string().min(1, "Degree is required"),
  branch: z.string().min(1, "Branch/Specialization is required"),
  startYear: z
    .number()
    .int()
    .min(1900, "Start year must be after 1900")
    .max(new Date().getFullYear(), "Start year cannot be in the future"),
  current: z.boolean(),
  endYear: z
    .number()
    .int()
    .min(1900, "End year must be after 1900")
    .max(new Date().getFullYear() + 10, "End year is too far in the future")
    .optional()
    .nullable(),
  type: z.enum(["fulltime", "parttime", "distance"]),
  percentage: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
});

// Custom validation to check date logic
const validateDateLogic = (data: z.infer<typeof educationSchema>) => {
  if (!data.current && !data.endYear) {
    throw new Error("End year is required when not a current program");
  }

  if (!data.current && data.endYear && data.startYear > data.endYear) {
    throw new Error("End year cannot be before start year");
  }

  return data;
};

const Education = () => {
  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null
  );

  // Form state
  const [school, setSchool] = useState("");
  const [board, setBoard] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [endYear, setEndYear] = useState<number | null>(
    new Date().getFullYear()
  );
  const [current, setCurrent] = useState(false);
  const [educationType, setEducationType] = useState<
    "fulltime" | "parttime" | "distance"
  >("fulltime");
  const [percentage, setPercentage] = useState<number>(0);

  // Branch modal state
  const {
    isOpen: isBranchModalOpen,
    onOpen: onBranchModalOpen,
    onClose: onBranchModalClose,
  } = useDisclosure();
  const [newBranch, setNewBranch] = useState("");
  const [branches, setBranches] = useState([
    "Information Technology",
    "Computer Science",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
  ]);

  const programs = [
    "B.E.",
    "B.Tech",
    "M.Tech",
    "M.E.",
    "BCA",
    "MCA",
    "B.Sc",
    "M.Sc",
    "Diploma",
    "Ph.D",
    "HSC",
    "SSC",
  ];

  const educationTypes = [
    { label: "Full Time", value: "fulltime" },
    { label: "Part Time", value: "parttime" },
    { label: "Distance Learning", value: "distance" },
  ];

  useEffect(() => {
    // Reset validation errors when modal closes
    if (!isOpen) {
      setValidationErrors({});
    }
  }, [isOpen]);

  const resetForm = () => {
    setSchool("");
    setBoard("");
    setDegree("");
    setBranch("");
    setStartYear(new Date().getFullYear());
    setEndYear(new Date().getFullYear());
    setCurrent(false);
    setEducationType("fulltime");
    setPercentage(0);
    setValidationErrors({});
    setIsEditing(false);
    setEditingEducationId(null);
  };

  const handleAddNewEducation = () => {
    resetForm();
    onOpen();
  };

  const handleEditEducation = (education: IEducation) => {
    setIsEditing(true);
    setEditingEducationId(education._id || null);

    setSchool(education.school);
    setBoard(education.board);
    setDegree(education.degree);
    setBranch(education.branch);
    setStartYear(education.startYear);
    setEndYear(education.endYear || null);
    setCurrent(education.current);
    setEducationType(education.type);
    setPercentage(education.percentage);

    onOpen();
  };

  const validateForm = (): boolean => {
    try {
      const formData = {
        school,
        board,
        degree,
        branch,
        startYear,
        current,
        endYear: current ? null : endYear,
        type: educationType,
        percentage,
      };

      // Validate with zod schema
      educationSchema.parse(formData);

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
        if (error.message.includes("End year")) {
          setValidationErrors({
            ...validationErrors,
            endYear: error.message,
          });
        }
      }
      return false;
    }
  };

  const handleInputChange = (
    value: string | number | boolean,
    field: string,
    setter: (value: any) => void
  ) => {
    setter(value);
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleAddBranch = () => {
    if (!newBranch.trim()) {
      setValidationErrors({
        ...validationErrors,
        newBranch: "Branch name cannot be empty",
      });
      return;
    }

    if (branches.includes(newBranch.trim())) {
      setValidationErrors({
        ...validationErrors,
        newBranch: "This branch already exists",
      });
      return;
    }

    const updatedBranches = [...branches, newBranch.trim()];
    setBranches(updatedBranches);
    setBranch(newBranch.trim());
    setNewBranch("");
    onBranchModalClose();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newEducation: IEducation = {
        school,
        board,
        degree,
        branch,
        startYear,
        endYear: current ? undefined : endYear ? endYear : undefined,
        current,
        type: educationType,
        percentage,
      };

      if (isEditing && editingEducationId) {
        // Make sure education array exists
        if (!user.education) {
          throw new Error("Education data not found");
        }

        // Check if the edited education still exists
        const educationExists = user.education.some(
          (edu) => edu._id === editingEducationId
        );

        if (!educationExists) {
          throw new Error("Education to edit not found");
        }

        const updatedEducation = user.education.map((edu) =>
          edu._id === editingEducationId
            ? { ...newEducation, _id: edu._id }
            : edu
        );

        setUser({
          ...user,
          education: updatedEducation,
        });

        toast.success("Education updated successfully");
      } else {
        // Add new education with unique ID
        const educationWithId: IEducation = {
          ...newEducation,
          _id: `edu_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          createdAt: new Date(),
        };

        setUser({
          ...user,
          education: [...(user.education || []), educationWithId],
        });

        toast.success("Education added successfully");
      }

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save education details"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!user.education) return;

    const educationToDelete = user.education.find((edu) => edu._id === id);
    if (!educationToDelete) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the education record for ${educationToDelete.degree} at ${educationToDelete.school}?`
    );

    if (!confirmDelete) return;

    try {
      const updatedEducation = user.education.filter((edu) => edu._id !== id);
      setUser({
        ...user,
        education: updatedEducation,
      });

      toast.success("Education record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete education record");
      console.error(error);
    }
  };

  const getFormattedType = (type: string) => {
    switch (type) {
      case "fulltime":
        return "Full Time";
      case "parttime":
        return "Part Time";
      case "distance":
        return "Distance Learning";
      default:
        return type;
    }
  };

  const checkYearInput = (value: string, field: "startYear" | "endYear") => {
    const yearValue = value === "" ? 0 : parseInt(value);

    if (isNaN(yearValue)) return;

    if (field === "startYear") {
      setStartYear(yearValue);

      // Update validation errors
      if (validationErrors.startYear) {
        const newErrors = { ...validationErrors };
        delete newErrors.startYear;
        setValidationErrors(newErrors);
      }

      // Validate against end year if it exists
      if (endYear && !current && yearValue > endYear) {
        setValidationErrors({
          ...validationErrors,
          startYear: "Start year cannot be after end year",
        });
      }
    } else {
      setEndYear(yearValue);

      // Update validation errors
      if (validationErrors.endYear) {
        const newErrors = { ...validationErrors };
        delete newErrors.endYear;
        setValidationErrors(newErrors);
      }

      // Validate against start year
      if (yearValue < startYear) {
        setValidationErrors({
          ...validationErrors,
          endYear: "End year cannot be before start year",
        });
      }
    }
  };

  return (
    <div className="p-5">
      {/* Main Education Modal */}
      <Modal size="2xl" isOpen={isOpen} onClose={onClose} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="border-b">
                {isEditing ? "Edit Education Details" : "Add Education Details"}
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Institution/School Name"
                    placeholder="Enter institution name"
                    value={school}
                    isRequired
                    isInvalid={!!validationErrors.school}
                    errorMessage={validationErrors.school}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "school", setSchool)
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <Select
                    label="Program/Degree/Certificate"
                    placeholder="Select program"
                    isRequired
                    isInvalid={!!validationErrors.degree}
                    errorMessage={validationErrors.degree}
                    selectedKeys={degree ? [degree] : []}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "degree", setDegree)
                    }
                    classNames={{
                      trigger: "border-neutral-300 dark:border-neutral-700",
                    }}
                  >
                    {programs.map((prog) => (
                      <SelectItem key={prog} value={prog}>
                        {prog}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Board/University"
                    placeholder="Enter board or university name"
                    value={board}
                    isRequired
                    isInvalid={!!validationErrors.board}
                    errorMessage={validationErrors.board}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "board", setBoard)
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Select
                      label="Branch/Specialization"
                      placeholder="Select branch"
                      isRequired
                      isInvalid={!!validationErrors.branch}
                      errorMessage={validationErrors.branch}
                      selectedKeys={branch ? [branch] : []}
                      onChange={(e) =>
                        handleInputChange(e.target.value, "branch", setBranch)
                      }
                      classNames={{
                        trigger: "border-neutral-300 dark:border-neutral-700",
                      }}
                    >
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      variant="light"
                      className="self-start"
                      onPress={onBranchModalOpen}
                    >
                      Add New Branch/Specialization
                    </Button>
                  </div>

                  <Input
                    label="Start Year"
                    placeholder="YYYY"
                    value={startYear ? startYear.toString() : ""}
                    isRequired
                    isInvalid={!!validationErrors.startYear}
                    errorMessage={validationErrors.startYear}
                    onChange={(e) =>
                      checkYearInput(e.target.value, "startYear")
                    }
                    endContent={
                      <Calendar className="text-default-400" size={16} />
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                  <Input
                    label="End Year"
                    placeholder="YYYY"
                    value={endYear ? endYear.toString() : ""}
                    isRequired={!current}
                    isDisabled={current}
                    isInvalid={!!validationErrors.endYear}
                    errorMessage={validationErrors.endYear}
                    onChange={(e) => checkYearInput(e.target.value, "endYear")}
                    endContent={
                      <Calendar className="text-default-400" size={16} />
                    }
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />

                  <div className="col-span-2 mt-1">
                    <Checkbox
                      isSelected={current}
                      onValueChange={(selected) => {
                        handleInputChange(selected, "current", setCurrent);
                        if (selected && validationErrors.endYear) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.endYear;
                          setValidationErrors(newErrors);
                        }
                      }}
                    >
                      Currently Pursuing
                    </Checkbox>
                  </div>

                  <Select
                    label="Education Type"
                    placeholder="Select type"
                    isRequired
                    isInvalid={!!validationErrors.type}
                    errorMessage={validationErrors.type}
                    selectedKeys={educationType ? [educationType] : []}
                    onChange={(e) =>
                      handleInputChange(
                        e.target.value,
                        "type",
                        setEducationType
                      )
                    }
                    classNames={{
                      trigger: "border-neutral-300 dark:border-neutral-700",
                    }}
                  >
                    {educationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Score in Percentage"
                    placeholder="Enter percentage"
                    type="number"
                    value={percentage ? percentage.toString() : "0"}
                    isRequired
                    isInvalid={!!validationErrors.percentage}
                    errorMessage={validationErrors.percentage}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseFloat(e.target.value);
                      handleInputChange(value, "percentage", setPercentage);
                    }}
                    classNames={{
                      inputWrapper:
                        "border-neutral-300 dark:border-neutral-700",
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  color="default"
                  variant="light"
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  {isEditing ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Branch Modal */}
      <Modal
        size="sm"
        isOpen={isBranchModalOpen}
        onClose={onBranchModalClose}
        isDismissable={false}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b">
                Add New Branch/Specialization
              </ModalHeader>
              <ModalBody className="py-4">
                <Input
                  label="Branch Name"
                  placeholder="Enter new branch name"
                  value={newBranch}
                  isInvalid={!!validationErrors.newBranch}
                  errorMessage={validationErrors.newBranch}
                  onChange={(e) => {
                    setNewBranch(e.target.value);
                    if (validationErrors.newBranch) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.newBranch;
                      setValidationErrors(newErrors);
                    }
                  }}
                  classNames={{
                    inputWrapper: "border-neutral-300 dark:border-neutral-700",
                  }}
                />
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  color="default"
                  variant="light"
                  onPress={onBranchModalClose}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddBranch}>
                  Add Branch
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Education Dashboard */}
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/education">Education</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Education Information</h1>
          <p className="text-sm text-neutral-500">
            Manage your academic qualifications and certifications
          </p>
        </div>
        <Button
          variant="flat"
          color="primary"
          onPress={handleAddNewEducation}
          startContent={<Plus size={18} />}
        >
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {!user?.education?.length ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full">
              <GraduationCap size={32} className="text-neutral-500" />
            </div>

            <h3 className="text-lg font-medium mt-2">No Education Records</h3>
            <p className="text-neutral-500 text-center max-w-md">
              Add your educational background to complete your profile.
            </p>
            <Button
              color="primary"
              onPress={handleAddNewEducation}
              startContent={<Plus size={16} />}
              size="sm"
            >
              Add Education
            </Button>
          </div>
        ) : (
          <>
            {user.education.map((edu) => (
              <Card
                key={edu._id}
                className="w-full border border-neutral-200 dark:border-neutral-800 shadow-sm"
              >
                <CardBody>
                  <div className="flex items-start w-full gap-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-700 dark:text-neutral-300 shrink-0 font-medium">
                      {edu.school.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-medium">
                            {edu.degree} {edu.branch && `- ${edu.branch}`}
                          </h3>
                          {edu.current && (
                            <Chip size="sm" color="primary" variant="flat">
                              Currently Pursuing
                            </Chip>
                          )}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                          {edu.school}
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                          {edu.startYear} -{" "}
                          {edu.current ? "Present" : edu.endYear}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <div>
                            <span className="text-xs text-neutral-500">
                              Board/University
                            </span>
                            <p className="text-sm">{edu.board}</p>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-500">
                              Education Type
                            </span>
                            <p className="text-sm">
                              {getFormattedType(edu.type)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-500">
                              Percentage Score
                            </span>
                            <p className="text-sm font-medium">
                              {edu.percentage}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0 ml-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleEditEducation(edu)}
                          size="sm"
                          aria-label="Edit education"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onPress={() => edu._id && handleDelete(edu._id)}
                          size="sm"
                          aria-label="Delete education"
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
    </div>
  );
};

export default Education;
