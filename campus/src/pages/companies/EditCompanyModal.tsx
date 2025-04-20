import { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Input,
  Textarea,
  Chip,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { Save, ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Company } from "@shared-types/Company";

interface EditCompanyModalProps {
  company: Company;
  onClose: () => void;
  onSave: () => void;
}

const EditCompanyModal = ({
  company,
  onClose,
  onSave,
}: EditCompanyModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Company>({ ...company });
  const [roles, setRoles] = useState<string[]>(
    company.generalInfo.rolesOffered || []
  );
  const [yearVisit, setYearVisit] = useState<string[]>(
    company.generalInfo.yearVisit || []
  );
  const [newRole, setNewRole] = useState("");
  const [newYear, setNewYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        const parentObj = {
          ...(prev[parent as keyof Company] as Record<string, any>),
        };
        parentObj[child] = value;

        return {
          ...prev,
          [parent]: parentObj,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseFloat(value);

    const [parent, child] = name.split(".");

    setFormData((prev) => {
      const parentObj = {
        ...(prev[parent as keyof Company] as Record<string, any>),
      };
      parentObj[child] = numValue;

      return {
        ...prev,
        [parent]: parentObj,
      };
    });
  };

  const addRole = () => {
    if (newRole && !roles.includes(newRole)) {
      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      setFormData((prev) => ({
        ...prev,
        generalInfo: {
          ...prev.generalInfo,
          rolesOffered: updatedRoles,
        },
      }));
      setNewRole("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    const updatedRoles = roles.filter((role) => role !== roleToRemove);
    setRoles(updatedRoles);
    setFormData((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        rolesOffered: updatedRoles,
      },
    }));
  };

  const addYear = () => {
    if (newYear && !yearVisit.includes(newYear)) {
      const updatedYears = [...yearVisit, newYear];
      setYearVisit(updatedYears);
      setFormData((prev) => ({
        ...prev,
        generalInfo: {
          ...prev.generalInfo,
          yearVisit: updatedYears,
        },
      }));
      setNewYear("");
    }
  };

  const removeYear = (yearToRemove: string) => {
    const updatedYears = yearVisit.filter((year) => year !== yearToRemove);
    setYearVisit(updatedYears);
    setFormData((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        yearVisit: updatedYears,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const preparedData = {
        ...formData,
        generalInfo: {
          ...formData.generalInfo,
          studentsHired: Number(formData.generalInfo.studentsHired),
          averagePackage: Number(formData.generalInfo.averagePackage),
          highestPackage: Number(formData.generalInfo.highestPackage),
        },
      };

      const response = await axios.put("/companies/update", preparedData);

      if (response.status === 200) {
        onSave();
      } else {
        setError(
          "Failed to update company: " + response.data?.message ||
            "Unknown error"
        );
      }
    } catch (err: any) {
      console.error("Error updating company:", err);
      setError(err.response?.data?.message || "Failed to update company");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Button isIconOnly variant="light" onClick={onClose}>
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-xl font-bold">Edit Company Profile</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="flat" onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              startContent={<Save size={18} />}
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {error && (
          <div className="m-4 p-3 bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-4">
              <CardHeader className="pb-0 pt-0">
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isRequired
                  />

                  <Textarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    minRows={3}
                  />
                </div>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="pb-0 pt-0">
                <h3 className="text-lg font-semibold">Visit Info</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Input
                        label="Year of Visit"
                        placeholder="e.g. 2023"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addYear} className="self-end">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {yearVisit.map((year) => (
                        <Chip
                          key={year}
                          onClose={() => removeYear(year)}
                          variant="flat"
                        >
                          {year}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <Input
                    type="number"
                    label="Students Hired"
                    name="generalInfo.studentsHired"
                    value={formData.generalInfo.studentsHired.toString()}
                    onChange={handleNumberInputChange}
                  />
                </div>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="pb-0 pt-0">
                <h3 className="text-lg font-semibold">Package Details</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input
                    type="number"
                    label="Average Package (in ₹)"
                    name="generalInfo.averagePackage"
                    value={formData.generalInfo.averagePackage.toString()}
                    onChange={handleNumberInputChange}
                    startContent={<span className="text-default-400">₹</span>}
                  />

                  <Input
                    type="number"
                    label="Highest Package (in ₹)"
                    name="generalInfo.highestPackage"
                    value={formData.generalInfo.highestPackage.toString()}
                    onChange={handleNumberInputChange}
                    startContent={<span className="text-default-400">₹</span>}
                  />
                </div>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="pb-0 pt-0">
                <h3 className="text-lg font-semibold">Roles Offered</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <Input
                        label="Roles Offered"
                        placeholder="e.g. Software Engineer"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addRole} className="self-end">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {roles.map((role) => (
                        <Chip
                          key={role}
                          onClose={() => removeRole(role)}
                          variant="flat"
                        >
                          {role}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="p-4">
              <CardHeader className="pb-0 pt-0">
                <h3 className="text-lg font-semibold">
                  HR Contact Information
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input
                    label="HR Name"
                    name="hrContacts.name"
                    value={formData.hrContacts?.name || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="HR Phone"
                    name="hrContacts.phone"
                    value={formData.hrContacts?.phone || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="HR Email"
                    name="hrContacts.email"
                    type="email"
                    value={formData.hrContacts?.email || ""}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Company Website"
                    name="hrContacts.website"
                    value={formData.hrContacts?.website || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </CardBody>
            </Card>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditCompanyModal;
