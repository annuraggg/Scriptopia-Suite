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
  Chip,
  Badge,
  Skeleton,
  Link,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import {
  Plus,
  Edit2,
  Trash2,
  FileBadge2,
  Calendar,
  Link as LinkIcon,
  FileText,
  AlertCircle,
  ExternalLink,
  Info,
  Clock,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Candidate, Certificate } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Validation schema using Zod with more detailed error messages
const certificateSchema = z
  .object({
    title: z
      .string()
      .min(1, "Certificate name is required")
      .max(150, "Certificate name is too long"),
    issuer: z
      .string()
      .min(1, "Issuing organization is required")
      .max(100, "Issuer name is too long"),
    url: z
      .string()
      .url("Please enter a valid URL (include https://)")
      .or(z.string().length(0))
      .optional(),
    licenseNumber: z.string().max(100, "License number is too long").optional(),
    issueDate: z
      .date()
      .refine(
        (date) => date <= new Date(),
        "Issue date cannot be in the future"
      ),
    expiryDate: z.date().optional(),
    doesExpire: z.boolean(),
    hasScore: z.boolean(),
    score: z.number().min(0).max(100).optional(),
    description: z.string().max(500, "Description is too long").optional(),
  })
  .refine(
    (data) => {
      // If doesExpire is true, expiryDate should be present and after issueDate
      if (data.doesExpire && !data.expiryDate) {
        return false;
      }
      if (
        data.doesExpire &&
        data.expiryDate &&
        data.expiryDate <= data.issueDate
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Expiry date must be after the issue date",
      path: ["expiryDate"],
    }
  )
  .refine(
    (data) => {
      // If hasScore is true, score should be present
      if (data.hasScore && (data.score === undefined || data.score === null)) {
        return false;
      }
      return true;
    },
    {
      message: "Score is required when 'I received a score' is selected",
      path: ["score"],
    }
  );

type FormErrors = {
  [key: string]: string;
};

const Certificates = () => {
  // Context and state
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  const [editId, setEditId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal state
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [url, setUrl] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [issueDate, setIssueDate] = useState(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [doesExpire, setDoesExpire] = useState(false);
  const [hasScore, setHasScore] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");

  // Sort certificates by issue date (most recent first)
  const sortedCertificates = [...(user?.certificates || [])].sort((a, b) => {
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

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
      if (certificate.doesExpire && certificate.expiryDate) {
        setExpiryDate(new Date(certificate.expiryDate));
      } else {
        setExpiryDate(undefined);
      }
      setHasScore(certificate.hasScore);
      setScore(certificate.score);
      setDescription(certificate.description || "");
      setEditId(certificate._id || null);
    } else {
      resetForm();
    }
    onOpen();
  };

  // Watch for doesExpire changes
  useEffect(() => {
    if (!doesExpire) {
      setExpiryDate(undefined);
      // Clear any expiry date errors
      if (errors.expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: "" }));
      }
    }
  }, [doesExpire]);

  // Watch for hasScore changes
  useEffect(() => {
    if (!hasScore) {
      setScore(undefined);
      // Clear any score errors
      if (errors.score) {
        setErrors((prev) => ({ ...prev, score: "" }));
      }
    }
  }, [hasScore]);

  // Reset form values
  const resetForm = () => {
    setTitle("");
    setIssuer("");
    setUrl("");
    setLicenseNumber("");
    setIssueDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setExpiryDate(undefined);
    setDoesExpire(false);
    setHasScore(false);
    setScore(undefined);
    setDescription("");
    setEditId(null);
    setErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
    }
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
        expiryDate,
        doesExpire,
        hasScore,
        score,
        description: description || undefined,
      };

      // Validate form data
      certificateSchema.parse(formData);

      const currentCertificate: Certificate = {
        _id: editId || undefined,
        title,
        issuer,
        url: url || undefined,
        licenseNumber: licenseNumber || undefined,
        issueDate,
        expiryDate,
        doesExpire,
        hasScore,
        score,
        description: description || "",
        createdAt: new Date(),
      };

      if (editId) {
        const newCertificates =
          user?.certificates?.map((cert) =>
            cert._id === currentCertificate._id
              ? { ...currentCertificate, createdAt: cert.createdAt }
              : cert
          ) || [];
        setUser({ ...user, certificates: newCertificates });
        toast.success("Certificate updated successfully");
      } else {
        const newCertificates = [
          ...(user?.certificates || []),
          currentCertificate,
        ];
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
        console.error("Save certificate error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete certificate with confirmation
  const handleDelete = (id: string) => {
    setIsSubmitting(true);
    try {
      const newCertificates =
        user?.certificates?.filter((cert) => cert._id !== id) || [];
      setUser({ ...user, certificates: newCertificates });
      toast.success("Certificate deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the certificate");
      console.error("Delete error:", error);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmId(null);
    }
  };

  // Handle date change
  const handleDateChange = (
    date: ZonedDateTime | null,
    dateType: "issue" | "expiry"
  ) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (dateType === "issue") {
      setIssueDate(dateObj);
      // Clear any relevant errors
      if (errors.issueDate) {
        setErrors((prev) => ({ ...prev, issueDate: "" }));
      }
      if (errors.expiryDate && expiryDate && dateObj < expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: "" }));
      }
    } else {
      setExpiryDate(dateObj);
      // Clear any relevant errors
      if (errors.expiryDate) {
        setErrors((prev) => ({ ...prev, expiryDate: "" }));
      }
    }
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get certificate status badge
  const getCertificateStatus = (cert: Certificate) => {
    if (!cert.doesExpire) {
      return <Chip color="success">No Expiry</Chip>;
    }

    if (!cert.expiryDate) return null;

    const now = new Date();
    const expiry = new Date(cert.expiryDate);

    if (expiry < now) {
      return (
        <Chip color="danger" startContent={<X size={12} />}>
          Expired
        </Chip>
      );
    }

    // Less than 3 months to expiry
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    if (expiry < threeMonthsFromNow) {
      return (
        <Chip color="warning" startContent={<Clock size={12} />}>
          Expires Soon
        </Chip>
      );
    }

    return (
      <Chip color="success" startContent={<Check size={12} />}>
        Active
      </Chip>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Certificates</BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="text-2xl font-semibold mt-4">
          Professional Certificates
        </h1>
        <p className="text-gray-500 mt-1">
          Showcase your certifications, licenses, and credentials
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <FileBadge2 size={20} className="text-primary" />
            <h2 className="text-lg font-medium">Your Certificates</h2>
            {user?.certificates && user.certificates.length > 0 && (
              <Badge variant="flat" className="ml-2">
                {user.certificates.length}
              </Badge>
            )}
          </div>
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
          {isLoading ? (
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ) : !user?.certificates || user.certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="bg-primary-50 p-5 rounded-full mb-5">
                <FileBadge2 size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No certificates added yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Add your professional certifications, licenses, and credentials
                to showcase your qualifications and specialized skills
              </p>
              <Button
                color="primary"
                startContent={<Plus size={16} />}
                onClick={() => handleOpen()}
                size="lg"
              >
                Add Your First Certificate
              </Button>
            </div>
          ) : (
            <Table aria-label="Certificates table" removeWrapper>
              <TableHeader>
                <TableColumn>CERTIFICATE</TableColumn>
                <TableColumn>ISSUER</TableColumn>
                <TableColumn>ISSUE DATE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn width={120}>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {sortedCertificates.map((cert) => (
                  <TableRow key={cert._id}>
                    <TableCell>
                      <div className="font-medium">{cert.title}</div>
                      {cert.licenseNumber && (
                        <div className="text-small text-gray-500 mt-1">
                          ID: {cert.licenseNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(cert.issueDate)}</span>
                        {cert.doesExpire && cert.expiryDate && (
                          <span className="text-small text-gray-500">
                            Expires: {formatDate(cert.expiryDate)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-2 w-fit">
                        {getCertificateStatus(cert)}
                        {cert.hasScore && cert.score !== undefined && (
                          <Tooltip content="Certificate score">
                            <Badge color="primary" variant="flat">
                              <p>Score: {cert.score}%</p>
                            </Badge>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {cert.url && (
                          <Tooltip content="View certificate">
                            <Link
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary"
                            >
                              <ExternalLink size={16} />
                            </Link>
                          </Tooltip>
                        )}
                        <Tooltip content="Edit">
                          <Button
                            isIconOnly
                            variant="light"
                            onClick={() => handleOpen(cert)}
                          >
                            <Edit2 size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" color="danger">
                          <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            onClick={() => setDeleteConfirmId(cert._id || "")}
                            isDisabled={isSubmitting}
                          >
                            <Trash2 size={16} />
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

      {/* Add/Edit Certificate Modal */}
      <Modal
        isDismissable={false}
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
                    Fill in the details of your professional certification or
                    credential
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Certificate Name"
                      placeholder="E.g. AWS Certified Solutions Architect, PMP, etc."
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title) setErrors({ ...errors, title: "" });
                      }}
                      errorMessage={errors.title}
                      isInvalid={!!errors.title}
                      isRequired
                      isDisabled={isSubmitting}
                      startContent={
                        <FileText size={16} className="text-gray-400" />
                      }
                      description="Enter the full name of your certification"
                    />
                  </div>

                  <Input
                    label="Issuing Organization"
                    placeholder="E.g. Microsoft, AWS, PMI, etc."
                    value={issuer}
                    onChange={(e) => {
                      setIssuer(e.target.value);
                      if (errors.issuer) setErrors({ ...errors, issuer: "" });
                    }}
                    errorMessage={errors.issuer}
                    isInvalid={!!errors.issuer}
                    isRequired
                    isDisabled={isSubmitting}
                    description="Organization that issued the certification"
                  />

                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Issue Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Issue Date"
                      className="w-full"
                      granularity="day"
                      maxValue={today(getLocalTimeZone())}
                      value={parseAbsoluteToLocal(issueDate.toISOString())}
                      onChange={(date) => handleDateChange(date, "issue")}
                      errorMessage={errors.issueDate}
                      isInvalid={!!errors.issueDate}
                      isDisabled={isSubmitting}
                      startContent={
                        <Calendar size={16} className="text-gray-400" />
                      }
                    />
                    <p className="text-tiny text-default-500 mt-1">
                      Date when you received the certificate
                    </p>
                  </div>

                  <Input
                    label="License/Credential ID"
                    placeholder="Enter credential identifier (optional)"
                    value={licenseNumber || ""}
                    onChange={(e) => {
                      setLicenseNumber(e.target.value);
                      if (errors.licenseNumber)
                        setErrors({ ...errors, licenseNumber: "" });
                    }}
                    isDisabled={isSubmitting}
                    errorMessage={errors.licenseNumber}
                    isInvalid={!!errors.licenseNumber}
                    description="Unique identifier for your certificate"
                  />

                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Credential URL"
                      placeholder="https://www.example.com/verify/certificate (optional)"
                      value={url || ""}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (errors.url) setErrors({ ...errors, url: "" });
                      }}
                      errorMessage={errors.url}
                      isInvalid={!!errors.url}
                      isDisabled={isSubmitting}
                      startContent={
                        <LinkIcon size={16} className="text-gray-400" />
                      }
                      description="Link where others can verify this credential"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="flex flex-col gap-4 border-1 rounded-lg border-default-200 p-4">
                      <div className="text-small font-medium flex items-center gap-2">
                        <Info size={14} className="text-primary" />
                        Additional Information
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <Checkbox
                            isSelected={doesExpire}
                            onValueChange={(value) => setDoesExpire(value)}
                            isDisabled={isSubmitting}
                          >
                            This certificate has an expiration date
                          </Checkbox>

                          {doesExpire && (
                            <div className="mt-3 ml-7">
                              <label className="block text-small font-medium text-foreground mb-1.5">
                                Expiry Date{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <DatePicker
                                aria-label="Expiry Date"
                                className="w-full"
                                granularity="day"
                                minValue={parseAbsoluteToLocal(
                                  issueDate.toISOString()
                                )}
                                value={
                                  expiryDate
                                    ? parseAbsoluteToLocal(
                                        expiryDate.toISOString()
                                      )
                                    : undefined
                                }
                                onChange={(date) =>
                                  handleDateChange(date, "expiry")
                                }
                                isInvalid={!!errors.expiryDate}
                                errorMessage={errors.expiryDate}
                                isDisabled={isSubmitting}
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <Checkbox
                            isSelected={hasScore}
                            onValueChange={(value) => setHasScore(value)}
                            isDisabled={isSubmitting}
                          >
                            I received a score or percentage
                          </Checkbox>

                          {hasScore && (
                            <div className="mt-3 ml-7">
                              <Input
                                type="number"
                                label="Score (%)"
                                placeholder="E.g. 85"
                                min={0}
                                max={100}
                                value={score?.toString() || ""}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  setScore(isNaN(value) ? undefined : value);
                                  if (errors.score)
                                    setErrors({ ...errors, score: "" });
                                }}
                                errorMessage={errors.score}
                                isInvalid={!!errors.score}
                                endContent={
                                  <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">
                                      %
                                    </span>
                                  </div>
                                }
                                isDisabled={isSubmitting}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      label="Description"
                      placeholder="Brief description of what this certification represents and the skills it validates (optional)"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description)
                          setErrors({ ...errors, description: "" });
                      }}
                      minRows={3}
                      maxRows={5}
                      isDisabled={isSubmitting}
                      errorMessage={errors.description}
                      isInvalid={!!errors.description}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => onClose()}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  {editId ? "Update Certificate" : "Add Certificate"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={!!deleteConfirmId}
        onClose={() => !isSubmitting && setDeleteConfirmId(null)}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 py-2">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this certificate? This
                    action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => setDeleteConfirmId(null)}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (deleteConfirmId) {
                      handleDelete(deleteConfirmId);
                    }
                  }}
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  Delete
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
