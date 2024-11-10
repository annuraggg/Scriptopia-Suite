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
} from "@nextui-org/react";
import { Pencil, Calendar, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Education {
  institution: string;
  board: string;
  program: string;
  branch: string;
  startYear: string;
  endYear: string;
  educationType: string;
  percentage: string;
}

const Education = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: "",
    board: "",
    program: "",
    branch: "",
    startYear: "",
    endYear: "",
    educationType: "",
    percentage: "",
  });

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

  useEffect(() => {
    // Sample data
    setEducations([
      {
        institution: "A P shah Institute of Technology,Thane",
        board: "Department of Engineering",
        program: "B.E. (Hons.)",
        branch: "Information Technology",
        startYear: "2022",
        endYear: "2025",
        educationType: "Full Time",
        percentage: "72.7",
      },
    ]);
  }, []);

  const programs = ["B.E.", "B.Tech", "Diploma", "HSC", "SSC"];

  const educationTypes = ["Full Time", "Part Time", "Distance Learning"];

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
                    value={currentEducation.institution}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        institution: e.target.value,
                      })
                    }
                  />
                  <Select
                    label="Select Program/Degree/Certificate"
                    placeholder="Select program"
                    selectedKeys={
                      currentEducation.program ? [currentEducation.program] : []
                    }
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        program: e.target.value,
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
                    value={currentEducation.startYear}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        startYear: e.target.value,
                      })
                    }
                    endContent={
                      <Calendar className="text-default-400" size={16} />
                    }
                  />
                  <Input
                    label="Select End Year"
                    placeholder="YYYY"
                    value={currentEducation.endYear}
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        endYear: e.target.value,
                      })
                    }
                    endContent={
                      <Calendar className="text-default-400" size={16} />
                    }
                  />

                  <Select
                    label="Select Education Type"
                    placeholder="Select type"
                    selectedKeys={
                      currentEducation.educationType
                        ? [currentEducation.educationType]
                        : []
                    }
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        educationType: e.target.value,
                      })
                    }
                  >
                    {educationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Score in Percentage"
                    placeholder="Enter percentage"
                    value={currentEducation.percentage}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">%</span>
                      </div>
                    }
                    onChange={(e) =>
                      setCurrentEducation({
                        ...currentEducation,
                        percentage: e.target.value,
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
                    if (currentEducation.institution) {
                      setEducations(
                        educations.map((edu) =>
                          edu.institution === currentEducation.institution
                            ? currentEducation
                            : edu
                        )
                      );
                    } else {
                      setEducations([...educations, currentEducation]);
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
        <div className="flex justify-between items-center mb-4">
          <p>Education</p>
          <Button
            variant="flat"
            onPress={() => {
              setCurrentEducation({
                institution: "",
                board: "",
                program: "",
                branch: "",
                startYear: "",
                endYear: "",
                educationType: "",
                percentage: "",
              });
              onOpen();
            }}
            startContent={<Plus size={18} />}
          >
            Add New
          </Button>
        </div>

        {educations.map((edu, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{edu.program}</span>
                <span className="text-small">
                  {edu.startYear} - {edu.endYear}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-green-500">
                  {edu.percentage}%
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => {
                    setCurrentEducation(edu);
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
                  <span className="text-default-500 text-sm">Institution:</span>
                  <p>{edu.institution}</p>
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
                  <p>{edu.educationType}</p>
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
                  <span className="text-default-500 text-sm">Duration:</span>
                  <p>
                    {edu.startYear} - {edu.endYear}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Education;
