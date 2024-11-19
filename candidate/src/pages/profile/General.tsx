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
import { Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

// Types and Interfaces
interface SocialMedia {
  name: string;
  url: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: CalendarDate;
  gender: string;
  address: string;
  socialMedia: SocialMedia[];
  summary: string;
}

// Validation Schemas
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().regex(emailRegex, "Invalid email format"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  dob: z.instanceof(CalendarDate),
  gender: z.string(),
  address: z.string().min(10, "Please enter a complete address"),
  socialMedia: z.array(z.object({ name: z.string(), url: z.string().url() })),
  summary: z.string().max(500, "Summary cannot exceed 500 characters"),
});

const General = () => {
  // State initialization with proper typing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: parseDate("2000-01-01"),
    gender: "",
    address: "",
    socialMedia: [] as SocialMedia[],
    summary: "",
  });

  const [editSummary, setEditSummary] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Load test data with validation
    try {
      const testData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        phone: "1234567890",
        dob: parseDate("2004-01-17"),
        gender: "Male",
        address: "123, Test Street, Test City, Test State, Test Country",
        socialMedia: [
          { name: "LinkedIn", url: "https://linkedin.com" },
          { name: "Twitter", url: "https://twitter.com" },
        ],
        summary:
          "I am a software developer with 5 years of experience in web development.",
      };

      // Validate test data
      formSchema.parse(testData);
      setFormData(testData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Invalid test data format");
      }
    }
  }, []);

  const validateField = (name: keyof FormData, value: string) => {
    try {
      formSchema.shape[name].parse(value);
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

  const handleInputChange = (
    name: keyof FormData,
    value: string | CalendarDate
  ) => {
    const sanitizedValue = typeof value === "string" ? value.trim() : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const handleSaveSummary = () => {
    if (validateField("summary", editSummary)) {
      setFormData((prev) => ({ ...prev, summary: editSummary }));
      toast.success("Summary updated successfully");
      onClose();
    } else {
      toast.error("Please check the summary requirements");
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Validate all fields
      formSchema.parse(formData);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Changes saved successfully");
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
              <Input
                isDisabled
                value={`${formData.firstName} ${formData.lastName}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Date of Birth</label>
              <DateInput
                isDisabled
                value={formData.dob}
                onChange={(date) => handleInputChange("dob", date)}
                maxValue={today("IST")}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Gender</label>
              <Input isDisabled value={formData.gender} />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Address</label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                isInvalid={!!errors.address}
                errorMessage={errors.address}
              />
            </div>

            <div>
              <Button
                className="mt-4 w-[130px] float-right"
                variant="flat"
                color="success"
                onClick={handleSaveChanges}
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
                    setEditSummary(formData.summary);
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
            >
              {formData.summary || "No summary added yet."}
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
