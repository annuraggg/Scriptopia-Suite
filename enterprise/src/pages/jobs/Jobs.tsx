import { useState } from "react";
import { Card, CardBody, Input, Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {
  ListIcon,
  CirclePlayIcon,
  BanIcon,
  ArchiveIcon,
  FilePlusIcon,
  MapPinIcon,
  BriefcaseIcon,
  BanknoteIcon,
  Menu,
} from "lucide-react";
import Filter from "./Filter";

interface Posting {
  id: string;
  title: string;
  createdOn: string;
  status: "active" | "inactive";
  openUntil: string;
  category: "Operations" | "IT";
  location: string;
  salaryFrom: string;
  salaryUpto: string;
  jobprofile: "Full Time" | "Part Time" | "Internship";
}

const postingsSample: Posting[] = [
  {
    id: "1",
    title: "React App Developer",
    createdOn: "23 May 2023",
    status: "active",
    openUntil: "30 June 2023",
    category: "IT",
    location: "Mumbai",
    salaryFrom: "₹50,000",
    salaryUpto: "₹1,00,000",
    jobprofile: "Part Time",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    createdOn: "15 June 2023",
    status: "active",
    openUntil: "31 July 2023",
    category: "IT",
    location: "Bangalore",
    salaryFrom: "₹1,00,000",
    salaryUpto: "₹2,00,000",
    jobprofile: "Full Time",
  },
  {
    id: "3",
    title: "Frontend Developer",
    createdOn: "10 July 2023",
    status: "inactive",
    openUntil: "15 August 2023",
    category: "IT",
    location: "Delhi",
    salaryFrom: "₹80,000",
    salaryUpto: "₹1,50,000",
    jobprofile: "Internship",
  },
  {
    id: "4",
    title: "Backend Developer",
    createdOn: "5 August 2023",
    status: "active",
    openUntil: "30 September 2023",
    category: "IT",
    location: "Chennai",
    salaryFrom: "₹90,000",
    salaryUpto: "₹1,80,000",
    jobprofile: "Full Time",
  },
  {
    id: "5",
    title: "UI/UX Designer",
    createdOn: "18 September 2023",
    status: "inactive",
    openUntil: "31 October 2023",
    category: "IT",
    location: "Hyderabad",
    salaryFrom: "₹70,000",
    salaryUpto: "₹1,20,000",
    jobprofile: "Part Time",
  },
  {
    id: "6",
    title: "Software Engineer",
    createdOn: "22 October 2023",
    status: "active",
    openUntil: "15 November 2023",
    category: "Operations",
    location: "Pune",
    salaryFrom: "₹60,000",
    salaryUpto: "₹1,10,000",
    jobprofile: "Internship",
  },
  {
    id: "7",
    title: "Data Scientist",
    createdOn: "9 November 2023",
    status: "inactive",
    openUntil: "30 December 2023",
    category: "Operations",
    location: "Kolkata",
    salaryFrom: "₹40,000",
    salaryUpto: "₹90,000",
    jobprofile: "Full Time",
  },
  {
    id: "8",
    title: "Cloud Architect",
    createdOn: "14 December 2023",
    status: "active",
    openUntil: "31 January 2024",
    category: "Operations",
    location: "Ahmedabad",
    salaryFrom: "₹30,000",
    salaryUpto: "₹80,000",
    jobprofile: "Part Time",
  },
  {
    id: "9",
    title: "DevOps Engineer",
    createdOn: "27 January 2024",
    status: "inactive",
    openUntil: "28 February 2024",
    category: "Operations",
    location: "Jaipur",
    salaryFrom: "₹20,000",
    salaryUpto: "₹70,000",
    jobprofile: "Internship",
  },
  {
    id: "10",
    title: "Product Manager",
    createdOn: "8 February 2024",
    status: "active",
    openUntil: "31 March 2024",
    category: "Operations",
    location: "Lucknow",
    salaryFrom: "₹10,000",
    salaryUpto: "₹60,000",
    jobprofile: "Full Time",
  },
  {
    id: "11",
    title: "Machine Learning Engineer",
    createdOn: "12 March 2024",
    status: "inactive",
    openUntil: "30 April 2024",
    category: "IT",
    location: "Chandigarh",
    salaryFrom: "₹15,000",
    salaryUpto: "₹50,000",
    jobprofile: "Part Time",
  },
  {
    id: "12",
    title: "Cybersecurity Analyst",
    createdOn: "25 April 2024",
    status: "active",
    openUntil: "31 May 2024",
    category: "IT",
    location: "Indore",
    salaryFrom: "₹25,000",
    salaryUpto: "₹40,000",
    jobprofile: "Internship",
  },
  {
    id: "13",
    title: "Mobile App Developer",
    createdOn: "7 May 2024",
    status: "inactive",
    openUntil: "30 June 2024",
    category: "IT",
    location: "Bhopal",
    salaryFrom: "₹35,000",
    salaryUpto: "₹30,000",
    jobprofile: "Full Time",
  },
  {
    id: "14",
    title: "Blockchain Developer",
    createdOn: "19 June 2024",
    status: "active",
    openUntil: "31 July 2024",
    category: "IT",
    location: "Raipur",
    salaryFrom: "₹45,000",
    salaryUpto: "₹20,000",
    jobprofile: "Part Time",
  },
  {
    id: "15",
    title: "Game Developer",
    createdOn: "2 July 2024",
    status: "inactive",
    openUntil: "31 August 2024",
    category: "IT",
    location: "Ranchi",
    salaryFrom: "₹55,000",
    salaryUpto: "₹100,000",
    jobprofile: "Internship",
  },
  {
    id: "16",
    title: "Network Engineer",
    createdOn: "14 August 2024",
    status: "active",
    openUntil: "30 September 2024",
    category: "Operations",
    location: "Patna",
    salaryFrom: "₹65,000",
    salaryUpto: "₹90,000",
    jobprofile: "Full Time",
  },
  {
    id: "17",
    title: "QA Engineer",
    createdOn: "27 September 2024",
    status: "inactive",
    openUntil: "31 October 2024",
    category: "Operations",
    location: "Guwahati",
    salaryFrom: "₹75,000",
    salaryUpto: "₹80,000",
    jobprofile: "Part Time",
  },
  {
    id: "18",
    title: "Technical Writer",
    createdOn: "8 October 2024",
    status: "active",
    openUntil: "30 November 2024",
    category: "Operations",
    location: "Shillong",
    salaryFrom: "₹85,000",
    salaryUpto: "₹70,000",
    jobprofile: "Internship",
  },
  {
    id: "19",
    title: "Systems Administrator",
    createdOn: "21 November 2024",
    status: "inactive",
    openUntil: "31 December 2024",
    category: "Operations",
    location: "Agartala",
    salaryFrom: "₹95,000",
    salaryUpto: "₹60,000",
    jobprofile: "Full Time",
  },
  {
    id: "20",
    title: "AI Research Scientist",
    createdOn: "3 December 2024",
    status: "active",
    openUntil: "31 January 2025",
    category: "Operations",
    location: "Itanagar",
    salaryFrom: "₹15,000",
    salaryUpto: "₹50,000",
    jobprofile: "Part Time",
  },
];

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
  {
    title: "Archived",
    jobCount: 5,
    icon: <ArchiveIcon size={28} />,
    filter: "archived",
  },
];

