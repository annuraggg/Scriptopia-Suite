import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import { Pencil, Calendar, Plus, GraduationCap, Trash } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Candidate, Education as IEducation } from "@shared-types/Candidate";

const Education = () => {
  const { user, setUser } = useOutletContext() as {
    user: Candidate;
    setUser: (user: Candidate) => void;
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentEducation, setCurrentEducation] = useState<IEducation>({
    school: "",
    board: "",
    degree: "",
    branch: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    type: "fulltime",
    current: false,
    percentage: 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  // Add state for branch modal
  const {
    isOpen: isBranchModalOpen,
    onOpen: onBranchModalOpen,
    onClose: onBranchModalClose,
  } = useDisclosure();
  const [newBranch, setNewBranch] = useState("");
  const [branches, setBranches] = useState([
    "Information Technology",
    "Computer Science",
    "Mechanical",
    "Civil",
    "Electronics",
  ]);

  const programs = ["B.E.", "B.Tech", "Diploma", "HSC", "SSC"];

  const educationTypes = ["Full Time", "Part Time", "Distance Learning"];

  const getParsedType = (type: string) => {
    switch (type) {
      case "Full Time":
        return "fulltime";
      case "Part Time":
        return "parttime";
      case "Distance Learning":
        return "distance";
      default:
        return type;
    }
  };

  const getFormattedType = (str: string) => {
    switch (str) {
      case "fulltime":
        return "Full Time";
      case "parttime":
        return "Part Time";
      case "distance":
        return "Distance Learning";
      default:
        return str;
    }
  };

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setBranches([...branches, newBranch.trim()]);
      setCurrentEducation({
        ...currentEducation,
        branch: newBranch.trim(),
      });
      setNewBranch("");
      onBranchModalClose();
    }
  };

  return (
    <div className="p-5">
      {/* Main Education Modal */}
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Education Details</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="School/Institution Name"
                    placeholder="Enter institution name"
                    value={currentEducation.school}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        school: e.target.value,
                      })
                    }
                  />
                  <Select
                    label="Select Program/Degree/Certificate"
                    placeholder="Select program"
                    selectedKeys={
                      currentEducation.degree ? [currentEducation.degree] : []
                    }
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        degree: e.target.value,
                      })
                    }
                  >
                    {programs.map((prog) => (
                      <SelectItem key={prog} value={prog}>
                        {prog}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Enter Board/University"
                    placeholder="Enter board or university name"
                    value={currentEducation.board}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        board: e.target.value,
                      })
                    }
                  />
                  <div className="flex flex-col gap-2">
                    <Select
                      label="Select Branch/Specialization"
                      placeholder="Select branch"
                      selectedKeys={
                        currentEducation.branch ? [currentEducation.branch] : []
                      }
                      onChange={(e) =>
                        setCurrentEducation({
                          ...currentEducation,
                          branch: e.target.value,
                        })
                      }
                    >
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      size="sm"
                      variant="light"
                      className="self-start"
                      onPress={onBranchModalOpen}
                    >
                      Add Branch/Specialization
                    </Button>
                  </div>

                  <Input
                    label="Select Start Year"
                    placeholder="YYYY"
                    value={currentEducation?.startYear?.toString()}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        startYear: parseInt(e.target.value),
                      })
                    }
                    endContent={
                      <Calendar className="text-default-400" size={16} />
                    }
                  />
                  <Input
                    label="Select End Year"
                    placeholder="YYYY"
                    value={currentEducation?.endYear?.toString()}
                    isDisabled={currentEducation.current}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        endYear: parseInt(e.target.value),
                      })
                    }
                    endContent={
                      <Calendar className="text-default-400" size={16} />
                    }
                  />

                  <Checkbox
                    checked={currentEducation.current}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        current: e.target.checked,
                      })
                    }
                  >
                    Currently Persuing
                  </Checkbox>

                  <br />

                  <Select
                    label="Select Education Type"
                    placeholder="Select type"
                    selectedKeys={
                      currentEducation.type ? [currentEducation.type] : []
                    }
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        type: e.target.value as
                          | "fulltime"
                          | "parttime"
                          | "distance",
                      })
                    }
                  >
                    {educationTypes.map((type) => (
                      <SelectItem
                        key={getParsedType(type)}
                        value={getParsedType(type)}
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Score in Percentage"
                    placeholder="Enter percentage"
                    value={currentEducation?.percentage?.toString()}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        percentage: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  className="w-full"
                  onPress={() => {
                    if (isEditing) {
                      const newEducation = user?.education?.map((edu) =>
                        edu._id === currentEducation._id
                          ? currentEducation
                          : edu
                      );
                      setUser({ ...user, education: newEducation });
                    } else {
                      setUser({
                        ...user,
                        education: [
                          ...(user?.education || []),
                          currentEducation,
                        ],
                      });
                    }

                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Branch Modal */}
      <Modal size="sm" isOpen={isBranchModalOpen} onClose={onBranchModalClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Add New Branch/Specialization</ModalHeader>
              <ModalBody>
                <Input
                  label="Branch Name"
                  placeholder="Enter new branch name"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onBranchModalClose}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddBranch}>
                  Add Branch
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Rest of the component */}
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile/education">Education</BreadcrumbItem>
      </Breadcrumbs>

      <div className="py-5">
        <div className="flex justify-end items-center mb-4">
          {user?.education?.length !== 0 && (
            <Button
              variant="flat"
              onPress={() => {
                setCurrentEducation({
                  school: "",
                  board: "",
                  degree: "",
                  branch: "",
                  startYear: new Date().getFullYear(),
                  endYear: new Date().getFullYear(),
                  type: "fulltime",
                  current: false,
                  percentage: 0,
                });
                onOpen();
              }}
              startContent={<Plus size={18} />}
            >
              Add New
            </Button>
          )}
        </div>

        {!user?.education?.length ? (
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
              <GraduationCap size={50} />
            </motion.div>

            <h3 className="text-xl mt-3">No Education Added Yet</h3>
            <p className="text-gray-500">
              Start by adding your first education!
            </p>
            <Button onClick={() => onOpen()} startContent={<Plus size={18} />}>
              Add new
            </Button>
          </motion.div>
        ) : (
          <>
            {user?.education?.map((edu, index) => (
              <Card key={index} className="p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{edu.degree}</span>
                    <span className="text-small">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-green-500">
                      {edu.percentage}%
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={() => {
                        const newEducation = user?.education?.filter(
                          (education) => education._id !== edu._id
                        );
                        setUser({ ...user, education: newEducation });
                      }}
                      variant="flat"
                      color="danger"
                    >
                      <Trash size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={() => {
                        setCurrentEducation(edu);
                        setIsEditing(true);
                        onOpen();
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2">
                      <span className="text-default-500 text-sm">
                        Institution:
                      </span>
                      <p>{edu.school}</p>
                    </div>
                    <div className="mb-2">
                      <span className="text-default-500 text-sm">
                        Board/University:
                      </span>
                      <p>{edu.board}</p>
                    </div>
                    <div className="mb-2">
                      <span className="text-default-500 text-sm">
                        Education Type:
                      </span>
                      <p>{getFormattedType(edu.type)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="text-default-500 text-sm">
                        Branch/Specialization:
                      </span>
                      <p>{edu.branch}</p>
                    </div>
                    <div className="mb-2">
                      <span className="text-default-500 text-sm">
                        Duration:
                      </span>
                      <p>
                        {edu.startYear} - {edu.endYear}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Education;
