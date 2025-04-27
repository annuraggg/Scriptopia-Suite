import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  BreadcrumbItem,
  Breadcrumbs,
  DatePicker,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Tooltip,
  Skeleton,
} from "@heroui/react";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  ZonedDateTime,
} from "@internationalized/date";
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  AlertCircle,
  Calendar,
  Award as AwardIcon,
  Building,
  Info,
  School,
} from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Award, Candidate } from "@shared-types/Candidate";
import { z } from "zod";

// Define award types for better type safety
const awardTypes = ["academic", "professional", "personal"] as const;
type AwardType = (typeof awardTypes)[number];

// Zod validation schema with more detailed error messages
const awardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  issuer: z
    .string()
    .min(1, "Issuer organization is required")
    .max(100, "Issuer name is too long"),
  associatedWith: z.enum(["academic", "professional", "personal"], {
    errorMap: () => ({ message: "Please select a valid award type" }),
  }),
  date: z
    .date()
    .max(new Date(), "Date cannot be in the future")
    .refine(
      (date) => date >= new Date("1950-01-01"),
      "Date is too far in the past"
    ),
  description: z.string().max(500, "Description is too long").optional(),
});

type AwardFormData = z.infer<typeof awardSchema>;

const Awards = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  // Form states
  const [formData, setFormData] = useState<AwardFormData>({
    title: "",
    issuer: "",
    associatedWith: "academic",
    date: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    description: "",
  });

  // Form errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof AwardFormData, string>>
  >({});

  // Current award being edited
  const [currentAward, setCurrentAward] = useState<string | null>(null);

  // State for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Sort awards by date (most recent first)
  const sortedAwards = [...(user?.awards || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      associatedWith: "academic",
      date: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      description: "",
    });
    setErrors({});
    setCurrentAward(null);
  };

  // Handle opening modal for new award or editing existing one
  const handleOpenModal = (award?: Award) => {
    if (award) {
      setCurrentAward(award._id || null);
      setFormData({
        title: award.title,
        issuer: award.issuer,
        associatedWith: award.associatedWith as AwardType,
        date: new Date(award.date),
        description: award.description || "",
      });
    } else {
      resetForm();
    }
    onOpen();
  };

  // Handle closing modal
  const handleCloseModal = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    resetForm();
    onClose();
  };

  // Validate form data
  const validateForm = (): boolean => {
    try {
      awardSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof AwardFormData, string>> = {};
        err.errors.forEach((error) => {
          const path = error.path[0] as keyof AwardFormData;
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle saving award
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      if (currentAward) {
        // Edit existing award
        const awards = user?.awards || [];
        const newAwards = awards.map((award) =>
          award._id === currentAward
            ? {
                ...award,
                ...formData,
                updatedAt: new Date(),
              }
            : award
        );

        setUser({
          ...user,
          awards: newAwards,
        });
        toast.success("Award updated successfully");
      } else {
        // Add new award
        const newAwards = user?.awards || [];
        setUser({
          ...user,
          awards: [
            ...newAwards,
            {
              ...formData,
              createdAt: new Date(),
            } as Award,
          ],
        });
        toast.success("Award added successfully");
      }

      handleCloseModal();
    } catch (error) {
      toast.error("An error occurred while saving the award");
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting award
  const handleDelete = (id: string) => {
    try {
      setIsSubmitting(true);
      const awards = user?.awards || [];
      setUser({
        ...user,
        awards: awards.filter((award) => award._id !== id),
      });
      toast.success("Award deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("An error occurred while deleting the award");
      console.error("Delete error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof AwardFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user makes a change
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle date picker change
  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    handleInputChange("date", dateObj);
  };

  // Get award type styling
  const getAwardTypeChip = (type: string) => {
    const styles = {
      academic: {
        color: "primary" as const,
        icon: <School className="w-3 h-3" />,
      },
      professional: {
        color: "success" as const,
        icon: <Building className="w-3 h-3" />,
      },
      personal: {
        color: "secondary" as const,
        icon: <Trophy className="w-3 h-3" />,
      },
    };

    const defaultStyle = {
      color: "default" as const,
      icon: <Trophy className="w-3 h-3" />,
    };

    return styles[type as keyof typeof styles] || defaultStyle;
  };

  // Format date for better display
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Confirmation dialog for delete
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div>
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/awards">
          Awards & Recognitions
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Awards & Recognitions</h1>
          <p className="text-gray-500 text-sm mt-1">
            Showcase your achievements and recognitions
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => handleOpenModal()}
        >
          Add Award
        </Button>
      </div>
      {isLoading ? (
        // Skeleton loaders for loading state
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="flex justify-between items-center">
                <Skeleton className="h-8 w-1/3 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/2 rounded-lg" />
                  <Skeleton className="h-6 w-1/4 rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : !user?.awards || user.awards.length === 0 ? (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
          <CardBody className="flex flex-col items-center py-12">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <AwardIcon size={36} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Awards Added Yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Showcase your achievements by adding awards, recognitions or
              honors that you've received during your academic or professional
              journey.
            </p>
            <Button
              color="primary"
              startContent={<Plus size={18} />}
              onPress={() => handleOpenModal()}
              size="lg"
            >
              Add Your First Award
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedAwards.map((award) => (
            <Card key={award._id} className="w-full shadow-sm">
              <CardHeader className="flex justify-between items-center px-6 py-4 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{award.title}</h3>
                  <Chip
                    color={getAwardTypeChip(award.associatedWith).color}
                    variant="flat"
                    startContent={getAwardTypeChip(award.associatedWith).icon}
                  >
                    {award.associatedWith.charAt(0).toUpperCase() +
                      award.associatedWith.slice(1)}
                  </Chip>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="Edit award details">
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => handleOpenModal(award)}
                      aria-label="Edit award"
                    >
                      <Edit2 size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete award">
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => setDeleteConfirmId(award._id as string)}
                      aria-label="Delete award"
                      isDisabled={isSubmitting}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardBody className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Building size={16} className="mr-2" />
                    <span className="font-medium">
                      Issued by: {award.issuer}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Date received: {formatDate(award.date)}</span>
                  </div>
                  {award.description && (
                    <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                      {award.description}
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      {/* Add/Edit Award Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg">
                  {currentAward ? "Edit Award" : "Add New Award"}
                </h3>
                <p className="text-small text-gray-500">
                  {currentAward
                    ? "Update the details of your award or recognition"
                    : "Share details about an award or recognition you've received"}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5">
                  <Input
                    label="Award Title"
                    placeholder="E.g. Dean's List, Employee of the Month"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    aria-label="Award title"
                    startContent={
                      <Trophy size={16} className="text-gray-400" />
                    }
                    description="Enter the full name of the award or recognition"
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Issuer/Organization"
                    placeholder="E.g. University of California, Microsoft Corp."
                    value={formData.issuer}
                    onChange={(e) =>
                      handleInputChange("issuer", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.issuer}
                    errorMessage={errors.issuer}
                    aria-label="Award issuer"
                    startContent={
                      <Building size={16} className="text-gray-400" />
                    }
                    description="Organization that granted the award or recognition"
                    disabled={isSubmitting}
                  />

                  <Select
                    label="Award Type"
                    selectedKeys={[formData.associatedWith]}
                    onChange={(e) =>
                      handleInputChange("associatedWith", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.associatedWith}
                    errorMessage={errors.associatedWith}
                    aria-label="Award type"
                    startContent={<Info size={16} className="text-gray-400" />}
                    description="Category that best describes this award"
                    disabled={isSubmitting}
                  >
                    <SelectItem
                      key="academic"
                      startContent={<School size={16} />}
                    >
                      Academic
                    </SelectItem>
                    <SelectItem
                      key="professional"
                      startContent={<Building size={16} />}
                    >
                      Professional
                    </SelectItem>
                    <SelectItem
                      key="personal"
                      startContent={<Trophy size={16} />}
                    >
                      Personal
                    </SelectItem>
                  </Select>

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Date Received <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Award date"
                      className="w-full"
                      errorMessage={errors.date}
                      granularity="day"
                      isInvalid={!!errors.date}
                      maxValue={today(getLocalTimeZone())}
                      onChange={handleDateChange}
                      value={parseAbsoluteToLocal(formData.date.toISOString())}
                      isDisabled={isSubmitting}
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      Date when the award was issued or received
                    </p>
                  </div>

                  <Textarea
                    label="Description"
                    placeholder="Describe the significance of this award and why you received it"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    minRows={3}
                    maxRows={5}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    aria-label="Award description"
                    description="Optional: Provide context about the award and your achievement"
                    disabled={isSubmitting}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={handleCloseModal}
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
                  {currentAward ? "Update Award" : "Save Award"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={!!deleteConfirmId}
        onClose={() => !isSubmitting && setDeleteConfirmId(null)}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 py-2">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this award? This action
                    cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => setDeleteConfirmId(null)}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (deleteConfirmId) {
                      handleDelete(deleteConfirmId);
                    }
                  }}
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

export default Awards;
