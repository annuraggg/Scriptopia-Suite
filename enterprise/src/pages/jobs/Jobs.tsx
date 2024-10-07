import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {
  ListIcon,
  CirclePlayIcon,
  BanIcon,
  FilePlusIcon,
  MapPinIcon,
  BriefcaseIcon,
  BanknoteIcon,
  Menu,
  Trash2Icon,
} from "lucide-react";
import Filter from "./Filter";
import CreateJobModal from "./CreateJobModal";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Posting } from "@shared-types/Posting";
import { Department } from "@shared-types/Organization";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const Cards = [
  {
    title: "ALL",
    jobCount: 20,
    icon: <ListIcon size={28} />,
    filter: "all",
  },
  {
    title: "Active",
    jobCount: 10,
    icon: <CirclePlayIcon size={28} />,
    filter: "active",
  },
  {
    title: "Closed",
    jobCount: 5,
    icon: <BanIcon size={28} />,
    filter: "inactive",
  },
];

const Postings: React.FC = () => {
  const navigate = useNavigate();
  const [postings, setPostings] = useState<Posting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [sort, setSort] = useState(new Set(["newest"]));
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [workScheduleFilter, setWorkScheduleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [deleteId, setDeleteId] = useState<string>();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const editItems = [
    {
      title: "Delete",
      icon: <Trash2Icon size={18} />,
      onClick: (a: string) => {
        setDeleteId(a);
        onOpen();
      },
    },
  ];

  const filteredPostings = postings.filter((post) => {
    if (searchTerm) {
      return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    const department = departments.find((dep) => dep._id === post.department);
    if (departmentFilter) {
      return department?.name === departmentFilter;
    }
    if (workScheduleFilter.length > 0) {
      return workScheduleFilter.includes(post.type);
    }
    if (dateRange.start && dateRange.end) {
      return (
        new Date(post.applicationRange.start) >= new Date(dateRange.start) &&
        new Date(post.applicationRange.end) <= new Date(dateRange.end)
      );
    }

    if (selectedFilter === "active") {
      return new Date(post.applicationRange.end) > new Date();
    } else if (selectedFilter === "inactive") {
      return new Date(post.applicationRange.end) < new Date();
    } else {
      return post;
    }
  });

  useEffect(() => {
    let sortedPostings = [...filteredPostings];

    if (sort.has("newest")) {
      sortedPostings = sortedPostings.sort(
        (a, b) =>
          new Date(b.applicationRange.start).getTime() -
          new Date(a.applicationRange.start).getTime()
      );
    } else if (sort.has("oldest")) {
      sortedPostings = sortedPostings.sort(
        (a, b) =>
          new Date(a.applicationRange.start).getTime() -
          new Date(b.applicationRange.start).getTime()
      );
    } else if (sort.has("salary")) {
      sortedPostings = sortedPostings.sort((a, b) => {
        if (!a?.salary?.min || !b?.salary?.min) {
          return 0;
        }
        return a?.salary?.min - b?.salary?.min;
      });
    }
    setPostings(sortedPostings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const handleDetailsClick = (posting: Posting) => {
    navigate(`${posting._id}/dashboard`, { state: { posting } });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const openCreateJobModal = () => {
    if (!departments.length) {
      toast.error("Please create a department first");
      return;
    }
    setIsModalOpen(true);
  };

  const closeCreateJobModal = () => {
    setIsModalOpen(false);
  };

  const getPostingStatus = (posting: Posting) => {
    if (new Date(posting.applicationRange.end) < new Date()) {
      return "closed";
    }
    return "active";
  };

  const getPostingType = (posting: Posting) => {
    if (posting.type === "full_time") {
      return "Full Time";
    } else if (posting.type === "part_time") {
      return "Part Time";
    } else {
      return "Internship";
    }
  };

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    axios
      .get("/postings")
      .then((res) => {
        setTimeout(() => {
          setPostings(res.data.data.postings);
          setDepartments(res.data.data.departments);
          setIsLoading(false); // End loading after 1.5 seconds
        }, 1500);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setIsLoading(false); // End loading even on error
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = () => {
    setDeleteLoading(true);
    axios
      .delete(`/postings/${deleteId}`)
      .then((res) => {
        toast.success(res.data.message);
        setPostings((prev) => prev.filter((p) => p._id !== deleteId));
        onOpenChange();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        onOpenChange();
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <div className="flex gap-5 w-full p-5">
      <div className="w-full">
        <h4 className="text-2xl font-bold mb-4">Postings</h4>
        <div className="flex justify-between items-start w-full gap-5">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-1/5"
          >
            <Filter
              workScheduleFilter={workScheduleFilter}
              setWorkScheduleFilter={setWorkScheduleFilter}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              departments={departments}
              sort={sort}
              setSort={setSort}
            />
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 w-4/5"
          >
            <div className="">
              <div className="flex justify-between items-center w-full gap-4">
                <Input
                  className="4/5"
                  placeholder="Search Postings"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Card
                  className="w-1/5 cursor-pointer"
                  isPressable
                  onClick={openCreateJobModal}
                >
                  <CardBody className="flex items-center justify-between bg-success-400 text-background bg-opacity-3 py-2 px-5">
                    <div className="flex items-center gap-2">
                      <FilePlusIcon className="text-background" size={22} />
                      <p className="text-sm text-background">
                        Create a new job
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="flex gap-5 mt-5 w-full">
                {Cards.map((card, index) => (
                  <Card
                    isPressable
                    key={index}
                    className={`text-white rounded-xl flex flex-col items-start justify-center w-full h-26 p-4 gap-2 cursor-pointer transition-colors duration-300 ${
                      selectedFilter === card.filter
                        ? "bg-gray-500/20 text-white"
                        : "text-gray-500"
                    }`}
                    onClick={() => handleFilterChange(card.filter)}
                  >
                    <div className="flex items-center justify-center gap-2 w-full">
                      <div
                        className={`${
                          selectedFilter === card.filter
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {card.icon}
                      </div>
                      <h1
                        className={`${
                          selectedFilter === card.filter
                            ? "text-white"
                            : "text-gray-500"
                        } text-base`}
                      >
                        {card.title}
                      </h1>
                    </div>
                    <p
                      className={`text-center w-full ${
                        selectedFilter === card.filter
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    ></p>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col gap-3 w-full mt-6 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <Spinner color="primary" />
                  </div>
                ) : (
                  filteredPostings.map((posting, index) => (
                    <Card
                      className="w-full h-24 border-none p-2 grid grid-cols-2 gap-2"
                      key={index}
                    >
                      <div className="flex flex-col items-start justify-start gap-3 w-full p-2">
                        <div className="flex flex-row items-center justify-start gap-2 w-full">
                          <p
                            className="mr-1 cursor-pointer"
                            onClick={() => handleDetailsClick(posting)}
                          >
                            {posting.title}
                          </p>
                          <span
                            className={`text-xs mr-3 rounded-full whitespace-nowrap`}
                          >
                            {
                              departments.find(
                                (department) =>
                                  department._id === posting.department
                              )?.name
                            }
                          </span>
                          <span
                            className={`text-xs px-2 rounded-full whitespace-nowrap ${
                              getPostingStatus(posting) === "active"
                                ? " text-success-500 bg-success-100"
                                : " text-danger-500 bg-danger-100"
                            }`}
                          >
                            {getPostingStatus(posting) === "active"
                              ? "Active"
                              : "Closed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 w-full text-sm mt-3 text-gray-500">
                          <div className="flex items-center gap-2">
                            <BriefcaseIcon size={18} />
                            <p>{getPostingType(posting)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPinIcon size={18} />
                            <p>{posting.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <BanknoteIcon size={18} />
                            <p>
                              {posting.salary.min} - {posting.salary.max} (
                              {posting?.salary?.currency?.toUpperCase() ||
                                "USD"}
                              )
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <div className="text-sm rounded-full border bg-secondary bg-opacity-5 px-2 py-1">
                          <p className="text-gray-300 text-xs">
                            {getPostingStatus(posting) === "active"
                              ? `Open Until ${new Date(
                                  posting.applicationRange.end
                                ).toLocaleString()}`
                              : `Closed at ${new Date(
                                  posting.applicationRange.end
                                ).toLocaleString()}`}
                          </p>
                        </div>
                        <Dropdown>
                          <DropdownTrigger>
                            <Menu size={28} className="mr-6 cursor-pointer" />
                          </DropdownTrigger>
                          <DropdownMenu>
                            {editItems.map((item, index) => (
                              <DropdownItem
                                key={index}
                                className={
                                  item.title === "Delete" ? "text-danger" : ""
                                }
                              >
                                <div
                                  className="flex items-center gap-2"
                                  onClick={() => item.onClick(posting._id!)}
                                >
                                  {item.icon}
                                  <p>{item.title}</p>
                                </div>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={closeCreateJobModal}
        deparments={departments}
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
              </ModalHeader>
              <ModalBody>
                This action cannot be undone. Are you sure you want to delete
                this posting?F
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose} isDisabled={deleteLoading}>
                  Close
                </Button>
                <Button color="danger" onPress={handleDelete} isLoading={deleteLoading}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Postings;
