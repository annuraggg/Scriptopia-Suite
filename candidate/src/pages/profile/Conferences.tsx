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
import { CalendarDate, parseDate, today } from "@internationalized/date";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { Candidate, Conference } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

const conferenceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  organizer: z.string().min(2, "Organizer name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  date: z.instanceof(CalendarDate),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters"),
});

const Conferences = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [currentConference, setCurrentConference] = useState<Conference>({
    title: "",
    organizer: "",
    eventLocation: "",
    eventDate: today("IST").toString(),
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Conference, string>>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validateField = (name: keyof Conference, value: any) => {
    try {
      // @ts-expect-error - This is a dynamic field access
      conferenceSchema.shape[name].parse(value);
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

  const handleInputChange = (name: keyof Conference, value: any) => {
    const sanitizedValue = typeof value === "string" ? value.trim() : value;
    setCurrentConference((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentConference({
      title: "",
      organizer: "",
      eventLocation: "",
      eventDate: today("IST").toString(),
      description: "",
    });
    setErrors({});
    onOpen();
  };

  const handleEdit = (conference: Conference) => {
    setIsEditing(true);
    setCurrentConference(conference);
    setErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    const newConferences = user?.conferences?.filter((conf) => conf._id !== id);
    setUser({ ...user, conferences: newConferences });
  };

  const handleSave = () => {
    try {
      conferenceSchema.parse(currentConference);

      if (isEditing) {
        const newConferences = user?.conferences?.map((conf) =>
          conf._id === currentConference._id ? currentConference : conf
        );
        setUser({ ...user, conferences: newConferences });
      } else {
        const newConference = {
          ...currentConference,
          id: Math.random().toString(36).substr(2, 9),
        } as Conference;
        const newConferences = user?.conferences
          ? [...user.conferences, newConference]
          : [newConference];

        setUser({ ...user, conferences: newConferences });
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
        <BreadcrumbItem href="/profile/conferences">Conferences</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl"
        >
          <div className="flex justify-end items-center mb-6">
            {!user?.conferences && (
              <Button startContent={<Plus size={18} />} onClick={handleAdd}>
                Add new
              </Button>
            )}
          </div>

          {!user?.conferences ? (
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
                <Users size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">No Conference Added Yet</h3>
              <p className="text-gray-500">
                Start by adding your first conference!
              </p>
              <Button
                onClick={() => onOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {user?.conferences?.map((conference) => (
                <motion.div
                  key={conference._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{conference.title}</h3>
                      <p className="text-small">{conference.organizer}</p>
                      <p className="text-small">{conference.eventLocation}</p>
                      <p className="text-small">{conference.eventDate.toString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={() => handleEdit(conference)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onClick={() => handleDelete(conference._id || "")}
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
                {isEditing ? "Edit Conference" : "Add New Conference"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Title"
                    value={currentConference.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                  />
                  <Input
                    label="Organizer"
                    value={currentConference.organizer}
                    onChange={(e) =>
                      handleInputChange("organizer", e.target.value)
                    }
                    isInvalid={!!errors.organizer}
                    errorMessage={errors.organizer}
                  />
                  <Input
                    label="Event Address"
                    value={currentConference.eventLocation}
                    onChange={(e) =>
                      handleInputChange("eventLocation", e.target.value)
                    }
                    isInvalid={!!errors.eventLocation}
                    errorMessage={errors.eventLocation}
                  />
                  <DateInput
                    label="Event Date"
                    value={parseDate(currentConference.eventDate)}
                    onChange={(date) => handleInputChange("eventDate", date)}
                    isInvalid={!!errors.eventDate}
                    errorMessage={errors.eventDate?.toString()}
                  />
                  <Textarea
                    label="Description"
                    value={currentConference.description}
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

export default Conferences;
