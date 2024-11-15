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
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { Plus, Pencil, Trash2, School } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

// Types and Interfaces
interface Scholarship {
  id: string;
  position: string;
  associatedWith: string;
  grantDate: CalendarDate;
  description: string;
}

// Validation Schema
const scholarshipSchema = z.object({
  position: z.string().min(1, "Position is required"),
  associatedWith: z.string().min(1, "Associated organization is required"),
  grantDate: z.instanceof(CalendarDate),
  description: z.string().optional(),
});

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [editingScholarship, setEditingScholarship] =
    useState<Scholarship | null>(null);
  const [formData, setFormData] = useState<Omit<Scholarship, "id">>({
    position: "",
    associatedWith: "",
    grantDate: parseDate(today("IST").toString()),
    description: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock organizations for the select dropdown
  const organizations = [
    { label: "Harvard University", value: "harvard" },
    { label: "MIT", value: "mit" },
    { label: "Stanford University", value: "stanford" },
  ];

  const validateField = (name: keyof typeof formData, value: any) => {
    try {
      scholarshipSchema.shape[name].parse(value);
      // @ts-expect-error - Ignore the error
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
        return false;
      }
      return false;
    }
  };

  const handleInputChange = (
    name: keyof typeof formData,
    value: string | CalendarDate
  ) => {
    const sanitizedValue = typeof value === "string" ? value.trim() : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const resetForm = () => {
    setFormData({
      position: "",
      associatedWith: "",
      grantDate: parseDate(today("IST").toString()),
      description: "",
    });
    setErrors({});
    setEditingScholarship(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    try {
      scholarshipSchema.parse(formData);

      if (editingScholarship) {
        setScholarships((prev) =>
          prev.map((s) =>
            s.id === editingScholarship.id ? { ...formData, id: s.id } : s
          )
        );
        toast.success("Scholarship updated successfully");
      } else {
        setScholarships((prev) => [
          ...prev,
          { ...formData, id: Math.random().toString(36).substr(2, 9) },
        ]);
        toast.success("Scholarship added successfully");
      }

      handleClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setErrors((prev) => ({
            ...prev,
            [err.path[0]]: err.message,
          }));
        });
        toast.error("Please check all required fields");
      }
    }
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      position: scholarship.position,
      associatedWith: scholarship.associatedWith,
      grantDate: scholarship.grantDate,
      description: scholarship.description,
    });
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
                    Grant Date: {scholarship.grantDate.toString()}
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
                {editingScholarship
                  ? "Edit Scholarship"
                  : "Add New Scholarship"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Position Title"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                  />
                  <Select
                    label="Associated With"
                    selectedKeys={[formData.associatedWith]}
                    onChange={(e) =>
                      handleInputChange("associatedWith", e.target.value)
                    }
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
                  <DateInput
                    label="Grant Date"
                    value={formData.grantDate}
                    onChange={(date) => handleInputChange("grantDate", date)}
                    isRequired
                    maxValue={today("IST")}
                  />
                  <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
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
