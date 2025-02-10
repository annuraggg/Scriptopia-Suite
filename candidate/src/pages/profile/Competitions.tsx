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
import { parseDate, today } from "@internationalized/date";
import { Plus, Pencil, Trash2, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Candidate, Competition } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

const Competitions = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [currentCompetition, setCurrentCompetition] = useState<Competition>({} as Competition);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialCompetition: Competition = {
    title: "",
    position: "",
    organizer: "",
    associatedWith: "academic",
    date: new Date(today("IST").toString()),
    description: "",
  };

  const handleOpen = (competition?: Competition) => {
    if (competition) {
      const formattedCompetition = {
        ...competition,
        date: competition.date 
          ? new Date(competition.date)
          : new Date(today("IST").toString())
      };
      setCurrentCompetition(formattedCompetition);
      setIsEditing(true);
    } else {
      setCurrentCompetition(initialCompetition);
      setIsEditing(false);
    }
    onOpen();
  };

  const handleClose = () => {
    setCurrentCompetition({} as Competition);
    setIsEditing(false);
    onClose();
  };

  const handleSave = () => {
    if (!currentCompetition) return;

    if (!currentCompetition.title || !currentCompetition.position || !currentCompetition.organizer) {
      toast.error("Please fill in all required fields");
      return;
    }

    const competitionToSave = {
      ...currentCompetition,
      date: new Date(currentCompetition.date).toISOString()
    };

    if (isEditing) {
      const newCompetitions = user?.competitions?.map((comp) =>
        comp._id === currentCompetition._id ? competitionToSave : comp
      );
      setUser({ 
        ...user, 
        competitions: newCompetitions?.map(comp => ({
          ...comp,
          date: new Date(comp.date)
        })) 
      });
      toast.success("Competition updated successfully");
    } else {
      const newCompetition = {
        ...competitionToSave,
        _id: Date.now().toString(),
      };
      const newCompetitions = [
        ...(user?.competitions || []),
        newCompetition,
      ];
      setUser({ 
        ...user, 
        competitions: newCompetitions.map(comp => ({
          ...comp,
          date: new Date(comp.date)
        })) 
      });
      toast.success("Competition added successfully");
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    const newCompetitions = user?.competitions?.filter(
      (comp) => comp._id !== id
    );
    setUser({ ...user, competitions: newCompetitions });
    toast.success("Competition deleted successfully");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid date";
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
          <div className="flex justify-end items-center mb-6">
            {user?.competitions && (
              <Button
                onClick={() => handleOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            )}
          </div>

          {!user?.competitions ? (
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
                <Gem size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">No Competition Added Yet</h3>
              <p className="text-gray-500">
                Start by adding your first competition!
              </p>
              <Button
                onClick={() => handleOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {user?.competitions?.map((competition) => (
                <motion.div
                  key={competition._id}
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
                        {formatDate(competition.date.toISOString())}
                      </p>
                      <p className="mt-2">{competition.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => handleOpen(competition)}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(competition._id || "")}
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

      <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {isEditing ? "Edit Competition" : "Add New Competition"}
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-4">
                  <Input
                    label="Competition Title"
                    placeholder="Enter competition title"
                    value={currentCompetition?.title || ""}
                    onChange={(e) =>
                      setCurrentCompetition((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    isRequired
                  />
                  <Input
                    label="Position"
                    placeholder="E.g. First, Runners Up"
                    value={currentCompetition?.position || ""}
                    onChange={(e) =>
                      setCurrentCompetition((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    isRequired
                  />
                  <Input
                    label="Organizer"
                    placeholder="Enter organizer name"
                    value={currentCompetition?.organizer || ""}
                    onChange={(e) =>
                      setCurrentCompetition((prev) => ({
                        ...prev,
                        organizer: e.target.value,
                      }))
                    }
                    isRequired
                  />
                  <Select
                    label="Associated With"
                    placeholder="Select association"
                    selectedKeys={[currentCompetition?.associatedWith || "academic"]}
                    onChange={(e) =>
                      setCurrentCompetition((prev) => ({
                        ...prev,
                        associatedWith: e.target.value as "academic" | "personal" | "professional",
                      }))
                    }
                    isRequired
                  >
                    <SelectItem key="personal">Personal</SelectItem>
                    <SelectItem key="academic">Academic</SelectItem>
                    <SelectItem key="professional">Professional</SelectItem>
                  </Select>
                  <DateInput
                    label="Competition Date"
                    value={parseDate(currentCompetition?.date.toString() || today("IST").toString())}
                    onChange={(date) =>
                      setCurrentCompetition((prev) => ({
                        ...prev,
                        date: new Date(date.toString()),
                      }))
                    }
                    isRequired
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter competition details"
                    value={currentCompetition?.description || ""}
                    onChange={(e) =>
                      setCurrentCompetition((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
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

export default Competitions;