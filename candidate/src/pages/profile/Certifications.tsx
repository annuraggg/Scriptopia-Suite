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
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import {
  Plus,
  Edit2,
  Trash,
  FileBadge2,
  Calendar,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Candidate, Certificate } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Validation schema using Zod
const certificateSchema = z.object({
  title: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuing authority is required"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  licenseNumber: z.string().optional(),
  issueDate: z.date(),
  doesExpire: z.boolean(),
  hasScore: z.boolean(),
  description: z.string().optional(),
});

type FormErrors = {
  [key: string]: string;
};

const Certificates = () => {
  // Context and state
  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  const [editId, setEditId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [url, setUrl] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [issueDate, setIssueDate] = useState(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [doesExpire, setDoesExpire] = useState(false);
  const [hasScore, setHasScore] = useState(false);
  const [description, setDescription] = useState("");

  // Initialize form with certificate data for editing
  const handleOpen = (certificate?: Certificate) => {
    setErrors({});

    if (certificate) {
      setTitle(certificate.title);
      setIssuer(certificate.issuer);
      setUrl(certificate.url || "");
      setLicenseNumber(certificate.licenseNumber || "");
      setIssueDate(new Date(certificate.issueDate));
      setDoesExpire(certificate.doesExpire);
      setHasScore(certificate.hasScore);
      setDescription(certificate.description);
      setEditId(certificate._id || null);
    } else {
      resetForm();
    }
    onOpen();
  };

  // Reset form values
  const resetForm = () => {
    setTitle("");
    setIssuer("");
    setUrl("");
    setLicenseNumber("");
    setIssueDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setDoesExpire(false);
    setHasScore(false);
    setDescription("");
    setEditId(null);
    setErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
  };

  // Validate and save certificate
  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const formData = {
        title,
        issuer,
        url: url || undefined,
        licenseNumber: licenseNumber || undefined,
        issueDate,
        doesExpire,
        hasScore,
        description,
      };

      // Validate form data
      certificateSchema.parse(formData);

      const currentCertificate: Certificate = {
        _id: editId || undefined,
        ...formData,
      };

      if (editId) {
        const newCertificates =
          user?.certificates?.map((cert) =>
            cert._id === currentCertificate._id ? currentCertificate : cert
          ) || [];
        setUser({ ...user, certificates: newCertificates });
        toast.success("Certificate updated successfully");
      } else {
        // Generate a temporary ID for new certificates
        const tempId = `temp-${Date.now()}`;
        const newCertificate = { ...currentCertificate, _id: tempId };
        const newCertificates = [...(user?.certificates || []), newCertificate];
        setUser({ ...user, certificates: newCertificates });
        toast.success("Certificate added successfully");
      }

      resetForm();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please correct the errors in the form");
      } else {
        toast.error("An error occurred while saving the certificate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete certificate with confirmation
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      const newCertificates =
        user?.certificates?.filter((cert) => cert._id !== id) || [];
      setUser({ ...user, certificates: newCertificates });
      toast.success("Certificate deleted successfully");
    }
  };

  // Handle date change
  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setIssueDate(dateObj);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs size="sm">
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Certificates</BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="text-2xl font-semibold mt-4">
          Professional Certificates
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your certifications and licenses
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-medium">Your Certificates</h2>
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            onClick={() => handleOpen()}
          >
            Add Certificate
          </Button>
        </CardHeader>

        <Divider />

        <CardBody className="p-0">
          {!user?.certificates || user.certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <FileBadge2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No certificates added yet
              </h3>
              <p className="text-gray-500 mb-4 max-w-md">
                Add your professional certifications to showcase your skills and
                qualifications
              </p>
              <Button
                color="primary"
                startContent={<Plus size={16} />}
                onClick={() => handleOpen()}
              >
                Add Your First Certificate
              </Button>
            </div>
          ) : (
            <Table aria-label="Certificates table">
              <TableHeader>
                <TableColumn>CERTIFICATE</TableColumn>
                <TableColumn>ISSUER</TableColumn>
                <TableColumn>ISSUE DATE</TableColumn>
                <TableColumn>LICENSE</TableColumn>
                <TableColumn width={120}>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {user?.certificates?.map((cert) => (
                  <TableRow key={cert._id}>
                    <TableCell>
                      <div className="font-medium">{cert.title}</div>
                      {cert.description && (
                        <p className="text-small text-gray-500 line-clamp-1">
                          {cert.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>
                      {formatDate(new Date(cert.issueDate))}
                    </TableCell>
                    <TableCell>
                      {cert.licenseNumber ? cert.licenseNumber : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Tooltip content="Edit">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onClick={() => handleOpen(cert)}
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onClick={() => handleDelete(cert._id || "")}
                          >
                            <Trash size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleClose}
        size="3xl"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">
                    {editId ? "Edit Certificate" : "Add New Certificate"}
                  </h3>
                  <p className="text-small text-gray-500">
                    Fill in the details of your professional certification
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Certificate Name"
                      placeholder="Enter the name of your certification"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      errorMessage={errors.title}
                      isInvalid={!!errors.title}
                      isRequired
                      startContent={
                        <FileText size={16} className="text-gray-400" />
                      }
                    />
                  </div>

                  <Input
                    label="Issuing Organization"
                    placeholder="Organization that issued this certificate"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    errorMessage={errors.issuer}
                    isInvalid={!!errors.issuer}
                    isRequired
                  />

                  <DatePicker
                    label="Issue Date"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(issueDate.toISOString())}
                    onChange={handleDateChange}
                    startContent={
                      <Calendar size={16} className="text-gray-400" />
                    }
                  />

                  <Input
                    label="License/Credential ID"
                    placeholder="Enter credential identifier (optional)"
                    value={licenseNumber || ""}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />

                  <Input
                    label="Credential URL"
                    placeholder="Link to verify this credential (optional)"
                    value={url || ""}
                    onChange={(e) => setUrl(e.target.value)}
                    errorMessage={errors.url}
                    isInvalid={!!errors.url}
                    startContent={
                      <LinkIcon size={16} className="text-gray-400" />
                    }
                  />

                  <div className="col-span-1 md:col-span-2">
                    <div className="flex flex-col gap-2">
                      <div className="text-small font-medium">
                        Additional Information
                      </div>
                      <div className="flex gap-6 flex-wrap">
                        <Checkbox
                          isSelected={doesExpire}
                          onValueChange={(value) => setDoesExpire(value)}
                        >
                          This certificate expires
                        </Checkbox>
                        <Checkbox
                          isSelected={hasScore}
                          onValueChange={(value) => setHasScore(value)}
                        >
                          I received a score
                        </Checkbox>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      label="Description"
                      placeholder="Brief description of what this certification represents (optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      minRows={3}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={() => onClose()}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                >
                  {editId ? "Update Certificate" : "Add Certificate"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Certificates;
