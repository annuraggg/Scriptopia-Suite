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
  CardHeader,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Link,
  Divider,
  Chip,
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
  Edit2,
  Trash2,
  ExternalLink,
  AlertCircle,
  MapPin,
  Calendar,
  Building2,
  Globe,
  Video,
} from "lucide-react";
import { Candidate, Conference } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";
import { z } from "zod";

// Define validation schema with improved validation rules
const conferenceSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  organizer: z
    .string()
    .min(1, "Organizer is required")
    .max(100, "Organizer name is too long"),
  eventLocation: z
    .string()
    .min(1, "Event location is required")
    .max(100, "Location is too long"),
  eventDate: z
    .date({
      required_error: "Event date is required",
      invalid_type_error: "Invalid date format",
    })
    .max(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "Event can't be more than a week in the future"
    ),
  link: z
    .string()
    .url("Please enter a valid URL (include https://)")
    .or(z.string().max(0)),
  description: z.string().max(500, "Description is too long").optional(),
});

type ConferenceFormData = z.infer<typeof conferenceSchema>;
type ValidationErrors = Partial<Record<keyof ConferenceFormData, string>>;

export default function Conferences() {
  // Context and state management
  const { user, setUser, isLoading } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
    isLoading?: boolean;
  }>();

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

  // Sort conferences by date descending
  const sortedConferences = [...(user?.conferences || [])].sort(
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

  const handleCloseModal = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
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
    if (!confirmDelete || !user?.conferences) return;
    setIsSubmitting(true);

    try {
      const newConferences = user.conferences.filter(
        (conf) => conf._id !== confirmDelete
      );
      setUser({ ...user, conferences: newConferences });
      setConfirmDelete(null);
      onDeleteClose();
    } catch (error) {
      console.error("Error deleting conference:", error);
    } finally {
      setIsSubmitting(false);
    }
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
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let newConferences: Conference[] = [];

      const preparedData: Conference = {
        ...formData,
        eventDate: formData.eventDate,
        description: formData.description || "",
        // Only keep link if it's not empty
        link: formData.link || undefined,
      };

      if (editingConference) {
        newConferences = (user?.conferences || []).map((conf) =>
          conf._id === editingConference
            ? { ...preparedData, _id: conf._id, createdAt: conf.createdAt }
            : conf
        );
      } else {
        const newConf: Conference = {
          ...preparedData,
          createdAt: new Date(),
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

  // Check if conference is upcoming
  const isUpcoming = (date: Date | string): boolean => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Get location icon based on the event location text
  const getLocationIcon = (location: string) => {
    const locationLower = location.toLowerCase();
    if (
      locationLower.includes("virtual") ||
      locationLower.includes("online") ||
      locationLower.includes("zoom") ||
      locationLower.includes("remote") ||
      locationLower.includes("web")
    ) {
      return <Video size={16} className="text-success" />;
    } else {
      return <MapPin size={16} className="text-primary" />;
    }
  };

  // Get avatar for the conference card
  const getConferenceAvatar = (conference: Conference) => {
    const title = conference.title;
    const locationLower = conference.eventLocation.toLowerCase();

    // Check if online/virtual event
    const isVirtual =
      locationLower.includes("virtual") ||
      locationLower.includes("online") ||
      locationLower.includes("zoom") ||
      locationLower.includes("remote") ||
      locationLower.includes("web");

    return (
      <Avatar
        name={title.charAt(0).toUpperCase()}
        radius="lg"
        color={isVirtual ? "success" : "primary"}
        classNames={{
          base: isVirtual ? "bg-success-100" : "bg-primary-100",
          name: isVirtual
            ? "text-success-600 font-semibold"
            : "text-primary-600 font-semibold",
        }}
        icon={isVirtual ? <Video size={16} /> : undefined}
      />
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Conferences & Events</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Conferences & Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track the conferences, seminars, and events you've attended or
            participated in
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onClick={handleAdd}
        >
          Add Conference
        </Button>
      </div>
      {isLoading ? (
        // Skeleton loader for loading state
        <div className="space-y-4">
          <Card>
            <CardBody className="p-0">
              <div className="p-4">
                <Skeleton className="rounded-lg h-8 w-3/5 mb-3" />
                <Skeleton className="rounded-lg h-4 w-4/5 mb-2" />
                <Skeleton className="rounded-lg h-4 w-2/5" />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-0">
              <div className="p-4">
                <Skeleton className="rounded-lg h-8 w-2/5 mb-3" />
                <Skeleton className="rounded-lg h-4 w-3/5 mb-2" />
                <Skeleton className="rounded-lg h-4 w-1/3" />
              </div>
            </CardBody>
          </Card>
        </div>
      ) : !user?.conferences?.length ? (
        <Card className="w-full border-dashed bg-default-50 border-2 border-gray-200">
          <CardBody className="py-12">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div className="p-5 bg-primary-50 rounded-full">
                <Globe size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium">No Conferences Added</h3>
                <p className="text-default-500 mt-1 max-w-md mx-auto">
                  Add conferences, seminars, and events you've attended or
                  presented at to showcase your professional engagement and
                  industry connections.
                </p>
                <Button
                  color="primary"
                  className="mt-6"
                  onClick={handleAdd}
                  startContent={<Plus size={16} />}
                  size="lg"
                >
                  Add Your First Conference
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="flex justify-between items-center bg-gray-50/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-primary" />
              <h2 className="text-lg font-medium">Your Conferences & Events</h2>
              <Chip variant="flat">{user.conferences.length}</Chip>
            </div>
          </CardHeader>
          <Divider />
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
                      {getConferenceAvatar(conference)}
                      <div>
                        <p className="font-medium">{conference.title}</p>
                        {conference.description && (
                          <p className="text-default-500 text-sm line-clamp-1 mt-1">
                            {conference.description}
                          </p>
                        )}
                        {isUpcoming(conference.eventDate) && (
                          <Chip color="success" variant="flat" className="mt-1">
                            Upcoming
                          </Chip>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      <span>{conference.organizer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{formatDate(conference.eventDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLocationIcon(conference.eventLocation)}
                      <span>{conference.eventLocation}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Tooltip content="Edit">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(conference)}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete" color="danger">
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onClick={() =>
                            conference._id && initiateDelete(conference._id)
                          }
                          isDisabled={isSubmitting}
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
        </Card>
      )}
      {/* Add/Edit Modal */}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-primary" />
                  <h2 className="text-lg">
                    {editingConference
                      ? "Edit Conference"
                      : "Add New Conference"}
                  </h2>
                </div>
                <p className="text-sm text-default-500">
                  {editingConference
                    ? "Update conference details below"
                    : "Enter details about a conference or professional event you attended"}
                </p>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Conference Title"
                    placeholder="E.g. International AI Conference 2024"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isInvalid={!!validationErrors.title}
                    errorMessage={validationErrors.title}
                    isRequired
                    isDisabled={isSubmitting}
                    startContent={<Globe size={16} className="text-gray-400" />}
                    description="Name of the conference or event"
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
                    isDisabled={isSubmitting}
                    startContent={
                      <Building2 size={16} className="text-gray-400" />
                    }
                    description="Institution/organization that hosted the event"
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
                    isDisabled={isSubmitting}
                    labelPlacement="outside"
                    startContent={
                      <MapPin size={16} className="text-gray-400" />
                    }
                    description="Physical location or mention if it was virtual"
                  />
                  <div>
                    <label className="block text-small font-medium text-foreground mb-1.5">
                      Event Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      aria-label="Event Date"
                      value={parseAbsoluteToLocal(
                        formData.eventDate.toISOString()
                      )}
                      onChange={handleDateChange}
                      isInvalid={!!validationErrors.eventDate}
                      isDisabled={isSubmitting}
                    />
                    {validationErrors.eventDate && (
                      <p className="text-danger text-xs mt-1">
                        {validationErrors.eventDate}
                      </p>
                    )}
                    <p className="text-tiny text-default-500 mt-1">
                      Date when the event was held
                    </p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Conference Link (Optional)"
                      placeholder="https://conference-website.com"
                      value={formData.link || ""}
                      onChange={(e) =>
                        handleInputChange("link", e.target.value)
                      }
                      isInvalid={!!validationErrors.link}
                      errorMessage={validationErrors.link}
                      startContent={
                        <ExternalLink size={16} className="text-gray-400" />
                      }
                      isDisabled={isSubmitting}
                      description="URL to conference website or your presentation"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      label="Description (Optional)"
                      placeholder="Provide a brief description of the conference and your participation"
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      minRows={3}
                      maxRows={5}
                      isDisabled={isSubmitting}
                      description="Details about the conference and your role/participation"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button
                  variant="flat"
                  onPress={handleCloseModal}
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
                  {editingConference ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isDismissable={false}
        isOpen={isDeleteOpen}
        onClose={() => !isSubmitting && onDeleteClose()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 py-2">
                  <div className="rounded-full bg-danger/10 p-2 flex-shrink-0">
                    <AlertCircle size={22} className="text-danger" />
                  </div>
                  <p className="text-gray-600">
                    Are you sure you want to delete this conference record? This
                    action cannot be undone.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onDeleteClose}
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
}
