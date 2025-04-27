import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  Select,
  SelectItem,
  Breadcrumbs,
  BreadcrumbItem,
  DatePicker,
  Card,
  CardBody,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tooltip,
  Skeleton,
} from "@heroui/react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { Plus, Pencil, Trash2, School, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Scholarship, Candidate } from "@shared-types/Candidate";

// Zod schema for form validation - adapted to new Scholarship type
const scholarshipSchema = z.object({
  title: z.string().min(1, "Scholarship title is required"),
  organization: z.string().min(1, "Organization is required"),
  grantDate: z
    .date({
      required_error: "Grant date is required",
      invalid_type_error: "Grant date must be a valid date",
    })
    .max(new Date(), "Grant date cannot be in the future"),
  description: z.string().min(1, "Description is required"),
});

// Type for form data
type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

// Organization data - expanded with more institutions
const organizations = [
  // US Universities
  { label: "Harvard University", value: "Harvard University" },
  {
    label: "Massachusetts Institute of Technology (MIT)",
    value: "Massachusetts Institute of Technology",
  },
  { label: "Stanford University", value: "Stanford University" },
  {
    label: "California Institute of Technology (Caltech)",
    value: "California Institute of Technology",
  },
  { label: "Princeton University", value: "Princeton University" },
  { label: "Yale University", value: "Yale University" },
  { label: "Columbia University", value: "Columbia University" },
  { label: "University of Chicago", value: "University of Chicago" },
  {
    label: "University of California, Berkeley",
    value: "University of California, Berkeley",
  },
  { label: "Cornell University", value: "Cornell University" },

  // International Universities
  { label: "University of Oxford", value: "University of Oxford" },
  { label: "University of Cambridge", value: "University of Cambridge" },
  { label: "ETH Zurich", value: "ETH Zurich" },
  { label: "Imperial College London", value: "Imperial College London" },
  { label: "University of Toronto", value: "University of Toronto" },
  {
    label: "National University of Singapore",
    value: "National University of Singapore",
  },
  { label: "Peking University", value: "Peking University" },
  { label: "Tsinghua University", value: "Tsinghua University" },
  { label: "University of Tokyo", value: "University of Tokyo" },
  {
    label: "Australian National University",
    value: "Australian National University",
  },

  // Research Institutions
  {
    label: "National Science Foundation (NSF)",
    value: "National Science Foundation",
  },
  {
    label: "National Institutes of Health (NIH)",
    value: "National Institutes of Health",
  },
  { label: "Max Planck Society", value: "Max Planck Society" },
  {
    label: "Howard Hughes Medical Institute",
    value: "Howard Hughes Medical Institute",
  },
  { label: "Wellcome Trust", value: "Wellcome Trust" },

  // Foundations
  { label: "Gates Foundation", value: "Gates Foundation" },
  { label: "Ford Foundation", value: "Ford Foundation" },
  { label: "Rockefeller Foundation", value: "Rockefeller Foundation" },
  { label: "MacArthur Foundation", value: "MacArthur Foundation" },
  { label: "Fulbright Program", value: "Fulbright Program" },
  { label: "Rhodes Trust", value: "Rhodes Trust" },

  // Custom option
  { label: "Other (Specify)", value: "Other" },
];

