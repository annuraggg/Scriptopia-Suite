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
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
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

  const [editId, setEditId] = useState<string | null>(null);

  // Modal Handlers
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [url, setUrl] = useState<string | null>("");
  const [licenseNumber, setLicenseNumber] = useState<string | null>("");
  const [issueDate, setIssueDate] = useState(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [doesExpire, setDoesExpire] = useState(false);
  const [hasScore, setHasScore] = useState(false);
  const [description, setDescription] = useState("");

  const handleOpen = (certificate?: Certificate) => {
    if (certificate) {
      setTitle(certificate.title);
      setIssuer(certificate.issuer);
      setUrl(certificate.url || null);
      setLicenseNumber(certificate.licenseNumber || null);
      setIssueDate(new Date(certificate.issueDate));
      setDoesExpire(certificate.doesExpire);
      setHasScore(certificate.hasScore);
      setDescription(certificate.description);
      setEditId(certificate._id || null);
    } else {
      setTitle("");
      setIssuer("");
      setUrl(null);
      setLicenseNumber(null);
      setIssueDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
      setDoesExpire(false);
      setHasScore(false);
      setDescription("");
      setEditId(null);
    }
    onOpen();
  };

  const handleClose = () => {
    setTitle("");
    setIssuer("");
    setUrl(null);
    setLicenseNumber(null);
    setIssueDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setDoesExpire(false);
    setHasScore(false);
    setDescription("");
    setEditId(null);
    onClose();
  };

  const handleSave = () => {
    if (!title || !issuer) {
      toast.error("Please fill all required fields");
      return;
    }

    const currentCertificate: Certificate = {
      _id: editId || undefined,
      title,
      issuer,
      url: url || undefined,
      licenseNumber: licenseNumber || undefined,
      issueDate,
      doesExpire,
      hasScore,
      description,
    };

    if (editId) {
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

  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setIssueDate(dateObj);
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
                {editId ? "Edit Certification" : "Add New Certification"}
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter certification name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    label="Issuing Authority"
                    placeholder="Enter issuing authority"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Certification URL"
                    placeholder="Enter certification URL"
                    value={url || ""}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Input
                    label="License Number"
                    placeholder="Enter license number"
                    value={licenseNumber || ""}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                  <DatePicker
                    className="max-w-xs"
                    label="Issue Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(issueDate.toISOString())}
                    onChange={handleDateChange}
                  />
                  <div className="flex gap-4">
                    <Checkbox
                      isSelected={doesExpire}
                      onValueChange={(value) => setDoesExpire(value)}
                    >
                      This certificate has an expiry date
                    </Checkbox>
                    <Checkbox
                      isSelected={hasScore}
                      onValueChange={(value) => setHasScore(value)}
                    >
                      I have a score for this certification
                    </Checkbox>
                  </div>
                  <Textarea
                    label="Description"
                    placeholder="Enter certification description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
