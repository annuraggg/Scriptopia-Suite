import { useState } from "react";
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
} from "@nextui-org/react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { Plus, Pencil, Trash2, School } from "lucide-react";
import { toast } from "sonner";

// Zod schema for form validation
const scholarshipSchema = z.object({
  position: z.string().min(1, "Position title is required"),
  associatedWith: z.string().min(1, "Associated organization is required"),
  grantDate: z
    .date({
      required_error: "Grant date is required",
      invalid_type_error: "Grant date must be a valid date",
    })
    .max(new Date(), "Grant date cannot be in the future"),
  description: z.string().optional(),
});

// Types derived from Zod schema
type ScholarshipFormData = z.infer<typeof scholarshipSchema>;
interface Scholarship extends ScholarshipFormData {
  id: string;
}

// Organization data
const organizations = [
  { label: "Harvard University", value: "Harvard University" },
  { label: "MIT", value: "MIT" },
  { label: "Stanford University", value: "Stanford University" },
  { label: "Other", value: "Other" },
];

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [editingScholarshipId, setEditingScholarshipId] = useState<
    string | null
  >(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState<ScholarshipFormData>({
    position: "",
    associatedWith: "",
    grantDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    description: "",
  });

  // Custom organization input for "Other" option
  const [showCustomOrg, setShowCustomOrg] = useState(false);
  const [customOrg, setCustomOrg] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData((prev) => ({ ...prev, associatedWith: "" }));
    } else {
      setShowCustomOrg(false);
      setFormData((prev) => ({ ...prev, associatedWith: value }));
    }
  };

  // Validate form with Zod
  const validateForm = () => {
    try {
      scholarshipSchema.parse(formData);
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
      position: "",
      associatedWith: "",
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
    resetForm();
    onClose();
  };

  // Handle form submission
  const handleSave = async () => {
    setIsSubmitting(true);

    if (showCustomOrg && customOrg.trim()) {
      setFormData((prev) => ({ ...prev, associatedWith: customOrg.trim() }));
    }

    // Validate after custom org is set
    setTimeout(() => {
      try {
        const isValid = validateForm();
        if (!isValid) {
          setIsSubmitting(false);
          return;
        }

        if (editingScholarshipId) {
          setScholarships((prev) =>
            prev.map((s) =>
              s.id === editingScholarshipId ? { ...formData, id: s.id } : s
            )
          );
          toast.success("Scholarship updated successfully");
        } else {
          setScholarships((prev) => [
            ...prev,
            { ...formData, id: crypto.randomUUID() },
          ]);
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

  // Load editing scholarship data
  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarshipId(scholarship.id);
    setFormData({
      position: scholarship.position,
      associatedWith: scholarship.associatedWith,
      grantDate: new Date(scholarship.grantDate),
      description: scholarship.description || "",
    });

    // Check if it's a custom organization
    const isPresetOrg = organizations.some(
      (org) => org.value === scholarship.associatedWith
    );
    setShowCustomOrg(!isPresetOrg);
    if (!isPresetOrg) {
      setCustomOrg(scholarship.associatedWith);
    }

    setErrors({});
    onOpen();
  };

  // Handle delete confirmation
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
      setScholarships((prev) => prev.filter((s) => s.id !== id));
      toast.success("Scholarship deleted successfully");
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Scholarships</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Scholarships & Grants</h1>
        <Button
          color="primary"
          onPress={onOpen}
          startContent={<Plus size={18} />}
        >
          Add Scholarship
        </Button>
      </div>

      {scholarships.length === 0 ? (
        <Card className="w-full shadow-sm">
          <CardBody className="py-8 flex flex-col items-center justify-center gap-4">
            <School size={36} className="text-gray-400" />
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">
                No Scholarships Added
              </h3>
              <p className="text-gray-500 mb-4">
                Add information about scholarships and grants you've received
              </p>
              <Button
                color="primary"
                onPress={onOpen}
                startContent={<Plus size={16} />}
              >
                Add Scholarship
              </Button>
            </div>
          </CardBody>
        </Card>
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
            {scholarships.map((scholarship) => (
              <TableRow key={scholarship.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{scholarship.position}</p>
                    {scholarship.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {scholarship.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{scholarship.associatedWith}</TableCell>
                <TableCell>{formatDate(scholarship.grantDate)}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => handleEdit(scholarship)}
                      aria-label="Edit scholarship"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(scholarship.id)}
                      aria-label="Delete scholarship"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="md"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {editingScholarshipId
                  ? "Edit Scholarship"
                  : "Add New Scholarship"}
              </ModalHeader>
              <Divider />
              <ModalBody className="py-4">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Position Title"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                    placeholder="Research Fellowship"
                  />

                  <div>
                    <Select
                      label="Associated Organization"
                      selectedKeys={
                        showCustomOrg
                          ? ["Other"]
                          : formData.associatedWith
                          ? [formData.associatedWith]
                          : []
                      }
                      onChange={(e) => handleOrgChange(e.target.value)}
                      isRequired
                      isInvalid={!!errors.associatedWith}
                      errorMessage={errors.associatedWith}
                      placeholder="Select an organization"
                    >
                      {organizations.map((org) => (
                        <SelectItem key={org.value} value={org.value}>
                          {org.label}
                        </SelectItem>
                      ))}
                    </Select>

                    {showCustomOrg && (
                      <Input
                        label="Organization Name"
                        value={customOrg}
                        onChange={(e) => {
                          setCustomOrg(e.target.value);
                          handleInputChange("associatedWith", e.target.value);
                        }}
                        isRequired
                        className="mt-2"
                        placeholder="Enter organization name"
                      />
                    )}
                  </div>

                  <div>
                    <DatePicker
                      label="Grant Date"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(
                        formData.grantDate.toISOString()
                      )}
                      onChange={handleDateChange}
                      isInvalid={!!errors.grantDate}
                    />
                    {errors.grantDate && (
                      <p className="text-xs text-danger mt-1">
                        {errors.grantDate}
                      </p>
                    )}
                  </div>

                  <Textarea
                    label="Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Briefly describe the scholarship or grant"
                    minRows={3}
                  />
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button color="default" variant="flat" onPress={handleClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                >
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

export default Scholarships;
