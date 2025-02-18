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
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
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

  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [associatedWith, setAssociatedWith] = useState<
    "academic" | "personal" | "professional"
  >("academic");
  const [date, setDate] = useState(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [description, setDescription] = useState("");

  const handleOpen = (competition?: Competition) => {
    if (competition) {
      setTitle(competition.title);
      setPosition(competition.position);
      setOrganizer(competition.organizer);
      setAssociatedWith(competition.associatedWith);
      setDate(new Date(competition.date));
      setEditingId(competition._id || null);
    } else {
      setEditingId(null);
    }
    onOpen();
  };

  const handleClose = () => {
    setTitle("");
    setPosition("");
    setOrganizer("");
    setAssociatedWith("academic");
    setDate(new Date());
    setDescription("");
    setEditingId(null);
    onClose();
  };

  const handleSave = () => {
    if (!title || !position || !organizer) {
      toast.error("Please fill in all required fields");
      return;
    }

    const competitionToSave = {
      _id: editingId || undefined,
      title,
      position,
      organizer,
      associatedWith,
      date,
      description,
    };

    if (editingId) {
      const newCompetitions = user?.competitions?.map((comp) =>
        comp._id === editingId ? competitionToSave : comp
      );
      setUser({
        ...user,
        competitions: newCompetitions?.map((comp) => ({
          ...comp,
          date: new Date(comp.date),
        })),
      });
      toast.success("Competition updated successfully");
    } else {
      const newCompetition = {
        ...competitionToSave,
      };
      const newCompetitions = [...(user?.competitions || []), newCompetition];
      setUser({
        ...user,
        competitions: newCompetitions.map((comp) => ({
          ...comp,
          date: new Date(comp.date),
        })),
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

  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setDate(dateObj);
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
                        {formatDate(new Date(competition.date).toISOString())}
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
                {editingId ? "Edit Competition" : "Add New Competition"}
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-4">
                  <Input
                    label="Competition Title"
                    placeholder="Enter competition title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Position"
                    placeholder="E.g. First, Runners Up"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Organizer"
                    placeholder="Enter organizer name"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    isRequired
                  />
                  <Select
                    label="Associated With"
                    placeholder="Select association"
                    selectedKeys={[associatedWith]}
                    onSelectionChange={(keys) =>
                      setAssociatedWith(
                        keys.currentKey as
                          | "personal"
                          | "academic"
                          | "professional"
                      )
                    }
                    isRequired
                  >
                    <SelectItem key="personal">Personal</SelectItem>
                    <SelectItem key="academic">Academic</SelectItem>
                    <SelectItem key="professional">Professional</SelectItem>
                  </Select>
                  <DatePicker
                    className="max-w-xs"
                    label="Competition Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(date.toISOString())}
                    onChange={handleDateChange}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter competition details"
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

export default Competitions;
