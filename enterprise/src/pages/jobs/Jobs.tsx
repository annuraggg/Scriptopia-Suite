import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  SelectItem,
  Select,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ListIcon,
  CirclePlayIcon,
  BanIcon,
  Trash2Icon,
  EllipsisVertical,
  Link,
  PlusIcon,
  LayoutList,
  LayoutGrid,
  Search,
} from "lucide-react";
import Filter from "./Filter";
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
import { RootContext } from "@/types/RootContext";
import { Tabs, Tab } from "@nextui-org/react";

const Cards = [
  {
    title: "All",
    icon: <ListIcon size={28} />,
    filter: "all",
  },
  {
    title: "Active",
    icon: <CirclePlayIcon size={28} />,
    filter: "active",
  },
  {
    title: "Closed",
    icon: <BanIcon size={28} />,
    filter: "inactive",
  },
];

const Postings: React.FC = () => {
  const navigate = useNavigate();
  const { organization, setOrganization, rerender } =
    useOutletContext() as RootContext;

  useEffect(() => {
    console.log(organization);
  }, [organization]);

  const [postings, setPostings] = useState<Posting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [sort, setSort] = useState(new Set(["newest"]));
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [workScheduleFilter, setWorkScheduleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [deleteId, setDeleteId] = useState<string>();

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

  const filteredPostings = postings?.filter((post) => {
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
      const postStartDate = new Date(post.applicationRange.start);
      const postEndDate = new Date(post.applicationRange.end);
      const filterStartDate = new Date(dateRange.start);
      const filterEndDate = new Date(dateRange.end);

      if (postStartDate < filterStartDate || postEndDate > filterEndDate) {
        return false;
      }
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
  }, [sort]);

  const handleDetailsClick = (posting: Posting) => {
    navigate(`${posting._id}/dashboard`, { state: { posting } });
  };

  const openCreateJobModal = () => {
    if (!departments.length) {
      toast.error("Please create a department first");
      return;
    }
    navigate("create");
  };

  const getPostingStatus = (posting: Posting) => {
    if (new Date(posting.applicationRange.end) < new Date()) {
      return "closed";
    }
    return "active";
  };

  useEffect(() => {
    setPostings(organization?.postings);
    setDepartments(organization?.departments || []);
  }, [rerender]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const handleDelete = () => {
    const newOrganization = { ...organization };
    const newPostings = newOrganization.postings?.filter(
      (posting) => posting._id !== deleteId
    );

    setOrganization({ ...newOrganization, postings: newPostings });
    onOpenChange();

    axios.delete(`/postings/${deleteId}`).catch((err) => {
      toast.error(err.response.data.message || "An error occurred");
    });
  };

  return (
    <div className="flex gap-5 w-full p-5">
      <div className="w-full">
        <Breadcrumbs>
          <BreadcrumbItem href="/postings">Postings</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-between items-start w-full gap-5 mt-5">
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
              <div className="flex justify-center items-center w-full gap-3"></div>

              <div className="flex gap-5 mt-5 w-full items-center">
                <Input
                  className="w-[300px]"
                  placeholder="Search Postings"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search size={20} className="opacity-50 mr-2" />}
                />

                <p className="text-neutral-400 text-sm">Job Status</p>
                <Select
                  className="w-[100px]"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  selectedKeys={[selectedFilter]}
                >
                  {Cards.map((card) => (
                    <SelectItem key={card.filter} value={card.filter}>
                      {card.title}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex items-center gap-1">
                  <p className="text-neutral-400 text-sm">Sort by</p>
                </div>
                <Select
                  className="w-[150px]"
                  selectedKeys={sort} // @ts-expect-error - idk
                  onSelectionChange={setSort}
                >
                  <SelectItem key="newest">Newest</SelectItem>
                  <SelectItem key="oldest">Oldest</SelectItem>
                  <SelectItem key="salary">Salary</SelectItem>
                </Select>

                <div className="flex w-[30%] justify-end gap-3 items-center">
                  <Tabs>
                    <Tab title={<LayoutList size={18} />} />
                    <Tab title={<LayoutGrid size={18} />} />
                  </Tabs>
                  <Button
                    color="success"
                    variant="flat"
                    onClick={openCreateJobModal}
                  >
                    <PlusIcon size={16} />
                    <p>Create job</p>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full mt-6 overflow-y-auto">
                {filteredPostings?.map((posting, index) => (
                  <Card
                    className="p-4"
                    key={index}
                    isPressable
                    onClick={() => handleDetailsClick(posting)}
                  >
                    <div className="flex items-center justify-between gap-3 w-full p-2">
                      <div>
                        <div className="flex flex-row items-center justify-start gap-2">
                          <p className="mr-1 cursor-pointer">{posting.title}</p>
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

                        <p className="text-gray-300 text-xs mt-3">
                          {getPostingStatus(posting) === "active"
                            ? `Open Until ${new Date(
                                posting.applicationRange.end
                              ).toLocaleString()}`
                            : `Closed at ${new Date(
                                posting.applicationRange.end
                              ).toLocaleString()}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {posting?.published && posting?.url && (
                          <Button
                            isIconOnly
                            variant="flat"
                            onClick={() => {
                              // copy link to clipboard
                              if (!posting?.url) return;
                              navigator.clipboard.writeText(posting?.url);
                              toast.success("Link copied to clipboard");
                            }}
                          >
                            <Link />
                          </Button>
                        )}

                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly variant="flat">
                              <EllipsisVertical />
                            </Button>
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
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={handleDelete}>
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
