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
import { useEffect, useState } from "react";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { Check, Edit2, SquareArrowOutUpRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { Candidate } from "@shared-types/Candidate";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const formSchema = z.object({
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  address: z.string().min(10, "Please enter a complete address"),
  summary: z
    .string()
    .max(1000, "Summary should not exceed 1000 characters")
    .optional(),
});

const General = () => {
  const [candidate, setCandidate] = useState<Candidate>({} as Candidate);
  const [loading, setLoading] = useState<boolean>(false);
  const [editSummary, setEditSummary] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof Candidate, string>>
  >({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  useEffect(() => {
    try {
      setCandidate(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Invalid test data format");
      }
    }
  }, []);

  const validateField = (name: keyof Candidate, value: string) => {
    try {
      // @ts-expect-error - Dynamic key access
      formSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      console.log("Valid field");
      return true;
    } catch (error) {
      console.log("Invalid field");
      console.log(error);
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
        console.log(error.errors[0].message);
        return false;
      }
      return false;
    }
  };

  const handleInputChange = (
    name: keyof Candidate,
    value: string | CalendarDate
  ) => {
    const sanitizedValue = typeof value === "string" ? value.trim() : value;
    setCandidate((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const handleSaveSummary = () => {
    if (validateField("summary", editSummary)) {
      setCandidate((prev) => ({ ...prev, summary: editSummary }));

      onClose();
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      formSchema.parse(candidate);

      setUser(candidate);
      toast.success("Saved");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const uploadResume = (file?: File) => {
    if (!file) toast.error("No file selected");

    const formData = new FormData();
    formData.append("resume", file as Blob);

    axios
      .put("/candidates/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setCandidate((prev) => ({ ...prev, resumeUrl: res.data.data.url }));
        toast.success("Resume uploaded successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to upload resume");
      });
  };

  const getAndOpenResume = () => {
    axios.get("/candidates/resume").then((res) => {
      window.open(res.data.data.url);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile">General</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 w-[50%] rounded-xl"
        >
          <div className="flex flex-col gap-5 w-full">
            <p className="font-semibold">About</p>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Name</label>
              <Input isDisabled value={`${candidate.name}`} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Date of Birth</label>
              <DateInput
                isDisabled
                value={
                  candidate?.dob?.toString()
                    ? parseDate(candidate?.dob?.toString()?.split("T")[0])
                    : today("IST")
                }
                onChange={(date) => handleInputChange("dob", date)}
                maxValue={today("IST")}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Gender</label>
              <Input isDisabled value={candidate.gender} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Email</label>
              <Input
                value={candidate.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Phone</label>
              <Input
                value={candidate.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Address</label>
              <Textarea
                value={candidate.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                isInvalid={!!errors.address}
                errorMessage={errors.address}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Resume</label>
              <p>
                {candidate?.resumeUrl ? (
                  <div className="flex items-center text-xs text-success gap-1">
                    <Check size={16} />
                    <span className="text-xs"> Uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-danger gap-1 min-w-24">
                    <X size={16} />
                    <span className="text-xs">Not uploaded</span>
                  </div>
                )}
              </p>
              <div className="flex gap-3">
                <Input
                  type="file"
                  variant="flat"
                  onChange={(e) => uploadResume(e.target.files?.[0])}
                />
                <Button isIconOnly variant="flat" onClick={getAndOpenResume}>
                  <SquareArrowOutUpRight />
                </Button>
              </div>
            </div>

            <div>
              <Button
                className="mt-4 w-[130px] float-right"
                variant="flat"
                color="success"
                onClick={handleSaveChanges}
                isLoading={loading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 w-[50%] rounded-xl"
        >
          <div className="flex flex-col gap-5 w-full">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Summary</p>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => {
                    setEditSummary(candidate?.summary || "");
                    onOpen();
                  }}
                >
                  <Edit2 size={18} />
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="break-all"
            >
              <pre className="whitespace-pre-wrap break-words font-neue">
                {candidate.summary || "No summary added yet."}
              </pre>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <div>
                <ModalHeader>Edit Summary</ModalHeader>
                <ModalBody>
                  <Textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    placeholder="Enter your professional summary"
                    minRows={4}
                    isInvalid={!!errors.summary}
                    errorMessage={errors.summary}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSaveSummary}>
                    Save
                  </Button>
                </ModalFooter>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </motion.div>
  );
};

export default General;
