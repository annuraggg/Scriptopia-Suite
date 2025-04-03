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
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Plus, Pencil, Trash2, Calendar, Trophy, Building } from "lucide-react";
import { toast } from "sonner";
import { Candidate, Competition } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Define validation schema using zod
const CompetitionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title is too long" }),
  position: z.string().min(1, { message: "Position is required" }),
  organizer: z.string().min(1, { message: "Organizer is required" }),
  associatedWith: z.enum(["academic", "personal", "professional"]),
  date: z.date().max(new Date(), { message: "Date cannot be in the future" }),
  description: z.string().optional(),
});

type ValidationErrors = {
  title?: string;
  position?: string;
  organizer?: string;
  date?: string;
  description?: string;
};

const Competitions = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [associatedWith, setAssociatedWith] = useState<
    "academic" | "personal" | "professional"
  >("academic");
  const [date, setDate] = useState(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [description, setDescription] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState<string | null>(
    null
  );

  // Initialize competitions from user data
  useEffect(() => {
    if (user?.competitions) {
      setCompetitions(user.competitions);
    }
  }, [user?.competitions]);

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
      setAssociatedWith(competition.associatedWith);
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
    resetForm();
    setEditingId(null);
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const competitionToSave: Competition = {
        _id: editingId || undefined,
        title,
        position,
        organizer,
        associatedWith,
        date,
        description: description.trim() || "",
      };

      if (editingId) {
        const newCompetitions = competitions.map((comp) =>
          comp._id === editingId ? competitionToSave : comp
        );
        setUser({
          ...user,
          competitions: newCompetitions,
        });
        toast.success("Competition updated successfully");
      } else {
        // Generate a temporary ID for new entries until backend assigns one
        const tempId = `temp-${Date.now()}`;
        const newCompetition = {
          ...competitionToSave,
          _id: tempId,
        };
        const newCompetitions = [...competitions, newCompetition];
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
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setCompetitionToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDelete = () => {
    if (!competitionToDelete) return;

    try {
      const newCompetitions = competitions.filter(
        (comp) => comp._id !== competitionToDelete
      );
      setUser({ ...user, competitions: newCompetitions });
      toast.success("Competition deleted successfully");
    } catch (error) {
      toast.error("An error occurred while deleting the competition");
      console.error(error);
    } finally {
      setDeleteConfirmationOpen(false);
      setCompetitionToDelete(null);
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
  };

  const getAssociationColor = (type: string) => {
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

  return (
    <div className="p-5">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/competitions">
          Competitions
        </BreadcrumbItem>
      </Breadcrumbs>

      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Competitions</h2>
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus size={18} />}
            onClick={() => handleOpen()}
          >
            Add Competition
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          {!competitions || competitions.length === 0 ? (
            <div className="text-center py-10">
              <Trophy size={40} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No competitions added yet</p>
              <p className="text-gray-500 mb-4">
                Add your competition achievements to showcase your skills and
                recognitions
              </p>
              <Button
                color="primary"
                onClick={() => handleOpen()}
                startContent={<Plus size={18} />}
              >
                Add Your First Competition
              </Button>
            </div>
          ) : (
            <Table aria-label="Competitions table">
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>POSITION</TableColumn>
                <TableColumn>ORGANIZER</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {competitions.map((competition) => (
                  <TableRow key={competition._id}>
                    <TableCell>
                      <div className="font-medium">{competition.title}</div>
                      {competition.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {competition.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{competition.position}</TableCell>
                    <TableCell>{competition.organizer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
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
                      <div className="flex gap-2">
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
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-2">
                  <Trophy size={20} />
                  {editingId ? "Edit Competition" : "Add New Competition"}
                </div>
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div className="grid gap-4 py-4">
                  <Input
                    label="Competition Title"
                    placeholder="Enter competition title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    startContent={
                      <Trophy size={16} className="text-gray-400" />
                    }
                  />
                  <Input
                    label="Position"
                    placeholder="E.g. First Place, Runner-up, Finalist"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    isRequired
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                  />
                  <Input
                    label="Organizer"
                    placeholder="Enter organizer name"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    isRequired
                    isInvalid={!!errors.organizer}
                    errorMessage={errors.organizer}
                    startContent={
                      <Building size={16} className="text-gray-400" />
                    }
                  />
                  <Select
                    label="Associated With"
                    placeholder="Select association"
                    selectedKeys={[associatedWith]}
                    onSelectionChange={(keys) => {
                      if (keys.currentKey) {
                        setAssociatedWith(
                          keys.currentKey as
                            | "personal"
                            | "academic"
                            | "professional"
                        );
                      }
                    }}
                    isRequired
                  >
                    <SelectItem key="academic">Academic</SelectItem>
                    <SelectItem key="professional">Professional</SelectItem>
                    <SelectItem key="personal">Personal</SelectItem>
                  </Select>
                  <DatePicker
                    label="Competition Date"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(date.toISOString())}
                    onChange={handleDateChange}
                    isInvalid={!!errors.date}
                    errorMessage={errors.date}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter competition details (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={3}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                  />
                </div>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button variant="flat" onPress={handleClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isLoading}
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
        isOpen={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this competition? This action
                cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => setDeleteConfirmationOpen(false)}
                >
                  Cancel
                </Button>
                <Button color="danger" onPress={handleDelete}>
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
