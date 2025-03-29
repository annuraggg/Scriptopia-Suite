import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
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
import { Users, Briefcase, Activity, Building, MoreVertical, Search, Link, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { GroupTable } from "./GroupTable";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";

interface GroupDetail {
  _id: string;
  name: string;
  startYear: string;
  endYear: string;
  departments: string[];
  purpose: string;
  expiryDate: string;
  expiryTime: string;
  accessType: "public" | "private";
  archived?: boolean;
  createdAt: string;
}

interface Department {
  _id: string;
  name: string;
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

const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(1)}L`;

const useGroupData = (id: string) => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`/placementgroups/${id}`);
        if (response.data?.success) {
          setGroup(response.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGroup();
  }, [id]);

  return { group, loading, error };
};

const useInstituteData = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/placementgroups");
        if (response.data?.success) {
          setDepartments(response.data.data.departments);
        }
      } catch (err) {
        console.error("Failed to fetch institute data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { departments, loading };
};

const useStudentData = (groupId: string) => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syntheticStudents: Student[] = [
    {
      id: "S001",
      name: "Aarav Sharma",
      department: "CS",
      placed: "yes",
      company: "Google",
      package: "3000000",
      year: "2023"
    },
    {
      id: "S002",
      name: "Neha Gupta",
      department: "IT",
      placed: "in-process",
      company: "Microsoft",
      package: "2800000",
      year: "2024"
    },
    {
      id: "S003",
      name: "Rohan Patel",
      department: "ECE",
      placed: "no",
      year: "2023"
    },
    {
      id: "S004",
      name: "Priya Singh",
      department: "ME",
      placed: "yes",
      company: "Amazon",
      package: "3200000",
      year: "2024"
    },
    {
      id: "S005",
      name: "Vikram Joshi",
      department: "CS",
      placed: "in-process",
      company: "Infosys",
      package: "2500000",
      year: "2023"
    },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setStudents(syntheticStudents);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (groupId) fetchStudents();
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
        const matchesSearch = !searchTerm ||
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === "all" ||
          (filter === "placed" && student.placed === "yes") ||
          (filter === "unplaced" && student.placed === "no") ||
          (filter === "in-process" && student.placed === "in-process");

        const matchesYear = !activeFilters.year || student.year === activeFilters.year;
        const matchesDepartment = !activeFilters.departments.length ||
          activeFilters.departments.includes(student.department);

        return matchesSearch && matchesFilter && matchesYear && matchesDepartment;
      })
      .sort((a, b) => sort === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  }, [students, searchTerm, filter, activeFilters, sort]);
};

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { group, loading: groupLoading, error: groupError } = useGroupData(id || "");
  const { departments, loading: instituteLoading } = useInstituteData();
  const { students, loading: studentsLoading, error: studentsError } = useStudentData(id || "");
  const [selected, setSelected] = useState("details");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "placed" | "unplaced" | "in-process">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [activeFilters, setActiveFilters] = useState({ year: "", departments: [] as string[] });

  const filteredStudents = useFilteredStudents(students, searchTerm, filter, activeFilters, sort);

  const getDepartmentNames = (deptIds: string[]) => {
    return deptIds.map(id =>
      departments.find(d => d._id === id)?.name || id
    ).join(", ");
  };

  if (groupLoading || studentsLoading || instituteLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (groupError || studentsError) return <div>Error loading data</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
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
            <DropdownItem onClick={() => navigate(`/groups/${group._id}/edit`)}>
              Edit Group
            </DropdownItem>
            <DropdownItem className="text-danger">Delete Group</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="bg-default-50">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-small text-default-500">Total Students</p>
              <p className="text-xl font-semibold">{students.length}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Tabs selectedKey={selected} onSelectionChange={setSelected as any} variant="underlined" color="primary" className="mt-6">
        <Tab key="details" title="Group Details">
          <div className="space-y-6 mt-5">
            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Group Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Group Name</p>
                    <p className="text-base font-medium">{group.name}</p>
                  </div>
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Academic Year</p>
                    <p className="text-base font-medium">{group.startYear} - {group.endYear}</p>
                  </div>
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Departments</p>
                    <p className="text-base font-medium">{getDepartmentNames(group.departments)}</p>
                  </div>
                  <div className="mx-2 md:col-span-2">
                    <p className="text-sm text-default-500 mb-1">Group Purpose</p>
                    <p className="text-base font-medium">{group.purpose}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">Group Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Group Expiry</p>
                    <p className="text-base font-medium">{group.expiryDate} {group.expiryTime}</p>
                  </div>
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Access Type</p>
                    <p className="text-base font-medium capitalize">{group.accessType}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

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
              <Button color="primary">Add Student</Button>
            </div>

            <GroupTable
              data={filteredStudents}
              emptyContent="No students found matching your filters"
            />
          </div>
        </Tab>
      </Tabs>
    </motion.div>
  );
};

export default GroupDetails;