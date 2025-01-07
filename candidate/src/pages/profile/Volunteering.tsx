import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Checkbox,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { Plus, Edit2, Trash2, Earth } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

// Interface matching the backend schema
interface Volunteer {
  _id?: string;
  organization: string;
  role: string;
  cause: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  createdAt?: string;
}

// Frontend state interface with CalendarDate for date handling
interface VolunteerFormState {
  _id?: string;
  organization: string;
  role: string;
  cause: string;
  startDate: CalendarDate;
  endDate: CalendarDate | null;
  current: boolean;
  description: string;
}

// Validation Schema
const volunteerSchema = z.object({
  organization: z.string().min(2, "Organization name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  cause: z.string().min(2, "Please select a cause"),
  startDate: z.instanceof(CalendarDate),
  endDate: z.instanceof(CalendarDate).nullable(),
  current: z.boolean(),
  description: z.string().min(10, "Please provide a brief description of your volunteer work"),
});

const Volunteering = () => {
  const [experiences, setExperiences] = useState<Volunteer[]>([]);
  const [currentExperience, setCurrentExperience] = useState<VolunteerFormState | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const causes = [
    "Education",
    "Healthcare",
    "Environment",
    "Animal Welfare",
    "Community Development",
    "Arts & Culture",
    "Social Justice",
    "Disaster Relief",
  ];

  const resetForm = () => {
    setCurrentExperience({
      organization: "",
      role: "",
      cause: "",
      startDate: parseDate(today("IST").toString()),
      endDate: null,
      current: false,
      description: "",
    });
    setErrors({});
  };

  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  const handleEdit = (experience: Volunteer) => {
    setCurrentExperience({
      _id: experience._id,
      organization: experience.organization,
      role: experience.role,
      cause: experience.cause,
      startDate: parseDate(experience.startDate),
      endDate: experience.endDate ? parseDate(experience.endDate) : null,
      current: experience.current,
      description: experience.description,
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    try {
      // Add your API delete call here
      // await deleteVolunteer(id);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      toast.success("Volunteer experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete volunteer experience");
    }
  };

  const validateForm = (data: Omit<VolunteerFormState, "_id">) => {
    try {
      volunteerSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const transformFormToVolunteer = (form: VolunteerFormState): Omit<Volunteer, '_id' | 'createdAt'> => {
    return {
      organization: form.organization,
      role: form.role,
      cause: form.cause,
      startDate: form.startDate.toString(),
      endDate: form.endDate?.toString(),
      current: form.current,
      description: form.description,
    };
  };

  const handleSave = async () => {
    if (!currentExperience) return;

    if (!validateForm(currentExperience)) {
      toast.error("Please check the form for errors");
      return;
    }

    try {
      const volunteerData = transformFormToVolunteer(currentExperience);

      if (currentExperience._id) {
        // Update existing volunteer
        // Add your API update call here
        // const updated = await updateVolunteer(currentExperience._id, volunteerData);
        setExperiences((prev) =>
          prev.map((exp) =>
            exp._id === currentExperience._id
              ? { ...volunteerData, _id: currentExperience._id }
              : exp
          )
        );
        toast.success("Volunteer experience updated successfully");
      } else {
        // Create new volunteer
        // Add your API create call here
        // const created = await createVolunteer(volunteerData);
        setExperiences((prev) => [...prev, { ...volunteerData, _id: Date.now().toString() }]);
        toast.success("Volunteer experience added successfully");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save volunteer experience");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <div className="flex justify-end items-center mb-6">
        {experiences.length > 0 && (
          <Button startContent={<Plus size={20} />} onPress={handleAdd}>
            Add new
          </Button>
        )}
      </div>

      {experiences.length === 0 ? (
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
            <Earth size={50} />
          </motion.div>

          <h3 className="text-xl mt-3">No Volunteering Added Yet</h3>
          <p className="text-gray-500">Start by adding your first volunteering!</p>
          <Button onPress={handleAdd} startContent={<Plus size={18} />}>
            Add new
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <motion.div
              key={experience._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{experience.organization}</h3>
                  <p className="text-gray-600">{experience.role}</p>
                  <p className="text-sm text-gray-500">
                    {experience.startDate} - {experience.current ? "Present" : experience.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEdit(experience)}
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => experience._id && handleDelete(experience._id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {currentExperience?._id ? "Edit" : "Add New"} Volunteer Experience
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Organization Name"
                    value={currentExperience?.organization}
                    onChange={(e) =>
                      setCurrentExperience((prev) =>
                        prev
                          ? {
                              ...prev,
                              organization: e.target.value,
                            }
                          : null
                      )
                    }
                    isInvalid={!!errors.organization}
                    errorMessage={errors.organization}
                  />
                  <Input
                    label="Your Role"
                    value={currentExperience?.role}
                    onChange={(e) =>
                      setCurrentExperience((prev) =>
                        prev
                          ? {
                              ...prev,
                              role: e.target.value,
                            }
                          : null
                      )
                    }
                    isInvalid={!!errors.role}
                    errorMessage={errors.role}
                  />
                  <Select
                    label="Select Cause"
                    selectedKeys={
                      currentExperience?.cause ? [currentExperience.cause] : []
                    }
                    onChange={(e) =>
                      setCurrentExperience((prev) =>
                        prev
                          ? {
                              ...prev,
                              cause: e.target.value,
                            }
                          : null
                      )
                    }
                    isInvalid={!!errors.cause}
                    errorMessage={errors.cause}
                  >
                    {causes.map((cause) => (
                      <SelectItem key={cause} value={cause}>
                        {cause}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex gap-4">
                    <DateInput
                      label="Start Date"
                      value={currentExperience?.startDate}
                      onChange={(date) =>
                        setCurrentExperience((prev) =>
                          prev
                            ? {
                                ...prev,
                                startDate: date,
                              }
                            : null
                        )
                      }
                      maxValue={today("IST")}
                    />
                    <DateInput
                      label="End Date"
                      value={currentExperience?.endDate}
                      onChange={(date) =>
                        setCurrentExperience((prev) =>
                          prev
                            ? {
                                ...prev,
                                endDate: date,
                              }
                            : null
                        )
                      }
                      maxValue={today("IST")}
                      isDisabled={currentExperience?.current}
                    />
                  </div>
                  <Checkbox
                    isSelected={currentExperience?.current}
                    onValueChange={(checked) =>
                      setCurrentExperience((prev) =>
                        prev
                          ? {
                              ...prev,
                              current: checked,
                              endDate: checked ? null : prev.endDate,
                            }
                          : null
                      )
                    }
                  >
                    I am currently volunteering with this organization
                  </Checkbox>
                  <Textarea
                    label="Description"
                    value={currentExperience?.description}
                    onChange={(e) =>
                      setCurrentExperience((prev) =>
                        prev
                          ? {
                              ...prev,
                              description: e.target.value,
                            }
                          : null
                      )
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

export default Volunteering;