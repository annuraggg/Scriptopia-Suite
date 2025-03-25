import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Select,
  SelectItem,
  Input,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import {
  Users,
  Briefcase,
  Target,
  Activity,
  MoreVertical,
  Search,
  Calendar,
  Building,
  UserCheck,
  Link,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { GroupTable } from "./GroupTable"; // Import the GroupTable component

// Types
interface GroupDetail {
  id: string;
  name: string;
  description?: string;
  generalInfo: {
    coordinator: string;
    department: string;
    startDate: string;
    endDate: string;
    totalStudents: number;
    totalCompanies: number;
    placementRate: number;
    averagePackage: number;
  };
  stats: {
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: "up" | "down";
  }[];
  companies: {
    id: string;
    name: string;
    industry: string;
    openings: number;
    package: string;
  }[];
}

interface Student {
  id: string;
  name: string;
  department: string;
  placed: "yes" | "no" | "in-process";
  company?: string;
  package?: string;
  year: string;
}

// Utility Functions
const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(1)}L`;

// Custom Hooks
const useGroupData = (id: string) => {
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        // Mock data - replace with actual API call
        setGroup({
          id: "1",
          name: "Engineering Placements 2025",
          description: "Placement group for B.Tech students graduating in 2025",
          generalInfo: {
            coordinator: "Dr. Rajesh Kumar",
            department: "Training and Placement Cell",
            startDate: "2024-08-15",
            endDate: "2025-04-30",
            totalStudents: 120,
            totalCompanies: 18,
            placementRate: 78,
            averagePackage: 950000,
          },
          stats: [
            {
              title: "Students Placed",
              value: "94/120",
              change: "+8.5%",
              icon: Users,
              trend: "up",
            },
            {
              title: "Companies",
              value: "18",
              change: "+28.6%",
              icon: Building,
              trend: "up",
            },
            {
              title: "Average Package",
              value: "₹9.5L",
              change: "+12.4%",
              icon: Briefcase,
              trend: "up",
            },
            {
              title: "Placement Rate",
              value: "78%",
              change: "+5.1%",
              icon: Activity,
              trend: "up",
            },
          ],
          companies: [
            {
              id: "c1",
              name: "TechSolutions Inc",
              industry: "IT Services",
              openings: 12,
              package: "₹12.5L",
            },
            {
              id: "c2",
              name: "DataVision Analytics",
              industry: "Data Science",
              openings: 5,
              package: "₹14.0L",
            },
            {
              id: "c3",
              name: "CloudNine Systems",
              industry: "Cloud Computing",
              openings: 8,
              package: "₹10.8L",
            },
          ],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  return { group, loading, error };
};

const useStudentData = (groupId: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Mock data - replace with actual API call
        setStudents([
          {
            id: "22204003",
            name: "Priya Sharma",
            department: "Computer Engineering",
            placed: "yes",
            company: "TechSolutions Inc",
            package: "₹12.5L",
            year: "2025",
          },
          {
            id: "22204007",
            name: "Rahul Patel",
            department: "Information Technology",
            placed: "in-process",
            company: "DataVision Analytics",
            year: "2025",
          },
          {
            id: "22204016",
            name: "Ananya Singh",
            department: "CSE-AIML",
            placed: "yes",
            company: "CloudNine Systems",
            package: "₹10.8L",
            year: "2025",
          },
          {
            id: "22204023",
            name: "Arjun Mehta",
            department: "Electronics",
            placed: "no",
            year: "2025",
          },
          {
            id: "22204031",
            name: "Divya Reddy",
            department: "Mechanical Engineering",
            placed: "yes",
            company: "BuildTech Solutions",
            package: "₹9.2L",
            year: "2025",
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [groupId]);

  return { students, loading, error };
};

const useFilteredStudents = (
  students: Student[],
  searchTerm: string,
  filter: "all" | "placed" | "unplaced" | "in-process",
  activeFilters: { year: string; departments: string[] },
  sort: "newest" | "oldest"
) => {
  return useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          !searchTerm ||
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
          filter === "all" || 
          (filter === "placed" && student.placed === "yes") ||
          (filter === "unplaced" && student.placed === "no") ||
          (filter === "in-process" && student.placed === "in-process");
        
        const matchesYear =
          !activeFilters.year || student.year === activeFilters.year;
        
        const matchesDepartment =
          !activeFilters.departments.length ||
          activeFilters.departments.includes(student.department);

        return matchesSearch && matchesFilter && matchesYear && matchesDepartment;
      })
      .sort((a, b) =>
        sort === "newest"
          ? b.id.localeCompare(a.id)
          : a.id.localeCompare(b.id)
      );
  }, [students, searchTerm, filter, activeFilters, sort]);
};

// Main Component
const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    group,
    loading: groupLoading,
    error: groupError,
  } = useGroupData(id || "1");
  
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudentData(id || "1");

  const [selected, setSelected] = useState("details");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "placed" | "unplaced" | "in-process">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [activeFilters, setActiveFilters] = useState({
    year: "",
    departments: [] as string[],
  });

  const filteredStudents = useFilteredStudents(
    students,
    searchTerm,
    filter,
    activeFilters,
    sort
  );

  const handleFilterChange = (newFilters: {
    year: string;
    departments: string[];
  }) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({ year: "", departments: [] });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (groupLoading || studentsLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  if (groupError || studentsError) return <div>Error loading data</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Group Header */}
      <div className="flex items-center justify-between p-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {group.name}
        </h1>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" className="text-neutral-400">
              <MoreVertical size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={() => navigate(`/groups/${group.id}/edit`)}>
              Edit Group
            </DropdownItem>
            <DropdownItem className="text-danger">Delete Group</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {group.stats.map((stat, index) => (
          <Card key={index} className="bg-default-50">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <stat.icon size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-small text-default-500">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <Chip
                    size="sm"
                    color={stat.trend === "up" ? "success" : "danger"}
                    variant="flat"
                    className="text-xs"
                  >
                    {stat.change}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        selectedKey={selected}
        onSelectionChange={setSelected as any}
        variant="underlined"
        color="primary"
        className="mt-6"
      >
        {/* Group Details Tab */}
        <Tab key="details" title="Group Details">
          <div className="space-y-6 mt-5">
            {/* Group Information Display */}
            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Group Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Group Name</p>
                    <p className="text-base font-medium">{group.name}</p>
                  </div>
                  
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">College Batch</p>
                    <p className="text-base font-medium">2023-24</p>
                  </div>
                  
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Academic Year</p>
                    <p className="text-base font-medium">2024</p>
                  </div>
                  
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Start Year</p>
                    <p className="text-base font-medium">2023</p>
                  </div>
                  
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">End Year</p>
                    <p className="text-base font-medium">2024</p>
                  </div>
                  
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Department</p>
                    <p className="text-base font-medium">CE</p>
                  </div>
                  
                  <div className="mx-2 md:col-span-2">
                    <p className="text-sm text-default-500 mb-1">Group Purpose</p>
                    <p className="text-base font-medium">Organizing placement activities for final-year students</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Group Access Display */}
            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Group Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Group Expiry Date & Time</p>
                    <p className="text-base font-medium">30-04-2025 23:59</p>
                  </div>
                  
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Access Type</p>
                    <p className="text-base font-medium">Private</p>
                  </div>
                  
                  <div className="mx-2 md:col-span-2">
                    <p className="text-sm text-default-500 mb-1">Invite Link</p>
                    <div className="flex gap-2 items-center">
                      <div className="flex items-center gap-2 border rounded-md p-2 bg-default-100 max-w-lg">
                        <Link size={16} className="text-default-500" />
                        <p className="text-sm truncate">https://scriptopiacampus.com/groups/{group.name.toLowerCase().replace(/\s+/g, '-')}</p>
                      </div>
                      <Button size="sm" color="primary">Copy</Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            {/* Additional sections can continue below if needed */}
            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Participating Companies</h3>
                <div className="space-y-3">
                  {group.companies.map((company) => (
                    <Card key={company.id} className="border border-default-200">
                      <CardBody className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{company.name}</p>
                            <p className="text-small text-default-500">{company.industry}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-small text-default-500">Openings</p>
                              <p className="font-semibold">{company.openings}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-small text-default-500">Package</p>
                              <p className="font-semibold">{company.package}</p>
                            </div>
                            <Button size="sm" variant="flat" color="primary">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button variant="light" color="primary">
                    View All Companies
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* Students Tab */}
        <Tab key="students" title="Student Details">
          <div className="mt-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search size={18} />}
                  className="w-64"
                />
                <Select 
                  label="Filter"
                  className="w-40"
                  selectedKeys={[filter]}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <SelectItem key="all" value="all">All Students</SelectItem>
                  <SelectItem key="placed" value="placed">Placed</SelectItem>
                  <SelectItem key="unplaced" value="unplaced">Unplaced</SelectItem>
                  <SelectItem key="in-process" value="in-process">In Process</SelectItem>
                </Select>
                <Select 
                  label="Sort"
                  className="w-40"
                  selectedKeys={[sort]}
                  onChange={(e) => setSort(e.target.value as any)}
                >
                  <SelectItem key="newest" value="newest">Newest</SelectItem>
                  <SelectItem key="oldest" value="oldest">Oldest</SelectItem>
                </Select>
              </div>
              <Button color="primary">
                Add Student
              </Button>
            </div>
            
            {/* Replace the existing table with GroupTable component */}
            <GroupTable 
              students={filteredStudents} 
              emptyContent="No students found matching your filters"
            />
          </div>
        </Tab>
      </Tabs>
    </motion.div>
  );
};

export default GroupDetails;