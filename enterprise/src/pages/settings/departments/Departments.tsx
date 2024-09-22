import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Department } from "@shared-types/Organization";
import UnsavedToast from "@/components/UnsavedToast";
import { setToastChanges } from "@/reducers/toastReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types/Reducer";
import { useOutletContext } from "react-router-dom";

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDepartment, setNewDepartment] = useState<Omit<Department, "_id">>({
    name: "",
    description: "",
  });
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [changes, setChanges] = useState<boolean>(false);

  const org = useSelector((state: RootState) => state.organization);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const dispatch = useDispatch();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const res = useOutletContext() as { departments: Department[] };
  useEffect(() => {
    setDepartments(res.departments);
  }, []);

  const triggerSaveToast = () => {
    if (!changes) {
      dispatch(setToastChanges(true));
      setChanges(true);
    }
  };

  const save = async () => {
    setLoading(true);
    axios
      .post("organizations/settings/departments", { departments })
      .then(() => {
        setChanges(false);
        dispatch(setToastChanges(false));
        toast.success("Changes Saved");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Saving Changes");
      })
      .finally(() => setLoading(false));
  };

  const addDepartment = () => {
    setDepartments([...departments, { ...newDepartment }]);
    setNewDepartment({ name: "", description: "" });
    onOpenChange();
    triggerSaveToast();
  };

  const updateDepartment = () => {
    if (editingDepartment) {
      const updatedDepartments = departments.map((dept) =>
        dept._id === editingDepartment._id ? editingDepartment : dept
      );
      setDepartments(updatedDepartments);
      setEditingDepartment(null);
      onEditOpenChange();
      triggerSaveToast();
    }
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter((dept) => dept._id !== id));
    triggerSaveToast();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <UnsavedToast action={save} />
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/settings"}>Settings</BreadcrumbItem>
          <BreadcrumbItem href={"/settings/departments"}>
            Departments
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="flex p-5 h-full w-full">
        <div className="flex-grow ml-4 h-full">
          <div className="p-4">
            <Button onPress={onOpen} className="mb-4">
              + Add Department
            </Button>
            <div className="space-y-4 h-full">
              {departments.map((dept) => (
                <Card
                  key={dept._id}
                  className="bg-gray-500 bg-opacity-10 border-gray-800"
                >
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xl">{dept.name}</p>
                        <p className="text-sm text-gray-400">
                          {dept.description}
                        </p>
                      </div>
                      <div>
                        <Button
                          onPress={() => {
                            setEditingDepartment(dept);
                            onEditOpen();
                          }}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          onPress={() => {
                            if (dept._id) deleteDepartment(dept._id);
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
