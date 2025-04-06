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
  Badge,
  Tooltip,
  Divider,
  Skeleton,
} from "@nextui-org/react";
import {
  Edit2,
  Calendar,
  Plus,
  GraduationCap,
  Trash2,
  School,
  BookOpen,
  Award,
  AlertCircle,
  AlertTriangle,
  Building,
  Percent,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Candidate, Education as IEducation } from "@shared-types/Candidate";
import { toast } from "sonner";
import { z } from "zod";

// Constants for education data
const EDUCATION_TYPES = [
  { label: "Full Time", value: "fulltime" },
  { label: "Part Time", value: "parttime" },
  { label: "Distance Learning", value: "distance" },
];

const PROGRAMS = [
  "B.E.",
  "B.Tech",
  "M.Tech",
  "M.E.",
  "BCA",
  "MCA",
  "B.Sc",
  "M.Sc",
  "B.Com",
  "M.Com",
  "BBA",
  "MBA",
  "Diploma",
  "Ph.D",
  "HSC/12th",
  "SSC/10th",
];

// Define schema for validation
const educationSchema = z
  .object({
    school: z
      .string()
      .min(1, "Institution name is required")
      .max(200, "Institution name is too long"),
    board: z
      .string()
      .min(1, "Board/University is required")
      .max(200, "Board/University name is too long"),
    degree: z.string().min(1, "Degree is required"),
    branch: z
      .string()
      .min(1, "Branch/Specialization is required")
      .max(200, "Branch/Specialization name is too long"),
    startYear: z
      .number()
      .int()
      .min(1950, "Start year must be after 1950")
      .max(new Date().getFullYear(), "Start year cannot be in the future"),
    current: z.boolean(),
    endYear: z
      .number()
      .int()
      .min(1950, "End year must be after 1950")
      .max(new Date().getFullYear() + 10, "End year is too far in the future")
      .optional()
      .nullable(),
    type: z.enum(["fulltime", "parttime", "distance"]),
    percentage: z
      .number()
      .min(0, "Percentage cannot be negative")
      .max(100, "Percentage cannot exceed 100"),
    activeBacklogs: z
      .number()
      .min(0, "Active backlogs cannot be negative")
      .optional(),
    totalBacklogs: z
      .number()
      .min(0, "Total backlogs cannot be negative")
      .optional(),
  })
  .refine((data) => data.current || data.endYear !== null, {
    message: "End year is required when not a current program",
    path: ["endYear"],
  })
  .refine((data) => !(data.endYear && data.startYear > data.endYear), {
    message: "End year cannot be before start year",
    path: ["endYear"],
  })
  .refine(
    (data) =>
      !(
        data.activeBacklogs !== undefined &&
        data.totalBacklogs !== undefined &&
        data.activeBacklogs > data.totalBacklogs
      ),
    {
      message: "Active backlogs cannot exceed total backlogs",
      path: ["activeBacklogs"],
    }
  );

