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
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Edit2, Trash2, Plus, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Candidate, Responsibility } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

const Responsibilities = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [editingResponsibility, setEditingResponsibility] =
    useState<Responsibility | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [position, setPosition] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [endDate, setEndDate] = useState<Date | null>(null);
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
      if (startDate > endDate) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (
      startDate &&
      startDate > today(getLocalTimeZone()).toDate(getLocalTimeZone())
    ) {
      newErrors.startDate = "Start date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setPosition("");
    setOrganization("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
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
    setOrganization(responsibility.organization);
    setStartDate(responsibility.startDate);
    setEndDate(responsibility.endDate || null);
    setIsCurrentPosition(responsibility.current);
    setDescription(responsibility.description);
    onOpen();
  };

  const handleDelete = (id: string) => {
    const responsibility = user?.responsibilities?.find((r) => r._id === id);
    if (responsibility) {
      const newResponsibilies = user?.responsibilities?.filter(
        (r) => r._id !== id
      );

      setUser({ ...user, responsibilities: newResponsibilies });
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

    const newResponsibility: Responsibility = {
      title: sanitizeInput(position),
      organization: sanitizeInput(organization),
      startDate: startDate ? new Date(startDate.toString()) : new Date(),
      endDate: isCurrentPosition
        ? undefined
        : endDate
        ? new Date(endDate.toString())
        : undefined,
      current: isCurrentPosition,
      description: sanitizeInput(description),
    };

    try {
      if (editingResponsibility) {
        const newResponsibilies = user?.responsibilities?.map((r) =>
          r._id === editingResponsibility._id ? newResponsibility : r
        );

        setUser({ ...user, responsibilities: newResponsibilies });
      } else {
        const newResponsibilies = user?.responsibilities
          ? [...user?.responsibilities, newResponsibility]
          : [newResponsibility];

        setUser({ ...user, responsibilities: newResponsibilies });
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
          {user?.responsibilities && user?.responsibilities?.length === 0 ? (
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

              <h3 className="text-xl mt-3">No Responsibilies Added Yet</h3>
              <p className="text-gray-500">
                Start by adding your first position of responsibility!
              </p>
              <Button
                onClick={() => onOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
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
                  {user?.responsibilities &&
                    user?.responsibilities?.map((responsibility) => (
                      <motion.div
                        key={responsibility._id}
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
                                {responsibility.title}
                              </h3>
                              <p className="text-gray-500">
                                {responsibility.organization}
                              </p>
                              <p className="text-sm text-gray-400">
                                {responsibility.startDate.toString()} -{" "}
                                {responsibility.current
                                  ? "Present"
                                  : responsibility.endDate?.toString()}
                              </p>
                              <p className="mt-2">
                                {responsibility.description}
                              </p>
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
                                onPress={() =>
                                  handleDelete(responsibility?._id || "")
                                }
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
                    <DatePicker
                      className="max-w-xs"
                      label="Start Date (mm/dd/yyyy)"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(new Date(startDate).toISOString())}
                      onChange={(date) => handleDateChange(date, "startDate")}
                    />
                    <DatePicker
                      className="max-w-xs"
                      defaultValue={parseAbsoluteToLocal(
                        "2021-11-07T07:45:00Z"
                      )}
                      label="End Date (mm/dd/yyyy)"
                      granularity="day"
                      value={
                        endDate
                          ? parseAbsoluteToLocal(endDate.toISOString())
                          : undefined
                      }
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={isCurrentPosition}
                      onChange={(date) => handleDateChange(date, "endDate")}
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