const Scholarships = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  const [editingScholarshipId, setEditingScholarshipId] = useState<
    string | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] = useState<string | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<ScholarshipFormData>({
    title: "",
    organization: "",
    grantDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    description: "",
  });

  // Custom organization input for "Other" option
  const [showCustomOrg, setShowCustomOrg] = useState(false);
  const [customOrg, setCustomOrg] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize scholarships array if undefined
  useEffect(() => {
    if (!user.scholarships) {
      setUser({ ...user, scholarships: [] });
    }
  }, [user, setUser]);

  // Handle input changes
  const handleInputChange = (field: keyof ScholarshipFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error on field change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle date change
  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    handleInputChange("grantDate", dateObj);
  };

  // Handle organization selection
  const handleOrgChange = (value: string) => {
    if (value === "Other") {
      setShowCustomOrg(true);
      setFormData((prev) => ({ ...prev, organization: "" }));
      setCustomOrg("");
    } else {
      setShowCustomOrg(false);
      setFormData((prev) => ({ ...prev, organization: value }));
    }
  };

  // Validate form with Zod
  const validateForm = () => {
    try {
      // Handle custom org validation separately to ensure it's set before validation
      if (showCustomOrg && !customOrg.trim()) {
        setErrors((prev) => ({
          ...prev,
          organization: "Organization name is required",
        }));
        return false;
      }

      // If using custom org, ensure it's in the formData
      const dataToValidate = showCustomOrg
        ? { ...formData, organization: customOrg.trim() }
        : formData;

      scholarshipSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      grantDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      description: "",
    });
    setShowCustomOrg(false);
    setCustomOrg("");
    setErrors({});
    setEditingScholarshipId(null);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  // Open modal for adding or editing a scholarship
  const handleOpenModal = (scholarship?: Scholarship) => {
    if (scholarship) {
      // Editing existing scholarship
      setEditingScholarshipId(scholarship._id || null);
      setFormData({
        title: scholarship.title,
        organization: scholarship.organization,
        grantDate: new Date(scholarship.grantDate),
        description: scholarship.description,
      });

      // Check if it's a custom organization
      const isPresetOrg = organizations.some(
        (org) => org.value === scholarship.organization
      );

      if (isPresetOrg) {
        setShowCustomOrg(false);
      } else {
        setShowCustomOrg(true);
        setCustomOrg(scholarship.organization);
      }
    } else {
      // Adding new scholarship
      resetForm();
      setEditingScholarshipId(null);
    }
    onOpen();
  };

  // Handle form submission
  const handleSave = async () => {
    setIsSubmitting(true);

    // Update organization with custom org value if applicable
    if (showCustomOrg) {
      setFormData((prev) => ({ ...prev, organization: customOrg.trim() }));
    }

    // Validate after custom org is set
    setTimeout(() => {
      try {
        if (!validateForm()) {
          setIsSubmitting(false);
          return;
        }

        // Prepare the data to save with custom org if needed
        const dataToSave: Scholarship = {
          ...formData,
          organization: showCustomOrg
            ? customOrg.trim()
            : formData.organization,
          createdAt: new Date(),
        };

        if (editingScholarshipId) {
          // Update existing scholarship
          const newScholarships = (user?.scholarships || []).map((s) =>
            s._id === editingScholarshipId ? { ...dataToSave, _id: s._id } : s
          );

          setUser({ ...user, scholarships: newScholarships });
          toast.success("Scholarship updated successfully");
        } else {
          // Add new scholarship
          setUser({
            ...user,
            scholarships: [...(user.scholarships || []), dataToSave],
          });
          toast.success("Scholarship added successfully");
        }

        handleClose();
      } catch (error) {
        console.error("Error saving scholarship:", error);
        toast.error("Failed to save scholarship");
      } finally {
        setIsSubmitting(false);
      }
    }, 10);
  };

  // Confirm deletion of a scholarship
  const confirmDelete = (id: string) => {
    setScholarshipToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (!scholarshipToDelete) return;
    setIsSubmitting(true);

    try {
      const newScholarships = (user?.scholarships || []).filter(
        (s) => s._id !== scholarshipToDelete
      );
      setUser({ ...user, scholarships: newScholarships });
      toast.success("Scholarship deleted successfully");
    } catch (error) {
      toast.error("Failed to delete scholarship");
      console.error(error);
    } finally {
      setScholarshipToDelete(null);
      setIsConfirmDeleteOpen(false);
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Empty state component
  const renderEmptyState = () => (
    <Card className="w-full bg-gray-50 border-dashed border-2 border-gray-200">
      <CardBody className="py-12 flex flex-col items-center justify-center gap-4">
        <div className="bg-primary-50 p-5 rounded-full">
          <School size={36} className="text-primary" />
        </div>
        <div className="text-center max-w-lg">
          <h3 className="text-xl font-medium mb-2">
            No Scholarships Added Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add information about scholarships and grants you've received to
            showcase your academic achievements.
          </p>
          <Button
            color="primary"
            onClick={() => handleOpenModal()}
            startContent={<Plus size={18} />}
            size="lg"
          >
            Add Your First Scholarship
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Scholarships</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Scholarships & Grants</h1>
          <p className="text-gray-500 text-sm mt-1">
            Showcase your academic achievements and recognitions
          </p>
        </div>
        {!isLoading && (user?.scholarships?.length ?? 0) > 0 && (
          <Button
            color="primary"
            onClick={() => handleOpenModal()}
            startContent={<Plus size={16} />}
          >
            Add Scholarship
          </Button>
        )}
      </div>
      {isLoading ? (
        // Skeleton loader for loading state
        <div className="space-y-4">
          <Skeleton className="w-full h-32 rounded-lg" />
          <Skeleton className="w-full h-32 rounded-lg" />
        </div>
      ) : !user?.scholarships?.length ? (
        renderEmptyState()
      ) : (
        <Table
          aria-label="Scholarships table"
          removeWrapper
          shadow="sm"
          className="rounded-md border"
        >
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>ORGANIZATION</TableColumn>
            <TableColumn>GRANT DATE</TableColumn>
            <TableColumn width={100}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {user.scholarships.map((scholarship) => (
              <TableRow key={scholarship._id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{scholarship.title}</p>
                    {scholarship.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {scholarship.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{scholarship.organization}</TableCell>
                <TableCell>
                  {formatDate(new Date(scholarship.grantDate))}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Tooltip content="Edit scholarship">
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={() => handleOpenModal(scholarship)}
                        aria-label="Edit scholarship"
                      >
                        <Pencil size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete scholarship" color="danger">
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onClick={() => confirmDelete(scholarship._id!)}
                        aria-label="Delete scholarship"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Scholarship Form Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleClose}
        size="md"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <School size={20} className="text-primary" />
                  <h3 className="text-lg">
                    {editingScholarshipId
                      ? "Edit Scholarship"
                      : "Add New Scholarship"}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  {editingScholarshipId
                    ? "Update the details of your scholarship"
                    : "Add information about scholarships and grants you've received"}
                </p>
              </ModalHeader>
              <Divider />
              <ModalBody className="py-4">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Scholarship Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    placeholder="Research Fellowship"
                    isDisabled={isSubmitting}
                  />

                  <div>
                    <Select
                      label="Organization"
                      selectedKeys={
                        showCustomOrg
                          ? ["Other"]
                          : formData.organization
                          ? [formData.organization]
                          : []
                      }
                      onChange={(e) => handleOrgChange(e.target.value)}
                      isRequired
                      isInvalid={!!errors.organization}
                      errorMessage={errors.organization}
                      placeholder="Select an organization"
                      isDisabled={isSubmitting}
                    >
                      {organizations.map((org) => (
                        <SelectItem key={org.value}>{org.label}</SelectItem>
                      ))}
                    </Select>

                    {showCustomOrg && (
                      <Input
                        label="Organization Name"
                        value={customOrg}
                        onChange={(e) => {
                          setCustomOrg(e.target.value);
                        }}
                        isRequired
                        isInvalid={!!errors.organization}
                        errorMessage={errors.organization}
                        className="mt-2"
                        placeholder="Enter organization name"
                        isDisabled={isSubmitting}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Grant Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Grant Date"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(
                        formData.grantDate.toISOString()
                      )}
                      onChange={handleDateChange}
                      isInvalid={!!errors.grantDate}
                      isDisabled={isSubmitting}
                      hideTimeZone
                    />
                    {errors.grantDate && (
                      <p className="text-xs text-danger mt-1">
                        {errors.grantDate}
                      </p>
                    )}
                    <p className="text-tiny text-default-500 mt-1">
                      When you received this scholarship or grant
                    </p>
                  </div>

                  <Textarea
                    label="Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Briefly describe the scholarship or grant"
                    minRows={3}
                    isRequired
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    isDisabled={isSubmitting}
                    description="Provide details about the scholarship, its purpose, and your achievements"
                  />
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter className="border-t">
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleClose}
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
                  {editingScholarshipId ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Confirmation Modal for Delete */}
      <Modal
        isDismissable={false}
        isOpen={isConfirmDeleteOpen}
        onClose={() => !isSubmitting && setIsConfirmDeleteOpen(false)}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b">
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this scholarship? This
                    action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  variant="light"
                  onPress={() => !isSubmitting && setIsConfirmDeleteOpen(false)}
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
    </div>
  );
};

export default Scholarships;
