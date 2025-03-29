import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  BreadcrumbItem,
  Breadcrumbs,
  DatePicker,
} from "@nextui-org/react";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  ZonedDateTime,
} from "@internationalized/date";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Award, Candidate } from "@shared-types/Candidate";

const Awards = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };
  // States
  const [currentAward, setCurrentAward] = useState<string | null>(null);

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issuer, setIssuer] = useState("");
  const [associatedWith, setAssociatedWith] = useState("academic");
  const [date, setDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIssuer("");
    setAssociatedWith("academic");
    setDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrentAward(null);
  };

  const handleOpenModal = (award?: Award) => {
    if (award) {
      setCurrentAward(award._id || null);
      setTitle(award.title);
      setDescription(award.description || "");
      setIssuer(award.issuer);
      setAssociatedWith(award.associatedWith);
      setDate(new Date(award.date));
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!title || !issuer || !associatedWith) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (currentAward) {
      // Edit existing award
      const newAwards =
        user?.awards?.map((award) =>
          award._id === currentAward
            ? {
                id: currentAward,
                title,
                description,
                issuer,
                associatedWith: associatedWith as
                  | "academic"
                  | "personal"
                  | "professional",
                date: date,
              }
            : award
        ) || [];

      setUser({
        ...user,
        awards: newAwards?.map((award) => ({
          ...award,
          date: parseAbsoluteToLocal(award.date.toString()).toDate(),
        })),
      });
    } else {
      // Add new award
      const newAwards = user?.awards || [];
      setUser({
        ...user,
        awards: [
          ...newAwards,
          {
            title,
            description,
            issuer,
            associatedWith: associatedWith as
              | "academic"
              | "professional"
              | "personal",
            date: date,
          },
        ],
      });
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const awards = user?.awards || [];
    setUser({
      ...user,
      awards: awards.filter((award) => award._id !== id),
    });
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
        <BreadcrumbItem href="/profile/awards">Awards</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl"
        >
          <div className="flex justify-end items-center mb-6">
            {user?.awards && user?.awards?.length > 0 && (
              <Button
                startContent={<Plus size={18} />}
                onPress={() => handleOpenModal()}
              >
                Add new
              </Button>
            )}
          </div>

          {user?.awards && user?.awards.length === 0 ? (
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
                <Trophy size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">No Award Added Yet</h3>
              <p className="text-gray-500">Start by adding your first award!</p>
              <Button
                onClick={() => onOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {user?.awards &&
                user?.awards.map((award) => (
                  <motion.div
                    key={award._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{award.title}</h3>
                        <p className="text-sm text-gray-500">
                          {award.issuer} • {award.associatedWith}
                        </p>
                        <p className="text-sm text-gray-500">
                          {award.date.toString()}
                        </p>
                        {award.description && (
                          <p className="mt-2">{award.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => handleOpenModal(award)}
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onPress={() => handleDelete(award._id as string)}
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

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {currentAward ? "Edit Award" : "Add New Award"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Position Title"
                    placeholder="Enter Position Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Issuer/Organizer"
                    placeholder="Enter Issuer/Organizer"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Associated With"
                    placeholder="Enter Associated With"
                    value={associatedWith}
                    onChange={(e) => setAssociatedWith(e.target.value)}
                    isRequired
                  />
                  <div>
                    <label className="block text-sm mb-1">Issue Date</label>
                    <DatePicker
                      className="max-w-xs"
                      label="Issue Date (mm/dd/yyyy)"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(date.toISOString())}
                      onChange={handleDateChange}
                    />
                  </div>
                  <Textarea
                    label="Description"
                    placeholder="Enter award description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

export default Awards;
