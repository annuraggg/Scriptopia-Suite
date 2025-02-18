import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Checkbox,
  Textarea,
  useDisclosure,
  Card,
  CardBody,
  DatePicker,
} from "@nextui-org/react";
import { useState } from "react";
import { Edit2, Trash2, Earth, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  today,
  ZonedDateTime,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useOutletContext } from "react-router-dom";

// Interface matching the backend schema
interface Volunteer {
  _id?: string;
  organization: string;
  role: string;
  cause: string;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  description: string;
  createdAt?: string;
}

// User context interface
interface UserContext {
  user: {
    volunteering?: Volunteer[];
  };
  setUser: (user: any) => void;
}

const causes = [
  "Education",
  "Healthcare",
  "Environment",
  "Animal Welfare",
  "Community Development",
  "Arts & Culture",
  "Social Justice",
  "Disaster Relief",
] as const;

const Volunteering = () => {
  const [editingExperience, setEditingExperience] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof Volunteer, boolean>>
  >({});

  // Modal States
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [cause, setCause] = useState("");
  const [startDate, setStartDate] = useState<Date>(
    today(getLocalTimeZone()).toDate(getLocalTimeZone())
  );
  const [current, setCurrent] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");

  const { user, setUser } = useOutletContext<UserContext>();

  const handleAdd = () => {
    setEditingExperience(null);
    setValidationErrors({});
    setOrganization("");
    setRole("");
    setCause("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setEndDate(undefined);
    setDescription("");
    onOpen();
  };

  const handleEdit = (experience: Volunteer) => {
    setEditingExperience(experience?._id || null);
    setOrganization(experience.organization);
    setRole(experience.role);
    setCause(experience.cause);
    setStartDate(new Date(experience.startDate));
    setCurrent(experience.current);
    setEndDate(experience.endDate ? new Date(experience.endDate) : undefined);
    setDescription(experience.description || "");
    setValidationErrors({});
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (!user.volunteering) return;

    try {
      const newVolunteering = user.volunteering.filter((exp) => exp._id !== id);
      setUser({ ...user, volunteering: newVolunteering });
      toast.success("Volunteer experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete volunteer experience");
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      organization: false,
      role: false,
      cause: false,
    };

    if (!organization) errors.organization = true;
    if (!role) errors.role = true;
    if (!cause) errors.cause = true;

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleDateChange = (
    date: ZonedDateTime | null,
    field: "startDate" | "endDate"
  ) => {
    if (!date) return;

    const dateObj = new Date(date.year, date.month - 1, date.day);

    if (field === "startDate") {
      setStartDate(dateObj);
    } else {
      setEndDate(dateObj);
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please check the form for errors");
      return;
    }

    try {
      let newVolunteering: Volunteer[] = [];

      const preparedData: Volunteer = {
        organization,
        role,
        cause,
        startDate,
        current,
        endDate,
        description,
      };

      if (editingExperience) {
        newVolunteering = (user?.volunteering || []).map((exp) =>
          exp._id === editingExperience
            ? { ...preparedData, _id: exp._id }
            : { ...exp }
        );
        toast.success("Volunteer experience updated successfully");
      } else {
        const newExp: Volunteer = {
          ...preparedData,
          startDate: new Date(preparedData.startDate),
          endDate: preparedData.endDate
            ? new Date(preparedData.endDate)
            : undefined,
          createdAt: new Date().toISOString(),
          _id: Date.now().toString(), // Temporary ID until we get one from API
        };
        newVolunteering = [...(user?.volunteering || []), newExp];
        toast.success("Volunteer experience added successfully");
      }

      // Sort by most recent
      newVolunteering.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setUser({
        ...user,
        volunteering: newVolunteering,
      });

      setEditingExperience(null);
      setValidationErrors({});
      onClose();
    } catch (error) {
      toast.error("Failed to save volunteer experience");
    }
  };

  const closeAndReset = () => {
    setEditingExperience(null);
    setValidationErrors({});
    setOrganization("");
    setRole("");
    setCause("");
    setStartDate(today(getLocalTimeZone()).toDate(getLocalTimeZone()));
    setCurrent(false);
    setEndDate(undefined);
    setDescription("");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <div className="py-5 flex justify-end items-center">
        {user.volunteering && user.volunteering.length > 0 && (
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
        {!user.volunteering?.length ? (
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
              <Earth size={50} />
            </motion.div>

            <h3 className="text-xl mt-3">No Volunteering Added Yet</h3>
            <p className="text-gray-500">
              Start by adding your first volunteering experience!
            </p>
            <Button onClick={handleAdd} startContent={<Plus size={18} />}>
              Add new
            </Button>
          </motion.div>
        ) : (
          <>
            {user.volunteering.map((experience) => (
              <Card key={experience._id} className="w-full">
                <CardBody>
                  <div className="flex items-center w-full gap-5">
                    <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center">
                      {experience.organization.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-start justify-between w-full">
                      <div className="w-full">
                        <h3 className="text-lg font-semibold">
                          {experience.role}
                        </h3>
                        <p className="text-default-500 text-sm">
                          {experience.organization} |{" "}
                          {new Date(experience.startDate).toLocaleDateString()}{" "}
                          -{" "}
                          {experience.current
                            ? "Present"
                            : experience.endDate
                            ? new Date(experience.endDate).toLocaleDateString()
                            : ""}{" "}
                          | {experience.cause}
                        </p>
                        <div className="mt-4 whitespace-pre-line">
                          {experience.description}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          onClick={() => handleEdit(experience)}
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          onClick={() =>
                            experience._id && handleDelete(experience._id)
                          }
                        >
                          <Trash2 size={18} />
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
                {editingExperience ? "Edit" : "Add New"} Volunteer Experience
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Organization Name"
                    placeholder="Enter Organization Name"
                    isRequired
                    isInvalid={validationErrors.organization}
                    errorMessage={
                      validationErrors.organization
                        ? "Organization name is required"
                        : ""
                    }
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                  <Input
                    label="Your Role"
                    placeholder="Enter Your Role"
                    isRequired
                    isInvalid={validationErrors.role}
                    errorMessage={
                      validationErrors.role ? "Role is required" : ""
                    }
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Select
                    label="Select Cause"
                    placeholder="Select Cause"
                    selectedKeys={cause ? [cause] : []}
                    isRequired
                    isInvalid={validationErrors.cause}
                    errorMessage={
                      validationErrors.cause ? "Cause is required" : ""
                    }
                    onSelectionChange={(e) => setCause(e.currentKey as string)}
                  >
                    {causes.map((cause) => (
                      <SelectItem key={cause} value={cause}>
                        {cause}
                      </SelectItem>
                    ))}
                  </Select>
                  <div></div>
                  <DatePicker
                    className="max-w-xs"
                    label="Start Date (mm/dd/yyyy)"
                    granularity="day"
                    maxValue={today(getLocalTimeZone())}
                    value={parseAbsoluteToLocal(startDate.toISOString())}
                    onChange={(date) => handleDateChange(date, "startDate")}
                  />
                  <DatePicker
                    className="max-w-xs"
                    label="End Date (mm/dd/yyyy)"
                    granularity="day"
                    value={
                      endDate
                        ? parseAbsoluteToLocal(endDate.toISOString())
                        : undefined
                    }
                    onChange={(date) => handleDateChange(date, "endDate")}
                    maxValue={today(getLocalTimeZone())}
                    isDisabled={current}
                  />
                  <p className="text-xs">Time Zone: {getLocalTimeZone()}</p>
                  <div className="col-span-2">
                    <Checkbox
                      checked={current}
                      onChange={(e) => {
                        setCurrent(e.target.checked);
                        if (e.target.checked) {
                          setEndDate(undefined);
                        }
                      }}
                    >
                      I am currently volunteering with this organization
                    </Checkbox>
                  </div>
                </div>
                <Textarea
                  label="Description"
                  placeholder="Enter description of your volunteer work"
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
    </motion.div>
  );
};

export default Volunteering;
