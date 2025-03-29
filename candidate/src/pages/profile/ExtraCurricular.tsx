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
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { Plus, Edit2, Trash2, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Candidate,
  ExtraCurricular as IExtraCurricular,
} from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

const ExtraCurricular = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  // Split states for each field
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof IExtraCurricular, string>>
  >({});
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validateForm = () => {
    const newErrors: Partial<Record<keyof IExtraCurricular, string>> = {};

    if (!category || category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters";
    }

    if (startDate && endDate && !current) {
      if (startDate > endDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (description && description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleAdd = () => {
    setEditingActivityId(null);
    setTitle("");
    setCategory("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setEndDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setDescription("");
    setErrors({});
    onOpen();
  };

  const handleEdit = (activity: IExtraCurricular) => {
    setEditingActivityId(activity._id || null);
    setTitle(activity.title || "");
    setCategory(activity.category);
    setStartDate(new Date(activity.startDate));
    setEndDate(activity.endDate ? new Date(activity.endDate) : undefined);
    setCurrent(activity.current || false);
    setDescription(activity.description || "");
    setErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    const newActivities = user?.extraCurriculars?.filter(
      (activity) => activity._id !== id
    );
    setUser({ ...user, extraCurriculars: newActivities });
    toast.success("Activity deleted successfully");
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const preparedData: IExtraCurricular = {
      title,
      category,
      startDate,
      endDate: current ? undefined : endDate,
      current,
      description,
    };

    let newActivities: IExtraCurricular[] = [];

    if (editingActivityId) {
      newActivities = (user?.extraCurriculars || []).map((activity) =>
        activity._id === editingActivityId
          ? { ...preparedData, _id: activity._id }
          : activity
      );
    } else {
      const newActivity = {
        ...preparedData,
        createdAt: new Date(),
      } as IExtraCurricular;

      newActivities = [...(user?.extraCurriculars || []), newActivity];
    }

    setUser({ ...user, extraCurriculars: newActivities });
    onClose();
    toast.success(
      editingActivityId
        ? "Activity updated successfully"
        : "Activity added successfully"
    );
  };

  const closeAndReset = () => {
    setEditingActivityId(null);
    setTitle("");
    setCategory("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setEndDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setDescription("");
    setErrors({});
    onClose();
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
            {user?.extraCurriculars && (
              <Button startContent={<Plus size={18} />} onPress={handleAdd}>
                Add new
              </Button>
            )}
          </div>

          {!user?.extraCurriculars?.length ? (
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
              <Button onPress={handleAdd} startContent={<Plus size={18} />}>
                Add new
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {user.extraCurriculars.map((activity) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{activity.category}</h3>
                      <p className="text-small">
                        {new Date(activity.startDate).toLocaleDateString()} -{" "}
                        {activity.current
                          ? "Present"
                          : activity.endDate
                          ? new Date(activity.endDate).toLocaleDateString()
                          : ""}
                      </p>
                      <p className="text-small mt-2">{activity.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => handleEdit(activity)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(activity._id || "")}
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

      <Modal isOpen={isOpen} onClose={closeAndReset} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingActivityId
                  ? "Edit Activity"
                  : "Add New Extra-curricular Activity"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Title (Optional)"
                    placeholder="Activity title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    label="Category"
                    placeholder="e.g. Singing, Dancing etc"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    isInvalid={!!errors.category}
                    errorMessage={errors.category}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date (mm/dd/yyyy)"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(startDate.toISOString())}
                      onChange={(date) => handleDateChange(date, "startDate")}
                    />
                    <DatePicker
                      label="End Date (mm/dd/yyyy)"
                      granularity="day"
                      value={
                        endDate
                          ? parseAbsoluteToLocal(endDate.toISOString())
                          : undefined
                      }
                      onChange={(date) => handleDateChange(date, "endDate")}
                      maxValue={today(getLocalTimeZone())}
                      isDisabled={current}
                      errorMessage={errors.endDate}
                      isInvalid={!!errors.endDate}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={current}
                        onChange={(e) => setCurrent(e.target.checked)}
                        className="rounded"
                      />
                      <span>I currently do this activity</span>
                    </label>
                  </div>
                  <Textarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
