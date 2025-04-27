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
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Skeleton,
} from "@heroui/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Trophy,
  Building,
  AlertCircle,
  Award,
  Medal,
} from "lucide-react";
import { toast } from "sonner";
import { Candidate, Competition } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Define competition types for better type safety
const competitionTypes = ["academic", "personal", "professional"] as const;
type CompetitionType = (typeof competitionTypes)[number];

// Define validation schema using zod
const CompetitionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title is too long" }),
  position: z
    .string()
    .min(1, { message: "Position/achievement is required" })
    .max(100, { message: "Position is too long" }),
  organizer: z
    .string()
    .min(1, { message: "Organizer is required" })
    .max(100, { message: "Organizer name is too long" }),
  associatedWith: z.enum(["academic", "personal", "professional"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  date: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" })
    .refine((date) => date >= new Date("1950-01-01"), {
      message: "Date is too far in the past",
    }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),
});

type ValidationErrors = {
  title?: string;
  position?: string;
  organizer?: string;
  associatedWith?: string;
  date?: string;
  description?: string;
};

const Competitions = () => {
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort competitions by date (most recent first)
  const sortedCompetitions = [...(user?.competitions || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [associatedWith, setAssociatedWith] =
    useState<CompetitionType>("academic");
  const [date, setDate] = useState(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [description, setDescription] = useState("");

  // Delete confirmation modal state
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState<string | null>(
    null
  );

  const validateForm = (): boolean => {
    try {
      CompetitionSchema.parse({
        title,
        position,
        organizer,
        associatedWith,
        date,
        description,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ValidationErrors;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleOpen = (competition?: Competition) => {
    if (competition) {
      setTitle(competition.title);
      setPosition(competition.position);
      setOrganizer(competition.organizer);
      setAssociatedWith(competition.associatedWith as CompetitionType);
      setDate(new Date(competition.date));
      setDescription(competition.description || "");
      setEditingId(competition._id || null);
    } else {
      resetForm();
      setEditingId(null);
    }
    onOpen();
  };

  const resetForm = () => {
    setTitle("");
    setPosition("");
    setOrganizer("");
    setAssociatedWith("academic");
    setDate(new Date());
    setDescription("");
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      setEditingId(null);
      onClose();
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const competitionToSave: Competition = {
        _id: editingId || undefined,
        title,
        position,
        organizer,
        associatedWith,
        date,
        description: description.trim() || "",
        createdAt: new Date(),
      };

      if (editingId) {
        const newCompetitions = (user?.competitions || []).map((comp) =>
          comp._id === editingId
            ? { ...competitionToSave, createdAt: comp.createdAt }
            : comp
        );

        setUser({
          ...user,
          competitions: newCompetitions,
        });
        toast.success("Competition updated successfully");
      } else {
        const newCompetitions = [
          ...(user?.competitions || []),
          competitionToSave,
        ];
        setUser({
          ...user,
          competitions: newCompetitions,
        });
        toast.success("Competition added successfully");
      }
      handleClose();
    } catch (error) {
      toast.error("An error occurred while saving the competition");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setCompetitionToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = () => {
    if (!competitionToDelete) return;
    setIsSubmitting(true);

    try {
      const newCompetitions = (user?.competitions || []).filter(
        (comp) => comp._id !== competitionToDelete
      );
      setUser({ ...user, competitions: newCompetitions });
      toast.success("Competition deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the competition");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmationOpen(false);
      setCompetitionToDelete(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "position":
        setPosition(value);
        break;
      case "organizer":
        setOrganizer(value);
        break;
      case "description":
        setDescription(value);
        break;
    }

    // Clear error if exists
    if (errors[field as keyof ValidationErrors]) {
      const newErrors = { ...errors };
      delete newErrors[field as keyof ValidationErrors];
      setErrors(newErrors);
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setDate(dateObj);

    // Clear date error if exists
    if (errors.date) {
      const newErrors = { ...errors };
      delete newErrors.date;
      setErrors(newErrors);
    }
  };

  const getAssociationColor = (
    type: string
  ): "primary" | "success" | "warning" | "default" => {
    switch (type) {
      case "academic":
        return "primary";
      case "professional":
        return "success";
      case "personal":
        return "warning";
      default:
        return "default";
    }
  };

  const getAssociationLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPositionIcon = (position: string) => {
    const lowerPosition = position.toLowerCase();
    if (
      lowerPosition.includes("first") ||
      lowerPosition.includes("winner") ||
      lowerPosition.includes("gold") ||
      lowerPosition.includes("1st")
    ) {
      return <Medal className="text-amber-500" size={16} />;
    } else if (
      lowerPosition.includes("second") ||
      lowerPosition.includes("runner") ||
      lowerPosition.includes("silver") ||
      lowerPosition.includes("2nd")
    ) {
      return <Medal className="text-gray-400" size={16} />;
    } else if (
      lowerPosition.includes("third") ||
      lowerPosition.includes("bronze") ||
      lowerPosition.includes("3rd")
    ) {
      return <Medal className="text-amber-700" size={16} />;
    }
    return <Award size={16} />;
  };

  return (
    <div>
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/competitions">
          Competitions
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Competition Achievements</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track competitions you've participated in and your achievements
          </p>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Plus size={18} />}
          onClick={() => handleOpen()}
        >
          Add Competition
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-primary" />
            <h2 className="text-lg font-medium">Your Competitions</h2>
            {user?.competitions && user.competitions.length > 0 && (
              <Badge variant="flat" className="ml-2">
                {user.competitions.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2 mb-4">
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                  <Skeleton className="h-5 w-1/2 rounded-lg" />
                </div>
              ))}
            </div>
          ) : !user?.competitions || user.competitions.length === 0 ? (
            <div className="text-center py-14 px-6">
              <div className="bg-primary/10 p-5 rounded-full inline-block mb-6">
                <Trophy size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">
                No competitions added yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add your competition achievements to showcase your skills,
                accomplishments and recognition in various fields
              </p>
              <Button
                color="primary"
                onClick={() => handleOpen()}
                startContent={<Plus size={18} />}
                size="lg"
              >
                Add Your First Competition
              </Button>
            </div>
          ) : (
            <Table
              aria-label="Competitions table"
              removeWrapper
              className="border-none"
            >
              <TableHeader>
                <TableColumn>COMPETITION</TableColumn>
                <TableColumn>POSITION</TableColumn>
                <TableColumn>ORGANIZER</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn width={120} className="text-right">
                  ACTIONS
                </TableColumn>
              </TableHeader>
              <TableBody>
                {sortedCompetitions.map((competition) => (
                  <TableRow
                    key={competition._id}
                    className="border-b last:border-0"
                  >
                    <TableCell>
                      <div className="font-medium">{competition.title}</div>
                      {competition.description && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {competition.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPositionIcon(competition.position)}
                        <span>{competition.position}</span>
                      </div>
                    </TableCell>
                    <TableCell>{competition.organizer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(competition.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getAssociationColor(competition.associatedWith)}
                        variant="flat"
                      >
                        {getAssociationLabel(competition.associatedWith)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip content="Edit">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleOpen(competition)}
                          >
                            <Pencil size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => confirmDelete(competition._id || "")}
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

      {/* Add/Edit Competition Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Trophy size={20} className="text-primary" />
                  {editingId ? "Edit Competition" : "Add New Competition"}
                </div>
                <p className="text-small text-gray-500">
                  {editingId
                    ? "Update details about your competition achievements"
                    : "Share details about competitions you've participated in"}
                </p>
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div className="grid gap-4 py-4">
                  <Input
                    label="Competition Title"
                    placeholder="E.g. National Science Olympiad, Chess Tournament"
                    value={title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    startContent={
                      <Trophy size={16} className="text-gray-400" />
                    }
                    isDisabled={isSubmitting}
                    description="Name of the competition or contest"
                  />

                  <Input
                    label="Position/Achievement"
                    placeholder="E.g. First Place, Runner-up, Finalist, Gold Medal"
                    value={position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                    startContent={<Award size={16} className="text-gray-400" />}
                    isDisabled={isSubmitting}
                    description="Your rank, position or achievement in this competition"
                  />

                  <Input
                    label="Organizing Institution"
                    placeholder="E.g. University of California, IEEE"
                    value={organizer}
                    onChange={(e) =>
                      handleInputChange("organizer", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.organizer}
                    errorMessage={errors.organizer}
                    startContent={
                      <Building size={16} className="text-gray-400" />
                    }
                    isDisabled={isSubmitting}
                    description="Organization that conducted the competition"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Category"
                      placeholder="Select category"
                      selectedKeys={[associatedWith]}
                      className="mt-5"
                      onSelectionChange={(keys) => {
                        if (
                          Array.from(keys).includes("academic") ||
                          Array.from(keys).includes("professional") ||
                          Array.from(keys).includes("personal")
                        ) {
                          setAssociatedWith(
                            Array.from(keys)[0] as CompetitionType
                          );

                          // Clear association error if exists
                          if (errors.associatedWith) {
                            const newErrors = { ...errors };
                            delete newErrors.associatedWith;
                            setErrors(newErrors);
                          }
                        }
                      }}
                      isRequired
                      isInvalid={!!errors.associatedWith}
                      errorMessage={errors.associatedWith}
                      isDisabled={isSubmitting}
                      description="Type of competition"
                    >
                      <SelectItem key="academic">Academic</SelectItem>
                      <SelectItem key="professional">Professional</SelectItem>
                      <SelectItem key="personal">Personal</SelectItem>
                    </Select>

                    <div>
                      <label className="block text-small font-medium text-foreground mb-1.5">
                        Competition Date <span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        aria-label="Competition Date"
                        granularity="day"
                        maxValue={today(getLocalTimeZone())}
                        value={parseAbsoluteToLocal(date.toISOString())}
                        onChange={handleDateChange}
                        isInvalid={!!errors.date}
                        errorMessage={errors.date}
                        isDisabled={isSubmitting}
                      />
                      <p className="text-tiny text-default-500 mt-1">
                        Date when you participated in the competition
                      </p>
                    </div>
                  </div>

                  <Textarea
                    label="Description"
                    placeholder="Briefly describe the competition and your experience (optional)"
                    value={description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    minRows={3}
                    maxRows={5}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    isDisabled={isSubmitting}
                    description="Additional details about the competition or your achievement"
                  />
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={handleClose}
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
                  {editingId ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={deleteConfirmationOpen}
        onClose={() => !isSubmitting && setDeleteConfirmationOpen(false)}
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 py-2">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this competition record?
                    This action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => setDeleteConfirmationOpen(false)}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
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

export default Competitions;
