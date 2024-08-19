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
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {
  ListIcon,
  CirclePlayIcon,
  BanIcon,
  ArchiveIcon,
  FilePlusIcon,
  MapPinIcon,
  BanknoteIcon,
  Menu,
  Trash2Icon,
  ShareIcon,
  PencilIcon,
} from "lucide-react";
import Filter from "./Filter";
import CreateDriveModal from "./CreateDriveModal";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";


const editItems = [
  {
    title: "Edit",
    icon: <PencilIcon size={18} />,
  },
  {
    title: "Share",
    icon: <ShareIcon size={18} />,
  },
  {
    title: "Archive",
    icon: <ArchiveIcon size={18} />,
  },
  {
    title: "Delete",
    icon: <Trash2Icon size={18} />,
  },
];

const Drives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [workScheduleFilter, setWorkScheduleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [filteredCounts, setFilteredCounts] = useState({
    all: 0,
    active: 0,
    closed: 0,
    archived: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const Cards = [
    {
      title: "ALL",
      icon: <ListIcon size={28} />,
      driveCount: filteredCounts.all,
      filter: "all",
    },
    {
      title: "Active",
      driveCount: filteredCounts.active,
      icon: <CirclePlayIcon size={28} />,
      filter: "active",
    },
    {
      title: "Closed",
      driveCount: filteredCounts.closed,
      icon: <BanIcon size={28} />,
      filter: "inactive",
    },
    {
      title: "Archived",
      driveCount: filteredCounts.archived,
      icon: <ArchiveIcon size={28} />,
      filter: "archived",
    },
  ];

  const updateDriveCounts = (drives: any[]) => {
    const all = drives.length;
    const active = drives.filter((drive) => new Date(drive.applicationRange.end) >= new Date()).length;
    const closed = drives.filter((drive) => new Date(drive.applicationRange.end) < new Date()).length;
    const archived = drives.filter((drive) => drive.status === "archived").length;
  
    setFilteredCounts({ all, active, closed, archived });
  };

  const filtereddrives = drives.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedFilter === "all" || post.status === selectedFilter;
    const matchesWorkSchedule =
      workScheduleFilter.length === 0 ||
      workScheduleFilter.includes(post.driveprofile);
    const matchesDepartment =
      !departmentFilter || post.category === departmentFilter;
    const matchesDateRange =
      (!dateRange.start ||
        new Date(post.createdOn) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(post.createdOn) <= new Date(dateRange.end));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesWorkSchedule &&
      matchesDepartment &&
      matchesDateRange
    );
  });

  const handleDetailsClick = (drive: any) => {
    navigate(`${drive._id}/dashboard`, { state: { drive } });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const openCreatedriveModal = () => {
    setIsModalOpen(true);
  };

  const closeCreatedriveModal = () => {
    setIsModalOpen(false);
  };

  const { getToken } = useAuth();
  const axios = ax(getToken);
  useEffect(() => {
    axios
      .get("/drives")
      .then((res) => {
        setDrives(res.data.data);
        updateDriveCounts(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
  }, []);
  

  return (
    <div className="flex gap-5 w-full p-5">
      <div className="w-full">
        <h4 className="text-2xl font-bold mb-4">Drives</h4>
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
                  placeholder="Search Drives"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Card
                  className="w-1/5 cursor-pointer"
                  isPressable
                  onClick={openCreatedriveModal}
                >
                  <CardBody className="flex items-center justify-between bg-success-400 text-background bg-opacity-3 py-2 px-5">
                    <div className="flex items-center gap-2">
                      <FilePlusIcon className="text-background" size={22} />
                      <p className="text-sm text-background">Create Drive</p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              <div className="grid grid-cols-4 gap-8 mt-5 w-full">
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
                    >
                      {card.driveCount} Drives
                    </p>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col gap-3 w-full mt-6 overflow-y-auto">
                {filtereddrives.map((drive, index) => (
                  <Card
                    className="w-full h-24 border-none p-2 grid grid-cols-2 gap-2"
                    key={index}
                  >
                    <div className="flex flex-col items-start justify-start gap-3 w-full p-2">
                      <div className="flex flex-row items-center justify-start gap-2 w-full">
                        <p
                          className="mr-1 cursor-pointer"
                          onClick={() => handleDetailsClick(drive)}
                        >
                          {drive.title}
                        </p>
                        <span
                          className={`text-xs px-2 rounded-full whitespace-nowrap ${
                            new Date(drive.applicationRange.end) < new Date()
                              ? " text-danger-500 bg-danger-100"
                              : " text-success-500 bg-success-100"
                          }`}
                        >
                          {new Date(drive.applicationRange.end) < new Date()
                            ? "Closed"
                            : "Open"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full text-sm mt-3 text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPinIcon size={18} />
                          <p>{drive.location}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-5">
                          <BanknoteIcon size={18} />
                          <p>
                            {drive.salary.min} - {drive.salary.max} ({drive.salary.currency.toUpperCase()})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className="text-sm rounded-full border bg-secondary bg-opacity-5 px-2 py-1">
                        <p className="text-gray-300 text-xs">
                          {new Date(drive.applicationRange.end) > new Date()
                            ? `Open Until ${new Date(drive.applicationRange.end).toDateString()}`
                            : `Closed at ${new Date(drive.applicationRange.end).toDateString()}`}
                        </p>
                      </div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Menu
                            size={28}
                            className="mr-6 cursor-pointer"
                            //onClick={() => handleDetailsClick()}
                          />
                        </DropdownTrigger>
                        <DropdownMenu>
                          {editItems.map((item, index) => (
                            <DropdownItem
                              key={index}
                              className={
                                item.title === "Delete" ? "text-danger" : ""
                              }
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <p>{item.title}</p>
                              </div>
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <CreateDriveModal isOpen={isModalOpen} onClose={closeCreatedriveModal} />
    </div>
  );
};

export default Drives;
