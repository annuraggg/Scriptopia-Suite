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
} from "@nextui-org/react";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  ZonedDateTime,
} from "@internationalized/date";
import { Plus, Edit2, Trash2, Trophy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Award, Candidate } from "@shared-types/Candidate";
import { z } from "zod";

// Define award types for better type safety
const awardTypes = ["academic", "professional", "personal"] as const;
type AwardType = (typeof awardTypes)[number];

// Zod validation schema
const awardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  associatedWith: z.enum(["academic", "professional", "personal"]),
  date: z.date().max(new Date(), "Date cannot be in the future"),
  description: z.string().optional(),
});

type AwardFormData = z.infer<typeof awardSchema>;

const Awards = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

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

  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      if (currentAward) {
        // Edit existing award
        const awards = user?.awards || [];
        const newAwards = awards.map((award) =>
          award._id === currentAward
            ? {
                ...award,
                ...formData,
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
              _id: `award-${Date.now()}`, // Generate temporary ID for new awards
            } as Award,
          ],
        });
        toast.success("Award added successfully");
      }

      handleCloseModal();
    } catch (error) {
      toast.error("An error occurred while saving the award");
      console.error("Save error:", error);
    }
  };

  // Handle deleting award
  const handleDelete = (id: string) => {
    try {
      const awards = user?.awards || [];
      setUser({
        ...user,
        awards: awards.filter((award) => award._id !== id),
      });
      toast.success("Award deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the award");
      console.error("Delete error:", error);
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

  // Confirmation dialog for delete
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div className="p-5">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/awards">Awards</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-end mb-6">
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => handleOpenModal()}
        >
          Add Award
        </Button>
      </div>

      {!user?.awards || user.awards.length === 0 ? (
        <Card className="p-6">
          <CardBody className="flex flex-col items-center py-8">
            <Trophy size={40} className="text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">No Awards Added</h3>
            <p className="text-gray-500 mb-4">
              Showcase your achievements by adding awards or recognitions
            </p>
            <Button
              color="primary"
              startContent={<Plus size={18} />}
              onPress={() => handleOpenModal()}
            >
              Add Your First Award
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4">
          {user.awards.map((award) => (
            <Card key={award._id} className="w-full">
              <CardHeader className="flex justify-between items-center px-6 py-4">
                <h3 className="text-lg font-semibold">{award.title}</h3>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleOpenModal(award)}
                    aria-label="Edit award"
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => setDeleteConfirmId(award._id as string)}
                    aria-label="Delete award"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="px-6 py-4">
                <div className="grid gap-2">
                  <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
                    <span>Issuer: {award.issuer}</span>
                    <span>Type: {award.associatedWith}</span>
                    <span>
                      Date: {new Date(award.date).toLocaleDateString()}
                    </span>
                  </div>
                  {award.description && (
                    <p className="mt-2 text-gray-700">{award.description}</p>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Award Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {currentAward ? "Edit Award" : "Add New Award"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5">
                  <Input
                    label="Award Title"
                    placeholder="Enter award title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    aria-label="Award title"
                  />
                  <Input
                    label="Issuer/Organization"
                    placeholder="Enter organization that issued the award"
                    value={formData.issuer}
                    onChange={(e) =>
                      handleInputChange("issuer", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.issuer}
                    errorMessage={errors.issuer}
                    aria-label="Award issuer"
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
                  >
                    <SelectItem key="academic" value="academic">
                      Academic
                    </SelectItem>
                    <SelectItem key="professional" value="professional">
                      Professional
                    </SelectItem>
                    <SelectItem key="personal" value="personal">
                      Personal
                    </SelectItem>
                  </Select>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Issue Date
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
                    />
                  </div>
                  <Textarea
                    label="Description (Optional)"
                    placeholder="Enter a brief description of the award"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    minRows={3}
                    maxRows={5}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    aria-label="Award description"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={handleCloseModal}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSave}>
                  {currentAward ? "Update Award" : "Save Award"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3">
                  <AlertCircle size={24} className="text-danger" />
                  <p>
                    Are you sure you want to delete this award? This action
                    cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={() => setDeleteConfirmId(null)}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (deleteConfirmId) {
                      handleDelete(deleteConfirmId);
                      setDeleteConfirmId(null);
                    }
                  }}
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
