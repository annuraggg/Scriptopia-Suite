import React, { useState } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Department } from "@shared-types/Institute";
import { useOutletContext } from "react-router-dom";
import { SettingsContext } from "@/types/SettingsContext";

const Departments: React.FC = () => {
  const { institute, setInstitute } = useOutletContext() as SettingsContext;
  console.log(institute);

  const [newDepartment, setNewDepartment] = useState<Omit<Department, "_id">>({
    name: "",
    description: "",
  });

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );

  const [addError, setAddError] = useState<string>("");
  const [editError, setEditError] = useState<string>("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const addDepartment = () => {
    if (!newDepartment.name || !newDepartment.description) {
      setAddError("Please fill in all fields.");
      return;
    }

    const newOrg = { ...institute };
    newOrg.departments = [...(newOrg.departments || []), newDepartment];
    setInstitute(newOrg);
    onOpenChange();
    setNewDepartment({
      name: "",
      description: "",
    });
  };

  const updateDepartment = () => {
    if (!editingDepartment) return;
    if (!editingDepartment.name || !editingDepartment.description) {
      setEditError("Please fill in all fields.");
      return;
    }

    const newOrg = { ...institute };
    newOrg.departments = newOrg.departments?.map((dept) =>
      dept._id === editingDepartment._id ? editingDepartment : dept
    );
    setInstitute(newOrg);
    onEditOpenChange();
    setNewDepartment({
      name: "",
      description: "",
    });
  };

  const deleteDepartment = (id: string, name: string) => {
    const newOrg = { ...institute };

    if (id) {
      newOrg.departments = newOrg.departments?.filter(
        (dept) => dept._id !== id
      );
    } else {
      newOrg.departments = newOrg.departments?.filter(
        (dept) => dept.name !== name
      );
    }

    setInstitute(newOrg);
  };

  return (
    <div>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{institute.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/departments"}>
            Departments
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 h-full w-full">
        <div className="flex-grow ml-4 h-full">
          <div className="p-4">
            <Button onPress={onOpen} className="mb-4" variant="flat">
              + Add Department
            </Button>
            <div className="space-y-4 h-full">
              {institute?.departments?.map((dept) => (
                <Card key={dept._id}>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg">{dept?.name}</p>
                        <p className="text-sm text-gray-400">
                          {dept?.description}
                        </p>
                      </div>
                      <div>
                        <Button
                          onPress={() => {
                            setEditingDepartment(dept);
                            onEditOpen();
                          }}
                          className="mr-2"
                          variant="flat"
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          onClick={() => {
                            deleteDepartment(dept?._id || "", dept?.name || "");
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Add Department</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={newDepartment.name}
              onChange={(e) =>
                setNewDepartment({ ...newDepartment, name: e.target.value })
              }
            />
            <Textarea
              label="Description"
              value={newDepartment.description}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  description: e.target.value,
                })
              }
            />
            {addError && (
              <p className="text-red-500 mt-2 text-sm">{addError}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button color="primary" onPress={addDepartment}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          <ModalHeader>Edit Department</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={editingDepartment?.name}
              onChange={(e) =>
                setEditingDepartment({
                  ...editingDepartment!,
                  name: e.target.value,
                })
              }
            />
            <Textarea
              label="Description"
              value={editingDepartment?.description}
              onChange={(e) =>
                setEditingDepartment({
                  ...editingDepartment!,
                  description: e.target.value,
                })
              }
            />
            {editError && (
              <p className="text-red-500 mt-2 text-sm">{editError}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onEditOpenChange}>
              Cancel
            </Button>
            <Button color="primary" onPress={updateDepartment}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Departments;
