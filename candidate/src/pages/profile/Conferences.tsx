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
} from "@nextui-org/react";
import { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import { Plus, Edit2, Trash2, Users, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Candidate, Conference } from "@shared-types/Candidate";
import { useOutletContext } from "react-router-dom";

export default function Conferences() {
  // State for managing current editing item
  const [editingConference, setEditingConference] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof Conference, boolean>>
  >({});

  // Modal states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  const { user, setUser } = useOutletContext<{
    user: Candidate;
    setUser: (user: Candidate) => void;
  }>();

  const handleAdd = () => {
    setEditingConference(null);
    setValidationErrors({});
    setTitle("");
    setOrganizer("");
    setEventLocation("");
    setEventDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setLink("");
    setDescription("");
    onOpen();
  };

  const handleEdit = (conference: Conference) => {
    setEditingConference(conference?._id || null);
    setTitle(conference.title);
    setOrganizer(conference.organizer);
    setEventLocation(conference.eventLocation);
    setEventDate(new Date(conference.eventDate));
    setLink(conference.link || "");
    setDescription(conference.description || "");
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.conferences) return;

    const newConferences = user.conferences.filter((conf) => conf._id !== id);
    setUser({ ...user, conferences: newConferences });
  };

  const validateForm = (): boolean => {
    const errors = {
      title: false,
      organizer: false,
      eventLocation: false,
    };

    if (!title) errors.title = true;
    if (!organizer) errors.organizer = true;
    if (!eventLocation) errors.eventLocation = true;

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleDateChange = (date: ZonedDateTime | null) => {
    if (!date) return;
    const dateObj = new Date(date.year, date.month - 1, date.day);
    setEventDate(dateObj);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    let newConferences: Conference[] = [];

    const preparedData: Conference = {
      title,
      organizer,
      eventLocation,
      eventDate,
      link,
      description,
    };

    if (editingConference) {
      newConferences = (user?.conferences || []).map((conf) =>
        conf._id === editingConference
          ? { ...preparedData, _id: conf._id }
          : {
              ...conf,
            }
      );
    } else {
      const newConf: Conference = {
        ...preparedData,
        eventDate: new Date(preparedData.eventDate),
        createdAt: new Date(),
      };
      newConferences = [...(user?.conferences || []), newConf];
    }
    newConferences.sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );

    setUser({
      ...user,
      conferences: newConferences,
    });

    setEditingConference(null);
    setValidationErrors({});
    closeAndReset();
  };

  const closeAndReset = () => {
    setEditingConference(null);
    setValidationErrors({});
    setTitle("");
    setOrganizer("");
    setEventLocation("");
    setEventDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setLink("");
    setDescription("");
    onClose();
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/conferences">Conferences</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5 flex justify-end items-center">
        {user.conferences && user.conferences.length > 0 && (
          <Button
            variant="flat"
            onClick={handleAdd}
            startContent={<Plus size={18} />}
          >
            Add New
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {!user.conferences?.length ? (
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
              <Users size={50} />
            </motion.div>

            <h3 className="text-xl mt-3">No Conferences Added Yet</h3>
            <p className="text-gray-500">
              Start by adding your first conference!
            </p>
            <Button onClick={handleAdd} startContent={<Plus size={18} />}>
              Add new
            </Button>
          </motion.div>
        ) : (
          <>
            {user.conferences.map((conference) => (
              <Card key={conference._id} className="w-full">
                <CardBody>
                  <div className="flex items-center w-full gap-5">
                    <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center">
                      {conference.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold">
                          {conference.title}
                        </h3>
                        <p className="text-default-500 text-sm">
                          {conference.organizer} |{" "}
                          {new Date(conference.eventDate).toLocaleDateString()}{" "}
                          | {conference.eventLocation}
                        </p>
                        {conference.link && (
                          <p className="text-sm mt-2">
                            <a
                              href={conference.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Conference Link
                            </a>
                          </p>
                        )}
                        <div className="mt-4 whitespace-pre-line">
                          {conference.description}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(conference)}
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() =>
                            conference._id && handleDelete(conference._id)
                          }
                        >
                          <Trash2 size={18} />
                        </Button>
                        <Button isIconOnly variant="light">
                          <Download size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeAndReset} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingConference ? "Edit Conference" : "Add New Conference"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    placeholder="Enter conference title"
                    isRequired
                    isInvalid={validationErrors.title}
                    errorMessage={
                      validationErrors.title ? "Title is required" : ""
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    label="Organizer"
                    placeholder="Enter organizer name"
                    isRequired
                    isInvalid={validationErrors.organizer}
                    errorMessage={
                      validationErrors.organizer ? "Organizer is required" : ""
                    }
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                  />
                  <Input
                    label="Event Location"
                    placeholder="Enter event location"
                    isRequired
                    isInvalid={validationErrors.eventLocation}
                    errorMessage={
                      validationErrors.eventLocation
                        ? "Location is required"
                        : ""
                    }
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  />
                  <DatePicker
                    className="max-w-xs"
                    label="Event Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(eventDate.toISOString())}
                    onChange={handleDateChange}
                  />
                  <Input
                    label="Conference Link (Optional)"
                    placeholder="Enter conference website URL"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="col-span-2"
                  />
                  <p className="text-xs">Time Zone: {getLocalTimeZone()}</p>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Enter conference description"
                  className="mt-4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
    </div>
  );
}
