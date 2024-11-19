import {
  BreadcrumbItem,
  Breadcrumbs,
  Input,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { CalendarDate, today } from "@internationalized/date";
import { Plus, Edit2, Trash2, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

// Types and Interfaces
interface ExtraCurricular {
  id: string;
  category: string;
  startDate: CalendarDate;
  endDate: CalendarDate;
  description: string;
}

// Validation Schema
const extraCurricularSchema = z
  .object({
    category: z.string().min(2, "Category must be at least 2 characters"),
    startDate: z.instanceof(CalendarDate),
    endDate: z.instanceof(CalendarDate),
    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters"),
  })
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

const ExtraCurricular = () => {
  // States
  const [activities, setActivities] = useState<ExtraCurricular[]>([]);
  const [currentActivity, setCurrentActivity] = useState<
    Partial<ExtraCurricular>
  >({
    category: "",
    startDate: today("IST"),
    endDate: today("IST"),
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExtraCurricular, string>>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validateField = (name: keyof ExtraCurricular, value: any) => {
    try {
      // @ts-expect-error - This is a dynamic field access
      extraCurricularSchema.shape[name].parse(value);
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

  const handleInputChange = (name: keyof ExtraCurricular, value: any) => {
    const sanitizedValue = typeof value === "string" ? value.trim() : value;
    setCurrentActivity((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentActivity({
      category: "",
      startDate: today("IST"),
      endDate: today("IST"),
      description: "",
    });
    setErrors({});
    onOpen();
  };

  const handleEdit = (activity: ExtraCurricular) => {
    setIsEditing(true);
    setCurrentActivity(activity);
    setErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
    toast.success("Activity deleted successfully");
  };

  const handleSave = () => {
    try {
      extraCurricularSchema.parse(currentActivity);

      if (isEditing) {
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === currentActivity.id
              ? { ...(currentActivity as ExtraCurricular) }
              : activity
          )
        );
        toast.success("Activity updated successfully");
      } else {
        const newActivity = {
          ...currentActivity,
          id: Math.random().toString(36).substr(2, 9),
        } as ExtraCurricular;

        setActivities((prev) => [...prev, newActivity]);
        toast.success("Activity added successfully");
      }

      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/extra-curricular">
          Extra-curricular
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl"
        >
          <div className="flex justify-end items-center mb-6">
            {activities.length > 0 && (
              <Button startContent={<Plus size={18} />} onClick={handleAdd}>
                Add new
              </Button>
            )}
          </div>

          {activities.length === 0 ? (
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
                <PlusIcon size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">
                No Extra-curricular Activities added yet
              </h3>
              <p className="text-gray-500">
                Start by adding your first activity!
              </p>
              <Button onClick={handleAdd} startContent={<Plus size={18} />}>
                Add new
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{activity.category}</h3>
                      <p className="text-small">
                        {activity.startDate.toString()} -{" "}
                        {activity.endDate.toString()}
                      </p>
                      <p className="text-small mt-2">{activity.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={() => handleEdit(activity)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setErrors({});
        }}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditing
                  ? "Edit Activity"
                  : "Add New Extra-curricular Activity"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Category"
                    placeholder="e.g. Singing, Dancing etc"
                    value={currentActivity.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    isInvalid={!!errors.category}
                    errorMessage={errors.category}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <DateInput
                      label="Start Date"
                      value={currentActivity.startDate}
                      onChange={(date) => handleInputChange("startDate", date)}
                      isInvalid={!!errors.startDate}
                      errorMessage={errors.startDate?.toString()}
                    />
                    <DateInput
                      label="End Date"
                      value={currentActivity.endDate}
                      onChange={(date) => handleInputChange("endDate", date)}
                      isInvalid={!!errors.endDate}
                      errorMessage={errors.endDate?.toString()}
                    />
                  </div>
                  <Textarea
                    label="Description"
                    value={currentActivity.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
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

export default ExtraCurricular;
