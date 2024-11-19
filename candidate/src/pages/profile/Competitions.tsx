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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { CalendarDate, today } from "@internationalized/date";
import { Plus, Pencil, Trash2, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

// Types and Interfaces
interface Competition {
  id: string;
  title: string;
  position: string;
  associatedWith: string;
  date: CalendarDate;
  description: string;
}

// Validation Schema
const competitionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  associatedWith: z
    .string()
    .min(2, "Associated with must be at least 2 characters"),
  date: z.instanceof(CalendarDate),
  description: z.string().optional(),
});

const Competitions = () => {
  // States
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [currentCompetition, setCurrentCompetition] = useState<
    Partial<Competition>
  >({
    title: "",
    position: "",
    associatedWith: "",
    date: today("IST"),
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validateField = (name: keyof Competition, value: any) => {
    try {
      // @ts-expect-error - We know that the key exists in the schema
      competitionSchema.shape[name].parse(value);
      // @ts-expect-error - We know that the key exists in the schema
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

  const handleInputChange = (name: keyof Competition, value: any) => {
    const sanitizedValue = typeof value === "string" ? value.trim() : value;
    setCurrentCompetition((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentCompetition({
      title: "",
      position: "",
      associatedWith: "",
      date: today("IST"),
      description: "",
    });
    onOpen();
  };

  const handleEdit = (competition: Competition) => {
    setIsEditing(true);
    setCurrentCompetition(competition);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setCompetitions((prev) => prev.filter((comp) => comp.id !== id));
    toast.success("Competition deleted successfully");
  };

  const handleSave = () => {
    try {
      competitionSchema.parse(currentCompetition);

      if (isEditing) {
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === currentCompetition.id
              ? { ...(currentCompetition as Competition) }
              : comp
          )
        );
        toast.success("Competition updated successfully");
      } else {
        setCompetitions((prev) => [
          ...prev,
          {
            ...currentCompetition,
            id: Math.random().toString(36).substr(2, 9),
          } as Competition,
        ]);
        toast.success("Competition added successfully");
      }
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setErrors((prev) => ({ ...prev, [err.path[0]]: err.message }));
        });
        toast.error("Please check all required fields");
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
        <BreadcrumbItem href="/profile/competitions">
          Competitions
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl"
        >
          {competitions.length === 0 ? (
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
                {" "}
                <Gem size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">No Competition Added Yet</h3>
              <p className="text-gray-500">
                Start by adding your first competition!
              </p>
              <Button
                onClick={() => onOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Competitions</h2>
                <Button
                  color="primary"
                  startContent={<Plus size={20} />}
                  onPress={handleAdd}
                >
                  Add new
                </Button>
              </div>

              <div className="grid gap-4">
                {competitions.map((competition) => (
                  <motion.div
                    key={competition.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{competition.title}</h3>
                        <p className="text-sm text-gray-500">
                          {competition.position}
                        </p>
                        <p className="text-sm text-gray-500">
                          {competition.date.toString()}
                        </p>
                        <p className="mt-2">{competition.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleEdit(competition)}
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onPress={() => handleDelete(competition.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditing ? "Edit Competition" : "Add New Competition"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Competition Title"
                    placeholder="Enter Competition Title"
                    value={currentCompetition.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                  />
                  <Input
                    label="Position"
                    placeholder="E.g. First, Runners Up"
                    value={currentCompetition.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                  />
                  <Select
                    label="Associated With"
                    placeholder="Select association"
                    value={currentCompetition.associatedWith}
                    onChange={(e) =>
                      handleInputChange("associatedWith", e.target.value)
                    }
                    isInvalid={!!errors.associatedWith}
                    errorMessage={errors.associatedWith}
                  >
                    <SelectItem key="school">School</SelectItem>
                    <SelectItem key="college">College</SelectItem>
                    <SelectItem key="university">University</SelectItem>
                    <SelectItem key="work">Work</SelectItem>
                  </Select>
                  <DateInput
                    label="Competition Date"
                    value={currentCompetition.date}
                    onChange={(date) => handleInputChange("date", date)}
                    maxValue={today("IST")}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter competition details"
                    value={currentCompetition.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
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

export default Competitions;