const Postings: React.FC = () => {
  const navigate = useNavigate();
  const [postings] = useState<Posting[]>(postingsSample);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [workScheduleFilter, setWorkScheduleFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const filteredPostings = postings.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedFilter === "all" || post.status === selectedFilter;
    const matchesWorkSchedule =
      workScheduleFilter.length === 0 ||
      workScheduleFilter.includes(post.jobprofile);
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

  const handleDetailsClick = (posting: Posting) => {
    navigate(`${posting.id}/dashboard`, { state: { posting } });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex gap-5 w-full p-5">
      <div className="w-full">
        <h4 className="text-2xl font-bold mb-4">Postings</h4>
        <div className="flex justify-between items-start w-full gap-5">
          <div className="w-1/5">
            <Filter
              workScheduleFilter={workScheduleFilter}
              setWorkScheduleFilter={setWorkScheduleFilter}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
          <div className="flex flex-col gap-4 w-4/5">
            <div className="flex justify-between items-center w-full gap-4">
              <Input
                className="4/5"
                placeholder="Search Postings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Card className="w-1/5 cursor-pointer">
                <CardBody className="flex items-center justify-between bg-success-400 text-background bg-opacity-3 py-2 px-5">
                  <Link className="flex items-center gap-2">
                    <FilePlusIcon className="text-background" size={22} />
                    <p className="text-sm text-background">Create a new job</p>
                  </Link>
                </CardBody>
              </Card>
            </div>

            <div className="grid grid-cols-4 gap-8 mt-2 w-full">
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
                    {card.jobCount} Jobs
                  </p>
                </Card>
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full mt-6 overflow-y-auto">
              {filteredPostings.map((posting, index) => (
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
                        className={`text-xs mr-3 rounded-full whitespace-nowrap ${
                          posting.category === "IT"
                            ? "text-success-500"
                            : posting.category === "Operations"
                            ? "text-warning-500"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {posting.category}
                      </span>
                      <span
                        className={`text-xs px-2 rounded-full whitespace-nowrap ${
                          posting.status === "active"
                            ? " text-success-500 bg-success-100"
                            : " text-danger-500 bg-danger-100"
                        }`}
                      >
                        {posting.status === "active" ? "Active" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-full text-sm mt-3 text-gray-500">
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon size={18} />
                        <p>{posting.jobprofile}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon size={18} />
                        <p>{posting.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <BanknoteIcon size={18} />
                        <p>
                          {posting.salaryFrom} - {posting.salaryUpto}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <div className="text-sm rounded-full border bg-secondary bg-opacity-5 px-2 py-1">
                      <p className="text-gray-300 text-xs">
                        Open Until {posting.openUntil}
                      </p>
                    </div>
                    <Menu
                      size={28}
                      className="mr-6 cursor-pointer"
                      //onClick={() => handleDetailsClick()}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postings;
