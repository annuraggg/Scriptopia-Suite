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
  DatePicker,
  Card,
  CardBody,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Link,
} from "@nextui-org/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Plus, Edit2, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { Candidate, Conference } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Define validation schema
const conferenceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organizer: z.string().min(1, "Organizer is required"),
  eventLocation: z.string().min(1, "Event location is required"),
  eventDate: z.date({
    required_error: "Event date is required",
    invalid_type_error: "Invalid date format",
  }),
  link: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional(),
});

type ConferenceFormData = z.infer<typeof conferenceSchema>;
type ValidationErrors = Partial<Record<keyof ConferenceFormData, string>>;

export default function Conferences() {
  // State for managing current editing item
  const [editingConference, setEditingConference] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState<ConferenceFormData>({
    title: "",
    organizer: "",
    eventLocation: "",
    eventDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
    link: "",
    description: "",
  });

  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  // Sort conferences by date descending
  const sortedConferences = [...(user.conferences || [])].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  // Handler for form input changes
  const handleInputChange = (field: keyof ConferenceFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear validation error for the field that was just updated
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: undefined,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      organizer: "",
      eventLocation: "",
      eventDate: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      link: "",
      description: "",
    });
    setValidationErrors({});
    setEditingConference(null);
  };

  const handleAdd = () => {
    resetForm();
    onOpen();
  };

  const handleEdit = (conference: Conference) => {
    setEditingConference(conference?._id || null);
    setFormData({
      title: conference.title,
      organizer: conference.organizer,
      eventLocation: conference.eventLocation,
      eventDate: new Date(conference.eventDate),
      link: conference.link || "",
      description: conference.description || "",
    });
    setValidationErrors({});
    onOpen();
  };

  const initiateDelete = (id: string) => {
    setConfirmDelete(id);
    onDeleteOpen();
  };

  const handleDelete = () => {
    if (!confirmDelete || !user.conferences) return;

    const newConferences = user.conferences.filter(
      (conf) => conf._id !== confirmDelete
    );
    setUser({ ...user, conferences: newConferences });
    setConfirmDelete(null);
    onDeleteClose();
  };

  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    handleInputChange("eventDate", dateObj);
  };

  const validateForm = (): boolean => {
    try {
      conferenceSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ConferenceFormData;
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSave = () => {
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      let newConferences: Conference[] = [];

      const preparedData: Conference = {
        ...formData,
        eventDate: formData.eventDate,
        description: formData.description || "", 
      };

      if (editingConference) {
        newConferences = (user?.conferences || []).map((conf) =>
          conf._id === editingConference
            ? { ...preparedData, _id: conf._id }
            : conf
        );
      } else {
        const newConf: Conference = {
          ...preparedData,
          eventDate: formData.eventDate,
          createdAt: new Date(),
          _id: Date.now().toString(), // Generate a temporary ID
        };
        newConferences = [...(user?.conferences || []), newConf];
      }

      // Sort by date descending
      newConferences.sort(
        (a, b) =>
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      );

      setUser({
        ...user,
        conferences: newConferences,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving conference:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Breadcrumbs size="sm">
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Conferences</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Conferences and Events</h1>
        <Button
          color="primary"
          variant="flat"
          startContent={<Plus size={16} />}
          onClick={handleAdd}
        >
          Add Conference
        </Button>
      </div>

      {!sortedConferences.length ? (
        <Card className="w-full border-dashed bg-default-50">
          <CardBody className="py-8">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 bg-default-100 rounded-full">
                <AlertCircle size={32} className="text-default-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium">No Conferences Added</h3>
                <p className="text-default-500 mt-1">
                  Add conferences and events you've participated in to showcase
                  your professional engagement.
                </p>
                <Button
                  color="primary"
                  className="mt-4"
                  onClick={handleAdd}
                  startContent={<Plus size={16} />}
                >
                  Add Your First Conference
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Table
          aria-label="Conferences and events"
          removeWrapper
          classNames={{
            wrapper: "shadow-none",
          }}
        >
          <TableHeader>
            <TableColumn>CONFERENCE</TableColumn>
            <TableColumn>ORGANIZER</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn width={120}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {sortedConferences.map((conference) => (
              <TableRow key={conference._id} className="border-b">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={conference.title.charAt(0).toUpperCase()}
                      size="sm"
                      radius="lg"
                      color="primary"
                      classNames={{
                        base: "bg-primary-100",
                        name: "text-primary-600 font-semibold",
                      }}
                    />
                    <div>
                      <p className="font-medium">{conference.title}</p>
                      {conference.description && (
                        <p className="text-default-500 text-sm line-clamp-1 mt-1">
                          {conference.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{conference.organizer}</TableCell>
                <TableCell>{formatDate(conference.eventDate)}</TableCell>
                <TableCell>{conference.eventLocation}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Tooltip content="Edit">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleEdit(conference)}
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
                        onClick={() =>
                          conference._id && initiateDelete(conference._id)
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                    {conference.link && (
                      <Tooltip content="Visit conference website">
                        <Button
                          as={Link}
                          href={conference.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                        >
                          <ExternalLink size={16} />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2>
                  {editingConference ? "Edit Conference" : "Add New Conference"}
                </h2>
                <p className="text-sm text-default-500">
                  {editingConference
                    ? "Update conference details below"
                    : "Enter conference details to add to your profile"}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Conference Title"
                    placeholder="Enter conference title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isInvalid={!!validationErrors.title}
                    errorMessage={validationErrors.title}
                    isRequired
                  />
                  <Input
                    label="Organizer"
                    placeholder="Organization that hosted the conference"
                    value={formData.organizer}
                    onChange={(e) =>
                      handleInputChange("organizer", e.target.value)
                    }
                    isInvalid={!!validationErrors.organizer}
                    errorMessage={validationErrors.organizer}
                    isRequired
                  />
                  <Input
                    label="Event Location"
                    placeholder="City, Country or Virtual"
                    value={formData.eventLocation}
                    onChange={(e) =>
                      handleInputChange("eventLocation", e.target.value)
                    }
                    isInvalid={!!validationErrors.eventLocation}
                    errorMessage={validationErrors.eventLocation}
                    isRequired
                  />
                  <DatePicker
                    label="Event Date"
                    value={parseAbsoluteToLocal(
                      formData.eventDate.toISOString()
                    )}
                    onChange={handleDateChange}
                    isInvalid={!!validationErrors.eventDate}
                    errorMessage={validationErrors.eventDate}
                  />
                  <Input
                    className="col-span-1 md:col-span-2"
                    label="Conference Link (Optional)"
                    placeholder="https://conference-website.com"
                    value={formData.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    isInvalid={!!validationErrors.link}
                    errorMessage={validationErrors.link}
                    startContent={
                      <ExternalLink size={16} className="text-default-400" />
                    }
                  />
                </div>
                <Textarea
                  label="Description (Optional)"
                  placeholder="Provide a brief description of the conference and your participation"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="mt-4"
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSubmitting}
                >
                  {editingConference ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Confirm Deletion</h3>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this conference? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
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
}
