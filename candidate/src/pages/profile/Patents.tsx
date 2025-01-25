import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { DateInput } from "@nextui-org/date-input";
import { useState } from "react";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { Candidate, Patent } from "@shared-types/Candidate";

const patentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  patentOffice: z.string().min(1, "Patent office is required"),
  patentNumber: z.string().min(1, "Patent number is required"),
  status: z.enum(["pending", "granted", "rejected"]),
  filingDate: z.string(),
  issueDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

const Patents = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };

  const [editingPatent, setEditingPatent] = useState<Patent>({} as Patent);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<Patent>({
    title: "",
    patentOffice: "",
    patentNumber: "",
    status: "pending",
    filingDate: today("IST").toString(),
    issueDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Patent, string>>>({});

  const patentOffices = [
    { label: "USPTO", value: "USPTO" },
    { label: "EPO", value: "EPO" },
    { label: "JPO", value: "JPO" },
  ];

  const patentStatuses = [
    { label: "Pending", value: "pending" },
    { label: "Granted", value: "granted" },
    { label: "Rejected", value: "rejected" },
  ];

  const formatDate = (dateString: string) => {
    try {
      return dateString.split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  const validateField = (name: keyof Patent, value: any) => {
    try {
      if (name === "status" && !["pending", "granted", "rejected"].includes(value)) {
        throw new Error("Invalid status value");
      }
      // @ts-ignore
      patentSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: (error as Error).message }));
      }
      return false;
    }
  };

  const handleInputChange = (name: keyof Patent, value: any) => {
    let processedValue = value;

    if (value instanceof CalendarDate) {
      processedValue = value.toString();
    } else if (typeof value === "string") {
      processedValue = value.trim();
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    validateField(name, processedValue);
  };

  const handleSave = async () => {
    try {
      const dataToValidate = {
        ...formData,
        status: formData.status.toLowerCase() as "pending" | "granted" | "rejected"
      };

      patentSchema.parse(dataToValidate);

      if (editingPatent._id) {
        const newPatents = user?.patents?.map((p) =>
          p._id === editingPatent._id ? { ...dataToValidate, _id: p._id } : p
        );
        setUser({ ...user, patents: newPatents });
      } else {
        const newPatents = [...(user?.patents || []), dataToValidate];
        setUser({ ...user, patents: newPatents });
      }

      handleClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      } else {
        toast.error("Failed to save patent");
      }
    }
  };

  const handleDelete = (id: string) => {
    const newPatents = user?.patents?.filter((p) => p._id !== id);
    setUser({ ...user, patents: newPatents });
  };

  const handleEdit = (patent: Patent) => {
    setEditingPatent(patent);
    setFormData(patent);
    onOpen();
  };

  const handleClose = () => {
    setEditingPatent({} as Patent);
    setFormData({
      title: "",
      patentOffice: "",
      patentNumber: "",
      status: "pending",
      filingDate: today("IST").toString(),
      issueDate: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5"
    >
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/patents">Patents</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end items-center mb-6">
        <Button startContent={<Plus size={18} />} onPress={onOpen}>
          Add New Patent
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>PATENT OFFICE</TableColumn>
          <TableColumn>APPLICATION NUMBER</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>FILING DATE</TableColumn>
          <TableColumn>ISSUE DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {(user.patents || []).map((patent) => (
            <TableRow key={patent._id}>
              <TableCell>{patent.title}</TableCell>
              <TableCell>{patent.patentOffice}</TableCell>
              <TableCell>{patent.patentNumber}</TableCell>
              <TableCell>{patent.status}</TableCell>
              <TableCell>{formatDate(patent.filingDate)}</TableCell>
              <TableCell>{patent.issueDate ? formatDate(patent.issueDate) : "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleEdit(patent)}
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(patent._id || "")}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {editingPatent._id ? "Edit Patent" : "Add New Patent"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    isRequired
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                  />

                  <Select
                    label="Patent Office"
                    selectedKeys={[formData.patentOffice]}
                    onChange={(e) =>
                      handleInputChange("patentOffice", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.patentOffice}
                    errorMessage={errors.patentOffice}
                  >
                    {patentOffices.map((office) => (
                      <SelectItem key={office.value} value={office.value}>
                        {office.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Patent Number"
                    value={formData.patentNumber}
                    onChange={(e) =>
                      handleInputChange("patentNumber", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.patentNumber}
                    errorMessage={errors.patentNumber}
                  />

                  <Select
                    label="Status"
                    selectedKeys={[formData.status]}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value.toLowerCase())
                    }
                    isRequired
                    isInvalid={!!errors.status}
                    errorMessage={errors.status}
                  >
                    {patentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="flex gap-4">
                    <DateInput
                      label="Filing Date"
                      value={parseDate(formData.filingDate)}
                      onChange={(date) => handleInputChange("filingDate", date)}
                      isRequired
                      maxValue={today("IST")}
                    />

                    <DateInput
                      label="Issue Date"
                      value={formData.issueDate ? parseDate(formData.issueDate) : undefined}
                      onChange={(date) => handleInputChange("issueDate", date)}
                      maxValue={today("IST")}
                    />
                  </div>

                  <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    isRequired
                    minRows={3}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleClose}>
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
    </motion.div >
  );
};

export default Patents;