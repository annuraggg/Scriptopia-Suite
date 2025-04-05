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
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useEffect, useState, useCallback } from "react";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { Check, Edit2, SquareArrowOutUpRight, X, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { Candidate } from "@shared-types/Candidate";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { debounce } from "lodash";

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
  const [saving, setSaving] = useState<boolean>(false);
  const [editSummary, setEditSummary] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof Candidate, string>>
  >({});
  const [resumeUploadLoading, setResumeUploadLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };
  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    try {
      setCandidate(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Invalid data format");
      }
    }
  }, [user]);

  const validateField = (name: keyof Candidate, value: string) => {
    try {
      // @ts-expect-error 
      formSchema.shape[name]?.parse(value);
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

  const saveChanges = async (updatedCandidate: Candidate) => {
    try {
      setSaving(true);
      formSchema.parse(updatedCandidate);
      setUser(updatedCandidate);
      setHasChanges(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const debouncedSave = useCallback(
    debounce((data: Candidate) => {
      saveChanges(data);
    }, 800),
    []
  );

  const handleInputChange = (
    name: keyof Candidate,
    value: string | CalendarDate
  ) => {
    const sanitizedValue =
      typeof value === "string" && name !== "address" ? value.trim() : value;

    const updatedCandidate = { ...candidate, [name]: sanitizedValue };
    setCandidate(updatedCandidate);
    setHasChanges(true);

    if (typeof value === "string") {
      const isValid = validateField(name, value);
      if (isValid) {
        debouncedSave(updatedCandidate);
      }
    }
  };

  const handleSaveSummary = () => {
    if (validateField("summary", editSummary)) {
      const updatedCandidate = { ...candidate, summary: editSummary };
      setCandidate(updatedCandidate);
      saveChanges(updatedCandidate);
      onClose();
    }
  };

  const uploadResume = (file?: File) => {
    if (!file) return toast.error("No file selected");

    setResumeUploadLoading(true);
    const formData = new FormData();
    formData.append("resume", file as Blob);

    axios
      .put("/candidates/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const updatedCandidate = { ...candidate, resumeUrl: res.data.data.url };
        setCandidate(updatedCandidate);
        setUser(updatedCandidate);
        toast.success("Resume uploaded successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to upload resume");
      })
      .finally(() => {
        setResumeUploadLoading(false);
      });
  };

  const getAndOpenResume = () => {
    if (!candidate.resumeUrl) {
      return toast.error("No resume uploaded yet");
    }

    axios.get("/candidates/resume").then((res) => {
      window.open(res.data.data.url);
    });
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile">General</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex gap-5 flex-col md:flex-row">
        <div className="p-5 w-full md:w-[50%] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">Personal Information</p>
              {(saving || hasChanges) && (
                <div className="flex items-center gap-2">
                  {saving ? (
                    <Spinner size="sm" />
                  ) : (
                    <Save size={16} className="text-primary" />
                  )}
                  <span className="text-xs text-neutral-500">
                    {saving ? "Saving..." : "Unsaved changes"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right text-sm text-neutral-500">
                Name
              </label>
              <Input
                value={`${candidate.name || ""}`}
                aria-label="Name"
                readOnly
                description={
                  <div className="text-warning-500">
                    This Field cannot be changed
                  </div>
                }
                classNames={{
                  input: "bg-neutral-50 dark:bg-neutral-900",
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right text-sm text-neutral-500">
                Date of Birth
              </label>
              <DateInput
                description={
                  <div className="text-warning-500">
                    This Field cannot be changed
                  </div>
                }
                value={
                  candidate?.dob?.toString()
                    ? parseDate(candidate?.dob?.toString()?.split("T")[0])
                    : today("IST")
                }
                maxValue={today("IST")}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right text-sm text-neutral-500">
                Gender
              </label>
              <Input
                readOnly
                description={
                  <div className="text-warning-500">
                    This Field cannot be changed
                  </div>
                }
                value={
                  candidate.gender?.slice(0, 1).toUpperCase() +
                    candidate.gender?.slice(1).toLowerCase() || ""
                }
                aria-label="Gender"
                classNames={{
                  input: "bg-neutral-50 dark:bg-neutral-900",
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right text-sm text-neutral-500">
                Email
              </label>
              <Input
                value={candidate.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                aria-label="Email"
                type="email"
                autoComplete="email"
                readOnly
                description="You can change your email in account settings"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right text-sm text-neutral-500">
                Phone
              </label>
              <Input
                value={candidate.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
                aria-label="Phone"
                type="tel"
                autoComplete="tel"
              />
            </div>

            <div className="flex items-start gap-4">
              <label className="w-32 text-right text-sm text-neutral-500 pt-2">
                Address
              </label>
              <Textarea
                value={candidate.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                isInvalid={!!errors.address}
                errorMessage={errors.address}
                aria-label="Address"
                autoComplete="street-address"
                minRows={2}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-32 text-right text-sm text-neutral-500">
                Resume
              </label>
              <div className="flex flex-col sm:flex-row gap-2 flex-grow">
                <div className="flex items-center">
                  {candidate?.resumeUrl ? (
                    <div className="flex items-center text-xs text-success gap-1">
                      <Check size={16} />
                      <span className="text-xs">Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-danger gap-1">
                      <X size={16} />
                      <span className="text-xs">Not uploaded</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Input
                    type="file"
                    variant="flat"
                    onChange={(e) => uploadResume(e.target.files?.[0])}
                    isDisabled={resumeUploadLoading}
                    accept=".pdf,.doc,.docx"
                    aria-label="Upload resume"
                    className="max-w-sm"
                    size="sm"
                  />
                  <Tooltip content="View resume">
                    <Button
                      isIconOnly
                      variant="flat"
                      onClick={getAndOpenResume}
                      isLoading={resumeUploadLoading}
                      isDisabled={!candidate.resumeUrl}
                      aria-label="View resume"
                      size="sm"
                    >
                      <SquareArrowOutUpRight size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 w-full md:w-[50%] rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">Professional Summary</p>
              <Tooltip content="Edit summary">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => {
                    setEditSummary(candidate?.summary || "");
                    onOpen();
                  }}
                  aria-label="Edit summary"
                >
                  <Edit2 size={18} />
                </Button>
              </Tooltip>
            </div>
            <div className="p-4 rounded-lg min-h-[200px]">
              {candidate.summary ? (
                <pre className="whitespace-pre-wrap break-words font-neue">
                  {candidate.summary}
                </pre>
              ) : (
                <p className="text-neutral-500 italic">
                  No professional summary added yet. Click the edit button to
                  add your career highlights, skills, and experience.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalContent>
            {(onClose) => (
              <div>
                <ModalHeader>Edit Professional Summary</ModalHeader>
                <ModalBody>
                  <Textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    placeholder="Enter your professional summary highlighting your skills, experience, and career achievements."
                    minRows={8}
                    isInvalid={!!errors.summary}
                    errorMessage={errors.summary}
                    aria-label="Professional summary"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    {editSummary.length}/1000 characters
                  </p>
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
    </div>
  );
};

export default General;
