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
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";

// Types
interface Award {
  id: string;
  title: string;
  issuer: string;
  associatedWith: string;
  issueDate: CalendarDate;
  description: string;
}

interface AwardFormData {
  title: string;
  issuer: string;
  associatedWith: string;
  issueDate: CalendarDate;
  description: string;
}

const Awards = () => {
  // States
  const [awards, setAwards] = useState<Award[]>([]);
  const [currentAward, setCurrentAward] = useState<Award | null>(null);
  const [formData, setFormData] = useState<AwardFormData>({
    title: "",
    issuer: "",
    associatedWith: "",
    issueDate: parseDate(today("IST").toString()),
    description: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handlers
  const handleInputChange = (
    name: keyof AwardFormData,
    value: string | CalendarDate
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      associatedWith: "",
      issueDate: parseDate(today("IST").toString()),
      description: "",
    });
    setCurrentAward(null);
  };

  const handleOpenModal = (award?: Award) => {
    if (award) {
      setCurrentAward(award);
      setFormData({
        title: award.title,
        issuer: award.issuer,
        associatedWith: award.associatedWith,
        issueDate: award.issueDate,
        description: award.description,
      });
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
    if (!formData.title || !formData.issuer || !formData.associatedWith) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (currentAward) {
      // Edit existing award
      setAwards((prev) =>
        prev.map((award) =>
          award.id === currentAward.id
            ? { ...formData, id: currentAward.id }
            : award
        )
      );
      toast.success("Award updated successfully");
    } else {
      // Add new award
      setAwards((prev) => [
        ...prev,
        { ...formData, id: Math.random().toString(36).substr(2, 9) },
      ]);
      toast.success("Award added successfully");
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setAwards((prev) => prev.filter((award) => award.id !== id));
    toast.success("Award deleted successfully");
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
            {awards.length > 0 && (
              <Button
                startContent={<Plus size={18} />}
                onPress={() => handleOpenModal()}
              >
                Add new
              </Button>
            )}
          </div>

          {awards.length === 0 ? (
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
              {awards.map((award) => (
                <motion.div
                  key={award.id}
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
                        {award.issueDate.toString()}
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
                        onPress={() => handleDelete(award.id)}
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
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Issuer/Organizer"
                    placeholder="Enter Issuer/Organizer"
                    value={formData.issuer}
                    onChange={(e) =>
                      handleInputChange("issuer", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    label="Associated With"
                    placeholder="Enter Associated With"
                    value={formData.associatedWith}
                    onChange={(e) =>
                      handleInputChange("associatedWith", e.target.value)
                    }
                    isRequired
                  />
                  <div>
                    <label className="block text-sm mb-1">Issue Date</label>
                    <DateInput
                      value={formData.issueDate}
                      onChange={(date) => handleInputChange("issueDate", date)}
                      maxValue={today("IST")}
                    />
                  </div>
                  <Textarea
                    label="Description"
                    placeholder="Enter award description"
                    value={formData.description}
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

export default Awards;
