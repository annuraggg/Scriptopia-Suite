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
  Checkbox,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { parseDate, today } from "@internationalized/date";
import { Plus, Edit2, Trash, FileBadge2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Candidate, Certificate } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

const Certificates = () => {
  // States
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [currentCertificate, setCurrentCertificate] = useState<Certificate>(
    {} as Certificate
  );
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialCertificate: Certificate = {
    title: "",
    issuer: "",
    url: "",
    licenseNumber: "",
    issueDate: today("IST").toString(),
    doesExpire: false,
    hasScore: false,
    description: "",
  };

  const handleOpen = (certificate?: Certificate) => {
    if (certificate) {
      setCurrentCertificate(certificate);
      setIsEditing(true);
    } else {
      setCurrentCertificate({
        ...initialCertificate,
        _id: crypto.randomUUID(),
      });
      setIsEditing(false);
    }
    onOpen();
  };

  const handleClose = () => {
    setCurrentCertificate({} as Certificate);
    setIsEditing(false);
    onClose();
  };

  const handleSave = () => {
    if (!currentCertificate) return;

    if (!currentCertificate.title || !currentCertificate.issuer) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      const newCertificates = user?.certificates?.map((cert) =>
        cert._id === currentCertificate._id ? currentCertificate : cert
      );
      setUser({ ...user, certificates: newCertificates });
    } else {
      const newCertificates = [
        ...(user?.certificates || []),
        currentCertificate,
      ];
      setUser({ ...user, certificates: newCertificates });
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    const newCertificates = user?.certificates?.filter(
      (cert) => cert._id !== id
    );
    setUser({ ...user, certificates: newCertificates });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/certificates">
          Certificates
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
            {user?.certificates && (
              <Button
                onClick={() => handleOpen()}
                startContent={<Plus size={18} />}
              >
                Add new
              </Button>
            )}
          </div>

          {!user?.certificates ? (
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
                <FileBadge2 size={50} />
              </motion.div>

              <h3 className="text-xl mt-3">No Certificate Added Yet</h3>
              <p className="text-gray-500">
                Start by adding your first certificate!
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
              {user?.certificates?.map((cert) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{cert.title}</h3>
                      <p className="text-sm text-gray-500">{cert.issuer}</p>
                      <p className="text-sm mt-1">
                        License: {cert.licenseNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => handleOpen(cert)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(cert._id || "")}
                      >
                        <Trash size={18} />
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
                {isEditing ? "Edit Certification" : "Add New Certification"}
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter certification name"
                    value={currentCertificate?.title || ""}
                    onChange={(e) =>
                      setCurrentCertificate((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                    isRequired
                  />
                  <Input
                    label="Issuing Authority"
                    placeholder="Enter issuing authority"
                    value={currentCertificate?.issuer || ""}
                    onChange={(e) =>
                      setCurrentCertificate((prev) => ({
                        ...prev!,
                        authority: e.target.value,
                      }))
                    }
                    isRequired
                  />
                  <Input
                    label="Certification URL"
                    placeholder="Enter certification URL"
                    value={currentCertificate?.url || ""}
                    onChange={(e) =>
                      setCurrentCertificate((prev) => ({
                        ...prev!,
                        url: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="License Number"
                    placeholder="Enter license number"
                    value={currentCertificate?.licenseNumber || ""}
                    onChange={(e) =>
                      setCurrentCertificate((prev) => ({
                        ...prev!,
                        licenseNumber: e.target.value,
                      }))
                    }
                  />
                  <DateInput
                    label="Certification Date"
                    value={parseDate(currentCertificate?.issueDate)}
                    onChange={(date) =>
                      setCurrentCertificate((prev) => ({
                        ...prev!,
                        date,
                      }))
                    }
                    maxValue={today("IST")}
                  />
                  <div className="flex gap-4">
                    <Checkbox
                      isSelected={currentCertificate?.doesExpire}
                      onValueChange={(value) =>
                        setCurrentCertificate((prev) => ({
                          ...prev!,
                          hasExpiry: value,
                        }))
                      }
                    >
                      This certificate has an expiry date
                    </Checkbox>
                    <Checkbox
                      isSelected={currentCertificate?.hasScore}
                      onValueChange={(value) =>
                        setCurrentCertificate((prev) => ({
                          ...prev!,
                          hasScore: value,
                        }))
                      }
                    >
                      I have a score for this certification
                    </Checkbox>
                  </div>
                  <Textarea
                    label="Description"
                    placeholder="Enter certification description"
                    value={currentCertificate?.description || ""}
                    onChange={(e) =>
                      setCurrentCertificate((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    }
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

export default Certificates;