const Education = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
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
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<string | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<z.infer<typeof educationSchema>>({
    school: "",
    board: "",
    degree: "",
    branch: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    current: false,
    type: "fulltime",
    percentage: 0,
    activeBacklogs: 0,
    totalBacklogs: 0,
  });

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
    "Chemical Engineering",
    "Computer Engineering",
    "Biotechnology",
    "Aeronautical Engineering",
    "Commerce",
    "Business Administration",
    "Arts",
    "Science",
  ]);

  // Initialize education array if it doesn't exist
  useEffect(() => {
    if (user && !user.education) {
      setUser({ ...user, education: [] });
    }
  }, [user, setUser]);

  // Sort education records - most recent first
  const sortedEducation = [...(user?.education || [])].sort((a, b) => {
    // Put current education at top
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;

    // Then sort by start year (most recent first)
    return b.startYear - a.startYear;
  });

  useEffect(() => {
    // Reset validation errors when modal closes
    if (!isOpen) {
      setValidationErrors({});
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      school: "",
      board: "",
      degree: "",
      branch: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      current: false,
      type: "fulltime",
      percentage: 0,
      activeBacklogs: 0,
      totalBacklogs: 0,
    });
    setValidationErrors({});
    setIsEditing(false);
    setEditingEducationId(null);
  };

  const handleAddNewEducation = () => {
    resetForm();
    onOpen();
  };

  const handleEditEducation = (education: IEducation) => {
    try {
      setIsEditing(true);
      setEditingEducationId(education._id || null);

      setFormData({
        school: education.school,
        board: education.board,
        degree: education.degree,
        branch: education.branch,
        startYear: education.startYear,
        endYear: education.endYear || null,
        current: education.current,
        type: education.type,
        percentage: education.percentage,
        activeBacklogs: education.activeBacklogs || 0,
        totalBacklogs: education.totalBacklogs || 0,
      });

      onOpen();
    } catch (error) {
      console.error("Error editing education:", error);
      toast.error(
        "Could not edit this educational record. Invalid data format."
      );
    }
  };

  const validateForm = (): boolean => {
    try {
      educationSchema.parse(formData);
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
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Special handling for "current" checkbox
    if (field === "current" && value === true) {
      // Clear end date errors when setting to current position
      if (validationErrors.endYear) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.endYear;
          return newErrors;
        });
      }
    }

    // Additional validation for related fields
    if (field === "startYear") {
      const startYear = Number(value);
      const endYear = formData.endYear;

      if (endYear && !formData.current && startYear > endYear) {
        setValidationErrors((prev) => ({
          ...prev,
          startYear: "Start year cannot be after end year",
        }));
      }
    } else if (field === "endYear") {
      const endYear = Number(value);
      const startYear = formData.startYear;

      if (startYear > endYear) {
        setValidationErrors((prev) => ({
          ...prev,
          endYear: "End year cannot be before start year",
        }));
      }
    } else if (field === "activeBacklogs") {
      const active = Number(value);
      const total = formData.totalBacklogs;

      if (active > (total ?? 0)) {
        setValidationErrors((prev) => ({
          ...prev,
          activeBacklogs: "Active backlogs cannot exceed total backlogs",
        }));
      }
    } else if (field === "totalBacklogs") {
      const total = Number(value);
      const active = formData.activeBacklogs;

      if ((active ?? 0) > total) {
        setValidationErrors((prev) => ({
          ...prev,
          activeBacklogs: "Active backlogs cannot exceed total backlogs",
        }));
      }
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

    const updatedBranches = [...branches, newBranch.trim()].sort();
    setBranches(updatedBranches);
    handleInputChange("branch", newBranch.trim());
    setNewBranch("");
    onBranchModalClose();
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Find first error to display
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const newEducation: IEducation = {
        school: formData.school,
        board: formData.board,
        degree: formData.degree,
        branch: formData.branch,
        startYear: formData.startYear,
        endYear: formData.current ? undefined : formData.endYear || undefined,
        current: formData.current,
        type: formData.type,
        percentage: formData.percentage,
        activeBacklogs: formData.activeBacklogs || 0,
        totalBacklogs: formData.totalBacklogs || 0,
      };

      if (isEditing && editingEducationId) {
        // Update existing education
        const updatedEducation = (user.education || []).map((edu) =>
          edu._id === editingEducationId
            ? { ...newEducation, _id: edu._id, createdAt: edu.createdAt }
            : edu
        );

        // Update user education data
        setUser({
          ...user,
          education: updatedEducation,
          // Update aggregated academic data at top level
          academicAggregates: {
            ...(user.academicAggregates || {}),
            hasBacklogs: updatedEducation.some(
              (e) => (e.activeBacklogs || 0) > 0 || (e.totalBacklogs || 0) > 0
            ),
            activeBacklogs: updatedEducation.reduce(
              (sum, e) => sum + (e.activeBacklogs || 0),
              0
            ),
            totalBacklogs: updatedEducation.reduce(
              (sum, e) => sum + (e.totalBacklogs || 0),
              0
            ),
          },
        });

        toast.success("Education updated successfully");
      } else {
        // Add new education with unique ID
        const educationWithId: IEducation = {
          ...newEducation,
          _id: `edu_${Date.now()}`,
          createdAt: new Date(),
        };

        const updatedEducation = [...(user.education || []), educationWithId];

        setUser({
          ...user,
          education: updatedEducation,
          // Update aggregated academic data at top level
          academicAggregates: {
            ...(user.academicAggregates || {}),
            hasBacklogs: updatedEducation.some(
              (e) => (e.activeBacklogs || 0) > 0 || (e.totalBacklogs || 0) > 0
            ),
            activeBacklogs: updatedEducation.reduce(
              (sum, e) => sum + (e.activeBacklogs || 0),
              0
            ),
            totalBacklogs: updatedEducation.reduce(
              (sum, e) => sum + (e.totalBacklogs || 0),
              0
            ),
          },
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

  const confirmDelete = (id: string) => {
    setEducationToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = () => {
    if (!educationToDelete) return;
    setIsSubmitting(true);

    try {
      const updatedEducation = (user.education || []).filter(
        (edu) => edu._id !== educationToDelete
      );

      setUser({
        ...user,
        education: updatedEducation,
        // Update aggregated academic data at top level
        academicAggregates: {
          ...(user.academicAggregates || {}),
          hasBacklogs: updatedEducation.some(
            (e) => (e.activeBacklogs || 0) > 0 || (e.totalBacklogs || 0) > 0
          ),
          activeBacklogs: updatedEducation.reduce(
            (sum, e) => sum + (e.activeBacklogs || 0),
            0
          ),
          totalBacklogs: updatedEducation.reduce(
            (sum, e) => sum + (e.totalBacklogs || 0),
            0
          ),
        },
      });

      toast.success("Education record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete education record");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmationOpen(false);
      setEducationToDelete(null);
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

  // Get education level for display
  const getEducationLevel = (degree: string) => {
    const lowerDegree = degree.toLowerCase();

    if (lowerDegree.includes("phd") || lowerDegree.includes("doctorate")) {
      return "Doctoral";
    } else if (
      lowerDegree.includes("master") ||
      lowerDegree.includes("m.") ||
      lowerDegree === "mba" ||
      lowerDegree === "mca" ||
      lowerDegree === "m.tech" ||
      lowerDegree === "m.e."
    ) {
      return "Post Graduate";
    } else if (
      lowerDegree.includes("bachelor") ||
      lowerDegree.includes("b.") ||
      lowerDegree === "bba" ||
      lowerDegree === "bca" ||
      lowerDegree === "b.tech" ||
      lowerDegree === "b.e."
    ) {
      return "Under Graduate";
    } else if (lowerDegree.includes("diploma")) {
      return "Diploma";
    } else if (lowerDegree.includes("12th") || lowerDegree.includes("hsc")) {
      return "Higher Secondary";
    } else if (lowerDegree.includes("10th") || lowerDegree.includes("ssc")) {
      return "Secondary";
    }

    return "Other";
  };

  return (
    <div>
      {/* Main Education Modal */}
      <Modal
        size="3xl"
        isOpen={isOpen}
        onClose={() => !isSubmitting && onClose()}
        isDismissable={!isSubmitting}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <School size={20} className="text-primary" />
                  <h2 className="text-lg">
                    {isEditing
                      ? "Edit Education Details"
                      : "Add Education Details"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Update your academic qualification information"
                    : "Add details about your academic background"}
                </p>
              </ModalHeader>
              <ModalBody className="py-6">
                <div>
                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Institution/School Name"
                        placeholder="Enter institution name"
                        value={formData.school}
                        isRequired
                        isInvalid={!!validationErrors.school}
                        errorMessage={validationErrors.school}
                        onChange={(e) =>
                          handleInputChange("school", e.target.value)
                        }
                        
                        isDisabled={isSubmitting}
                        startContent={
                          <School size={16} className="text-gray-400" />
                        }
                        description="Name of the educational institution"
                      />
                      <Select
                        label="Program/Degree/Certificate"
                        placeholder="Select program"
                        isRequired
                        isInvalid={!!validationErrors.degree}
                        errorMessage={validationErrors.degree}
                        selectedKeys={formData.degree ? [formData.degree] : []}
                        onChange={(e) =>
                          handleInputChange("degree", e.target.value)
                        }
                        
                        isDisabled={isSubmitting}
                        startContent={
                          <BookOpen size={16} className="text-gray-400" />
                        }
                        description="Type of degree or program"
                      >
                        {PROGRAMS.map((prog) => (
                          <SelectItem key={prog} value={prog}>
                            {prog}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Board/University"
                        placeholder="Enter board or university name"
                        value={formData.board}
                        isRequired
                        isInvalid={!!validationErrors.board}
                        errorMessage={validationErrors.board}
                        onChange={(e) =>
                          handleInputChange("board", e.target.value)
                        }
                        
                        isDisabled={isSubmitting}
                        startContent={
                          <Building size={16} className="text-gray-400" />
                        }
                        description="Board or university affiliation"
                      />
                      <div className="flex flex-col gap-2">
                        <Select
                          label="Branch/Specialization"
                          placeholder="Select branch"
                          isRequired
                          isInvalid={!!validationErrors.branch}
                          errorMessage={validationErrors.branch}
                          selectedKeys={
                            formData.branch ? [formData.branch] : []
                          }
                          onChange={(e) =>
                            handleInputChange("branch", e.target.value)
                          }
                          
                          isDisabled={isSubmitting}
                          description="Field of study or specialization"
                        >
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </Select>
                        <Button
                          
                          variant="light"
                          className="self-start"
                          onPress={onBranchModalOpen}
                          isDisabled={isSubmitting}
                        >
                          Add New Branch/Specialization
                        </Button>
                      </div>

                      <Select
                        label="Education Type"
                        placeholder="Select type"
                        isRequired
                        isInvalid={!!validationErrors.type}
                        errorMessage={validationErrors.type}
                        selectedKeys={formData.type ? [formData.type] : []}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        
                        isDisabled={isSubmitting}
                        startContent={
                          <Clock size={16} className="text-gray-400" />
                        }
                        description="Mode of education"
                      >
                        {EDUCATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Score in Percentage"
                        placeholder="Enter percentage"
                        type="number"
                        value={
                          formData.percentage
                            ? formData.percentage.toString()
                            : "0"
                        }
                        isRequired
                        isInvalid={!!validationErrors.percentage}
                        errorMessage={validationErrors.percentage}
                        endContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              %
                            </span>
                          </div>
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value);
                          handleInputChange("percentage", value);
                        }}
                        
                        isDisabled={isSubmitting}
                        startContent={
                          <Percent size={16} className="text-gray-400" />
                        }
                        description="Your academic score as percentage"
                      />
                    </div>

                    <Divider className="my-4" />

                    {/* Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Start Year"
                        placeholder="YYYY"
                        value={
                          formData.startYear
                            ? formData.startYear.toString()
                            : ""
                        }
                        isRequired
                        isInvalid={!!validationErrors.startYear}
                        errorMessage={validationErrors.startYear}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value);
                          handleInputChange("startYear", value);
                        }}
                        endContent={
                          <Calendar className="text-gray-400" size={16} />
                        }
                        
                        isDisabled={isSubmitting}
                        description="Year you started this program"
                      />
                      <Input
                        label="End Year"
                        placeholder="YYYY"
                        value={
                          formData.endYear ? formData.endYear.toString() : ""
                        }
                        isRequired={!formData.current}
                        isDisabled={formData.current || isSubmitting}
                        isInvalid={!!validationErrors.endYear}
                        errorMessage={validationErrors.endYear}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value);
                          handleInputChange("endYear", value);
                        }}
                        endContent={
                          <Calendar className="text-gray-400" size={16} />
                        }
                        
                        description={
                          formData.current
                            ? "Not required for current programs"
                            : "Year you completed this program"
                        }
                      />

                      <div className="col-span-2 mt-1">
                        <Checkbox
                          isSelected={formData.current}
                          onValueChange={(selected) => {
                            handleInputChange("current", selected);
                          }}
                          isDisabled={isSubmitting}
                        >
                          I am currently pursuing this degree
                        </Checkbox>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-6" />

                  {/* Backlogs Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle size={16} className="text-yellow-500" />
                      <h3 className="font-medium">Backlogs Information</h3>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-500 mt-0.5 flex-shrink-0">
                          <AlertCircle size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">
                            Backlogs are academic subjects that a student has
                            failed to clear. Active backlogs are subjects you
                            still need to pass, while total backlogs include
                            both cleared and pending subjects.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Active Backlogs"
                        placeholder="Number of active backlogs"
                        type="number"
                        min={0}
                        value={
                          formData.activeBacklogs !== undefined
                            ? formData.activeBacklogs.toString()
                            : "0"
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value);
                          handleInputChange("activeBacklogs", value);
                        }}
                        description="Subjects you still need to clear"
                        isInvalid={!!validationErrors.activeBacklogs}
                        errorMessage={validationErrors.activeBacklogs}
                        
                        isDisabled={isSubmitting}
                      />

                      <Input
                        label="Total Backlogs"
                        placeholder="Total number of backlogs"
                        type="number"
                        min={0}
                        value={
                          formData.totalBacklogs !== undefined
                            ? formData.totalBacklogs.toString()
                            : "0"
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value);
                          handleInputChange("totalBacklogs", value);
                        }}
                        description="All backlogs ever received (including cleared ones)"
                        isInvalid={!!validationErrors.totalBacklogs}
                        errorMessage={validationErrors.totalBacklogs}
                        
                        isDisabled={isSubmitting}
                      />
                    </div>
                  </div>
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
                  isDisabled={isSubmitting}
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
        
        isOpen={isBranchModalOpen}
        onClose={onBranchModalClose}
        isDismissable={!isSubmitting}
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
                  
                  isDisabled={isSubmitting}
                  autoFocus
                />
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  color="default"
                  variant="light"
                  onPress={onBranchModalClose}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleAddBranch}
                  isDisabled={!newBranch.trim() || isSubmitting}
                >
                  Add Branch
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmationOpen}
        onClose={() => !isSubmitting && setDeleteConfirmationOpen(false)}
        
        isDismissable={!isSubmitting}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b">Confirm Delete</ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 py-2">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this education record? This
                    action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  variant="flat"
                  onPress={() => setDeleteConfirmationOpen(false)}
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

      {/* Education Dashboard */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/education">Education</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Education Information</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your academic qualifications and certifications
          </p>
        </div>
        <Button
          color="primary"
          onPress={handleAddNewEducation}
          startContent={<Plus size={18} />}
        >
          Add Education
        </Button>
      </div>

      {/* Academic Summary Card */}
      {user?.academicAggregates?.hasBacklogs && (
        <Card className="w-full mb-6 border-warning-200 bg-warning-50">
          <CardBody className="py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-100 rounded-lg">
                <AlertTriangle size={20} className="text-warning-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-warning-700">
                  Academic Status
                </h3>
                <div className="flex flex-wrap gap-4 text-sm mt-1">
                  <div className="flex gap-1 items-center">
                    <Badge
                      color="warning"
                      content={user?.academicAggregates?.activeBacklogs || 0}
                    >
                      <span className="text-warning-600">Active Backlogs</span>
                    </Badge>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Badge
                      color="default"
                      content={user?.academicAggregates?.totalBacklogs || 0}
                    >
                      <span className="text-gray-600">Total Backlogs</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="w-full border shadow-sm">
                <CardBody className="p-6">
                  <div className="flex items-start w-full gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="w-full space-y-3">
                      <Skeleton className="h-6 w-1/3 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <Skeleton className="h-4 rounded-lg" />
                        <Skeleton className="h-4 rounded-lg" />
                        <Skeleton className="h-4 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
        ) : !sortedEducation.length ? (
          <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
            <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="bg-primary-50 p-5 rounded-full">
                <GraduationCap size={36} className="text-primary" />
              </div>
              <div className="text-center max-w-lg">
                <h3 className="text-xl font-medium mb-2">
                  No Education Records Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Your educational background helps employers understand your
                  academic qualifications. Add details about your degrees,
                  certificates, and academic achievements to enhance your
                  profile.
                </p>
                <Button
                  color="primary"
                  onPress={handleAddNewEducation}
                  startContent={<Plus size={18} />}
                  size="lg"
                >
                  Add Your First Education
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            {sortedEducation.map((edu) => (
              <Card key={edu._id} className="w-full shadow-sm">
                <CardBody className="p-5">
                  <div className="flex items-start w-full gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary shrink-0 font-medium">
                      <School size={24} />
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-medium">
                            {edu.degree} {edu.branch && `- ${edu.branch}`}
                          </h3>
                          {edu.current && (
                            <Chip
                              
                              color="primary"
                              variant="flat"
                              startContent={<Clock size={12} />}
                            >
                              Currently Pursuing
                            </Chip>
                          )}
                          <Chip  variant="flat" color="secondary">
                            {getEducationLevel(edu.degree)}
                          </Chip>
                          {(edu.activeBacklogs || 0) > 0 && (
                            <Tooltip
                              content={`${edu.activeBacklogs} active, ${edu.totalBacklogs} total backlogs`}
                              color="warning"
                            >
                              <Chip  color="warning" variant="flat">
                                <div className="flex items-center gap-1">
                                  <AlertTriangle size={12} />
                                  <span>Backlogs: {edu.activeBacklogs}</span>
                                </div>
                              </Chip>
                            </Tooltip>
                          )}
                        </div>

                        <p className="text-gray-600 mt-1">{edu.school}</p>
                        <p className="text-gray-500 text-sm mt-1">
                          {edu.startYear} -{" "}
                          {edu.current ? "Present" : edu.endYear}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                          <div>
                            <span className="text-xs text-gray-500">
                              Board/University
                            </span>
                            <p className="text-sm font-medium">{edu.board}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              Education Type
                            </span>
                            <p className="text-sm">
                              {getFormattedType(edu.type)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">
                              Percentage Score
                            </span>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium">
                                {edu.percentage}%
                              </p>
                              {edu.percentage >= 75 && (
                                <Tooltip content="Distinction">
                                  <Award size={14} className="text-amber-500" />
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>

                        {(edu.activeBacklogs !== undefined ||
                          edu.totalBacklogs !== undefined) &&
                          ((edu?.activeBacklogs ?? 0) > 0 ||
                            (edu?.totalBacklogs ?? 0) > 0) && (
                            <div className="mt-4 flex flex-wrap gap-4">
                              {edu.activeBacklogs !== undefined && (
                                <div>
                                  <span className="text-xs text-gray-500">
                                    Active Backlogs
                                  </span>
                                  <p className="text-sm font-medium">
                                    {edu.activeBacklogs}
                                  </p>
                                </div>
                              )}
                              {edu.totalBacklogs !== undefined && (
                                <div>
                                  <span className="text-xs text-gray-500">
                                    Total Backlogs
                                  </span>
                                  <p className="text-sm font-medium">
                                    {edu.totalBacklogs}
                                  </p>
                                </div>
                              )}
                              {edu.totalBacklogs !== undefined &&
                                edu.activeBacklogs !== undefined &&
                                edu.totalBacklogs > edu.activeBacklogs && (
                                  <div>
                                    <span className="text-xs text-gray-500">
                                      Cleared Backlogs
                                    </span>
                                    <p className="text-sm font-medium">
                                      {edu.totalBacklogs - edu.activeBacklogs}
                                    </p>
                                  </div>
                                )}
                            </div>
                          )}
                      </div>

                      <div className="flex gap-2 shrink-0 ml-2">
                        <Tooltip content="Edit education">
                          <Button
                            isIconOnly
                            variant="light"
                            onPress={() => handleEditEducation(edu)}
                            
                            aria-label="Edit education"
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete education" color="danger">
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onPress={() => confirmDelete(edu._id || "")}
                            
                            aria-label="Delete education"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
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
