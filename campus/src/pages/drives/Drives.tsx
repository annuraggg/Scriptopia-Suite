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
  Search,
} from "lucide-react";
import Filter from "./Filter";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Drive } from "@shared-types/Drive";
import { Company } from "@shared-types/Company";
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

const Drives: React.FC = () => {
  const navigate = useNavigate();
  const { institute, setInstitute, rerender } =
    useOutletContext() as RootContext;

  useEffect(() => {
    console.log(institute);
  }, [institute]);

  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [sort, setSort] = useState(new Set(["newest"]));
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [workScheduleFilter, setWorkScheduleFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string>("");
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

  const filteredDrives = drives?.filter((post) => {
    if (searchTerm) {
      return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    const company = companies.find((dep) => dep._id === post.company);
    if (companyFilter) {
      return company?.name === companyFilter;
    }
    if (workScheduleFilter.length > 0) {
      return workScheduleFilter.includes(post.type);
    }
    if (dateRange.start && dateRange?.end) {
      const postStartDate = new Date(post.applicationRange.start);
      const postEndDate = new Date(post.applicationRange?.end);
      const filterStartDate = new Date(dateRange.start);
      const filterEndDate = new Date(dateRange?.end);

      if (postStartDate < filterStartDate || postEndDate > filterEndDate) {
        return false;
      }
    }

    if (selectedFilter === "active") {
      return new Date(post.applicationRange?.end) > new Date();
    } else if (selectedFilter === "inactive") {
      return new Date(post.applicationRange?.end) < new Date();
    } else {
      return post;
    }
  });

  useEffect(() => {
    let sortedDrives = [...filteredDrives];

    if (sort.has("newest")) {
      sortedDrives = sortedDrives.sort(
        (a, b) =>
          new Date(b.applicationRange.start).getTime() -
          new Date(a.applicationRange.start).getTime()
      );
    } else if (sort.has("oldest")) {
      sortedDrives = sortedDrives.sort(
        (a, b) =>
          new Date(a.applicationRange.start).getTime() -
          new Date(b.applicationRange.start).getTime()
      );
    } else if (sort.has("salary")) {
      sortedDrives = sortedDrives.sort((a, b) => {
        if (!a?.salary?.min || !b?.salary?.min) {
          return 0;
        }
        return a?.salary?.min - b?.salary?.min;
      });
    }
    setDrives(sortedDrives);
  }, [sort]);

  const handleDetailsClick = (drive: Drive) => {
    navigate(`${drive._id}/info`, { state: { drive } });
  };

  const openCreateDriveModal = () => {
    if (!companies.length) {
      toast.error("Please create a company first");
      return;
    }
    navigate("create");
  };

  const getDriveStatus = (drive: Drive) => {
    if (new Date(drive.applicationRange?.end) < new Date()) {
      return "closed";
    }
    return "active";
  };

  useEffect(() => {
    setDrives(institute?.drives! as Drive[]);
    setCompanies(institute?.companies || []);
    console.log(institute?.drives);
  }, [rerender]);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const handleDelete = () => {
    const newInstitute = { ...institute };
    const newDrives = newInstitute.drives?.filter(
      (drive) => drive._id !== deleteId
    );

    setInstitute({ ...newInstitute, drives: newDrives });
    onOpenChange();

    axios.delete(`/drives/${deleteId}`).catch((err) => {
      toast.error(err.response.data.message || "An error occurred");
    });
  };

  return (
    <div className="flex gap-5 w-full p-5">
      <div className="w-full">
        <Breadcrumbs>
          <BreadcrumbItem href="/drives">Drives</BreadcrumbItem>
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
              companyFilter={companyFilter}
              setCompanyFilter={setCompanyFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              companies={companies}
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
                  placeholder="Search Drives"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={
                    <Search size={20} className="opacity-50 mr-2" />
                  }
                />

                <p className="text-sm">Drive Status</p>
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
                  <p className=" text-sm">Sort by</p>
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
                  <Button
                    color="success"
                    variant="flat"
                    onClick={openCreateDriveModal}
                  >
                    <PlusIcon size={16} />
                    <p>Create drive</p>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full mt-6">
                {filteredDrives?.map((drive, index) => (
                  <Card
                    className="p-4"
                    key={index}
                    isPressable
                    onClick={() => handleDetailsClick(drive)}
                  >
                    <div className="flex items-center justify-between gap-3 w-full p-2">
                      <div>
                        <div className="flex flex-row items-center justify-start gap-2">
                          <p className="mr-1 cursor-pointer">{drive.title}</p>
                          <span
                            className={`text-xs mr-3 rounded-full whitespace-nowrap`}
                          >
                            {
                              companies.find(
                                (company) =>
                                  company._id === drive.company
                              )?.name
                            }
                          </span>
                          <span
                            className={`text-xs px-2 rounded-full whitespace-nowrap ${
                              getDriveStatus(drive) === "active"
                                ? " text-success-500 bg-success-100"
                                : " text-danger-500 bg-danger-100"
                            }`}
                          >
                            {getDriveStatus(drive) === "active"
                              ? "Active"
                              : "Closed"}
                          </span>
                        </div>

                        <p className="text-xs mt-3 text-start">
                          {getDriveStatus(drive) === "active"
                            ? `Open Until ${new Date(
                                drive.applicationRange?.end
                              ).toLocaleString()}`
                            : `Closed at ${new Date(
                                drive.applicationRange?.end
                              ).toLocaleString()}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {drive?.published && drive?.url && (
                          <Button
                            isIconOnly
                            variant="flat"
                            onClick={() => {
                              // copy link to clipboard
                              if (!drive?._id) return;
                              navigator.clipboard.writeText(
                                import.meta.env.VITE_CANDIDATE_URL +
                                  "/campus/drives" +
                                  drive?.url
                              );
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
                                  onClick={() => item.onClick(drive._id!)}
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
                this drive?
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

export default Drives;
