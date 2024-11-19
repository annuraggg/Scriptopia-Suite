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

// Types and Interfaces
interface Patent {
  id: string;
  title: string;
  patentOffice: string;
  applicationNumber: string;
  status: string;
  filingDate: CalendarDate;
  issueDate: CalendarDate | null;
  description: string;
}

// Validation Schema
const patentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  patentOffice: z.string().min(1, "Patent office is required"),
  applicationNumber: z.string().min(1, "Application number is required"),
  status: z.string().min(1, "Status is required"),
  filingDate: z.instanceof(CalendarDate),
  issueDate: z.instanceof(CalendarDate).nullable(),
  description: z.string().optional(),
});

const Patents = () => {
  // States
  const [patents, setPatents] = useState<Patent[]>([]);
  const [editingPatent, setEditingPatent] = useState<Patent | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<Omit<Patent, "id">>({
    title: "",
    patentOffice: "",
    applicationNumber: "",
    status: "",
    filingDate: parseDate(today("IST").toString()),
    issueDate: null,
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Patent, string>>>(
    {}
  );

  // Sample data
  // useEffect(() => {
  //   setPatents([
  //     {
  //       id: "1",
  //       title: "Sample Patent",
  //       patentOffice: "USPTO",
  //       applicationNumber: "US123456",
  //       status: "Pending",
  //       filingDate: parseDate("2023-01-01"),
  //       issueDate: parseDate("2024-01-01"),
  //       description: "Sample patent description",
  //     },
  //   ]);
  // }, []);

  const patentOffices = [
    { label: "USPTO", value: "USPTO" },
    { label: "EPO", value: "EPO" },
    { label: "JPO", value: "JPO" },
  ];

  const patentStatuses = [
    { label: "Pending", value: "Pending" },
    { label: "Granted", value: "Granted" },
    { label: "Rejected", value: "Rejected" },
  ];

  const validateField = (name: keyof typeof formData, value: any) => {
    try {
      patentSchema.shape[name].parse(value);
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

  const handleInputChange = (
    name: keyof typeof formData,
    value: string | CalendarDate | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (typeof value === "string") {
      validateField(name, value);
    }
  };

  const handleSave = async () => {
    try {
      patentSchema.parse(formData);

      if (editingPatent) {
        // Update existing patent
        setPatents((prev) =>
          prev.map((p) =>
            p.id === editingPatent.id ? { ...formData, id: p.id } : p
          )
        );
        toast.success("Patent updated successfully");
      } else {
        // Add new patent
        setPatents((prev) => [
          ...prev,
          { ...formData, id: Math.random().toString() },
        ]);
        toast.success("Patent added successfully");
      }

      handleClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      }
    }
  };

  const handleDelete = (id: string) => {
    setPatents((prev) => prev.filter((p) => p.id !== id));
    toast.success("Patent deleted successfully");
  };

  const handleEdit = (patent: Patent) => {
    setEditingPatent(patent);
    setFormData({
      title: patent.title,
      patentOffice: patent.patentOffice,
      applicationNumber: patent.applicationNumber,
      status: patent.status,
      filingDate: patent.filingDate,
      issueDate: patent.issueDate,
      description: patent.description,
    });
    onOpen();
  };

  const handleClose = () => {
    setEditingPatent(null);
    setFormData({
      title: "",
      patentOffice: "",
      applicationNumber: "",
      status: "",
      filingDate: parseDate(today("IST").toString()),
      issueDate: null,
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
          {patents.map((patent) => (
            <TableRow key={patent.id}>
              <TableCell>{patent.title}</TableCell>
              <TableCell>{patent.patentOffice}</TableCell>
              <TableCell>{patent.applicationNumber}</TableCell>
              <TableCell>{patent.status}</TableCell>
              <TableCell>{patent.filingDate.toString()}</TableCell>
              <TableCell>{patent.issueDate?.toString() || "-"}</TableCell>
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
                    onPress={() => handleDelete(patent.id)}
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
                {editingPatent ? "Edit Patent" : "Add New Patent"}
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
                    label="Application Number"
                    value={formData.applicationNumber}
                    onChange={(e) =>
                      handleInputChange("applicationNumber", e.target.value)
                    }
                    isRequired
                    isInvalid={!!errors.applicationNumber}
                    errorMessage={errors.applicationNumber}
                  />

                  <Select
                    label="Status"
                    selectedKeys={[formData.status]}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
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
                      value={formData.filingDate}
                      onChange={(date) => handleInputChange("filingDate", date)}
                      isRequired
                      maxValue={today("IST")}
                    />

                    <DateInput
                      label="Issue Date"
                      value={formData.issueDate}
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
                    minRows={3}
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
    </motion.div>
  );
};

export default Patents;
