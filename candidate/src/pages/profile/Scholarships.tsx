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
} from "@nextui-org/react";
import { useState } from "react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { Plus, Pencil, Trash2, School } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Types and Interfaces
interface Scholarship {
  id: string;
  position: string;
  associatedWith: string;
  grantDate: Date;
  description: string;
}

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [editingScholarshipId, setEditingScholarshipId] = useState<
    string | null
  >(null);

  // Split states for each field
  const [position, setPosition] = useState("");
  const [associatedWith, setAssociatedWith] = useState("");
  const [grantDate, setGrantDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [description, setDescription] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock organizations for the select dropdown
  const organizations = [
    { label: "Harvard University", value: "harvard" },
    { label: "MIT", value: "mit" },
    { label: "Stanford University", value: "stanford" },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!position || position.trim() === "") {
      newErrors.position = "Position is required";
    }

    if (!associatedWith || associatedWith.trim() === "") {
      newErrors.associatedWith = "Associated organization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setGrantDate(dateObj);
  };

  const resetForm = () => {
    setPosition("");
    setAssociatedWith("");
    setGrantDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setDescription("");
    setErrors({});
    setEditingScholarshipId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const preparedData: Omit<Scholarship, "id"> = {
      position,
      associatedWith,
      grantDate,
      description,
    };

    if (editingScholarshipId) {
      setScholarships((prev) =>
        prev.map((s) =>
          s.id === editingScholarshipId ? { ...preparedData, id: s.id } : s
        )
      );
      toast.success("Scholarship updated successfully");
    } else {
      setScholarships((prev) => [
        ...prev,
        { ...preparedData, id: Math.random().toString(36).substr(2, 9) },
      ]);
      toast.success("Scholarship added successfully");
    }

    handleClose();
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarshipId(scholarship.id);
    setPosition(scholarship.position);
    setAssociatedWith(scholarship.associatedWith);
    setGrantDate(new Date(scholarship.grantDate));
    setDescription(scholarship.description);
    setErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    setScholarships((prev) => prev.filter((s) => s.id !== id));
    toast.success("Scholarship deleted successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/scholarships">
          Scholarships
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end items-center mb-6">
        {scholarships.length > 0 && (
          <Button onPress={onOpen} startContent={<Plus size={20} />}>
            Add new
          </Button>
        )}
      </div>

      {scholarships.length === 0 ? (
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
            <School size={50} />
          </motion.div>

          <h3 className="text-xl mt-3">No Scholarship Added Yet</h3>
          <p className="text-gray-500">
            Start by adding your first scholarship!
          </p>
          <Button onClick={() => onOpen()} startContent={<Plus size={18} />}>
            Add new
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {scholarships.map((scholarship) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{scholarship.position}</h3>
                  <p className="text-sm">{scholarship.associatedWith}</p>
                  <p className="text-sm">
                    Grant Date:{" "}
                    {new Date(scholarship.grantDate).toLocaleDateString()}
                  </p>
                  {scholarship.description && (
                    <p className="mt-2">{scholarship.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEdit(scholarship)}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(scholarship.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {editingScholarshipId
                  ? "Edit Scholarship"
                  : "Add New Scholarship"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Position Title"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    isRequired
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                  />
                  <Select
                    label="Associated With"
                    selectedKeys={[associatedWith]}
                    onChange={(e) => setAssociatedWith(e.target.value)}
                    isRequired
                    isInvalid={!!errors.associatedWith}
                    errorMessage={errors.associatedWith}
                  >
                    {organizations.map((org) => (
                      <SelectItem key={org.value} value={org.value}>
                        {org.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <DatePicker
                    label="Grant Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(grantDate.toISOString())}
                    onChange={handleDateChange}
                  />
                  <p className="text-xs">Time Zone: {getLocalTimeZone()}</p>
                  <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={3}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleClose}>
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

export default Scholarships;
