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
  Checkbox,
  Card,
  Textarea,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { CalendarDate, today } from "@internationalized/date";
import { Edit2, Trash2, Plus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Responsibility {
  id: string;
  position: string;
  organization: string;
  startDate: CalendarDate;
  endDate: CalendarDate | null;
  isCurrentPosition: boolean;
  description: string;
}

const Responsibilities = () => {
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>(
    []
  );
  const [editingResponsibility, setEditingResponsibility] =
    useState<Responsibility | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [position, setPosition] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState<CalendarDate | null>(null);
  const [endDate, setEndDate] = useState<CalendarDate | null>(null);
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);
  const [description, setDescription] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!position.trim()) {
      newErrors.position = "Position is required";
    }
    if (!organization.trim()) {
      newErrors.organization = "Organization is required";
    }
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!isCurrentPosition && !endDate) {
      newErrors.endDate = "End date is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    // Date validation
    if (startDate && endDate && !isCurrentPosition) {
      if (startDate.compare(endDate) > 0) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (startDate && startDate.compare(today("IST")) > 0) {
      newErrors.startDate = "Start date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setPosition("");
    setOrganization("");
    setStartDate(null);
    setEndDate(null);
    setIsCurrentPosition(false);
    setDescription("");
    setEditingResponsibility(null);
    setErrors({});
  };

  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  const handleEdit = (responsibility: Responsibility) => {
    setEditingResponsibility(responsibility);
    setPosition(responsibility.position);
    setOrganization(responsibility.organization);
    setStartDate(responsibility.startDate);
    setEndDate(responsibility.endDate);
    setIsCurrentPosition(responsibility.isCurrentPosition);
    setDescription(responsibility.description);
    onOpen();
  };

  const handleDelete = (id: string) => {
    const responsibility = responsibilities.find((r) => r.id === id);
    if (responsibility) {
      setResponsibilities((prev) => prev.filter((r) => r.id !== id));
      toast.success(`Removed ${responsibility.position} position`);
    }
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, "");
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const newResponsibility = {
      id: editingResponsibility?.id || Date.now().toString(),
      position: sanitizeInput(position),
      organization: sanitizeInput(organization),
      startDate: startDate!,
      endDate: isCurrentPosition ? null : endDate,
      isCurrentPosition,
      description: sanitizeInput(description),
    };

    try {
      if (editingResponsibility) {
        setResponsibilities((prev) =>
          prev.map((r) =>
            r.id === editingResponsibility.id ? newResponsibility : r
          )
        );
        toast.success("Position updated successfully");
      } else {
        setResponsibilities((prev) => [...prev, newResponsibility]);
        toast.success("New position added successfully");
      }

      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to save position");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="p-5"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/responsibilities">
          Responsibilities
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <AnimatePresence mode="wait">
          {responsibilities.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="py-10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                    <Briefcase size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    No Positions of Responsibility Added Yet
                  </h3>
                  <p className="text-gray-500">
                    Add your first position to showcase your leadership
                    experience.
                  </p>
                  <Button
                    color="primary"
                    onPress={handleAdd}
                    startContent={<Plus size={20} />}
                  >
                    Add Position
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Positions of Responsibility
                </h2>
                <Button
                  color="primary"
                  onPress={handleAdd}
                  startContent={<Plus size={20} />}
                >
                  Add Position
                </Button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {responsibilities.map((responsibility) => (
                    <motion.div
                      key={responsibility.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {responsibility.position}
                            </h3>
                            <p className="text-gray-500">
                              {responsibility.organization}
                            </p>
                            <p className="text-sm text-gray-400">
                              {responsibility.startDate.toString()} -{" "}
                              {responsibility.isCurrentPosition
                                ? "Present"
                                : responsibility.endDate?.toString()}
                            </p>
                            <p className="mt-2">{responsibility.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              onPress={() => handleEdit(responsibility)}
                            >
                              <Edit2 size={18} />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              onPress={() => handleDelete(responsibility.id)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingResponsibility ? "Edit" : "Add New"} Position of
                Responsibility
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Position Title"
                    placeholder="Enter Position Title"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    isRequired
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                  />
                  <Input
                    label="Organization Name"
                    placeholder="Enter Organization Name"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    isRequired
                    isInvalid={!!errors.organization}
                    errorMessage={errors.organization}
                  />
                  <div className="flex gap-4">
                    <DateInput
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      isRequired
                      isInvalid={!!errors.startDate}
                      errorMessage={errors.startDate}
                    />
                    <DateInput
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      isDisabled={isCurrentPosition}
                      isRequired={!isCurrentPosition}
                      isInvalid={!!errors.endDate}
                      errorMessage={errors.endDate}
                    />
                  </div>
                  <Checkbox
                    isSelected={isCurrentPosition}
                    onValueChange={(value) => {
                      setIsCurrentPosition(value);
                      if (value) {
                        setEndDate(null);
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                      }
                    }}
                  >
                    I am currently holding this position
                  </Checkbox>

                  <Textarea
                    label="Description"
                    placeholder="Describe your responsibilities..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isRequired
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                  />
                </div>
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
    </motion.div>
  );
};

export default Responsibilities;
