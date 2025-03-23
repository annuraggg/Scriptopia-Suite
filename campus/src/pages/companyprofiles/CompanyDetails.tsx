import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import Filter from "./Filter";
import { useAuth } from '@clerk/clerk-react';
import ax from '@/config/axios';
import { CompanyTable } from "./CompanyTable";

const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(1)}L`;

interface CompanyDetail {
  _id: string;
  name: string;
  description?: string;
  generalInfo: {
    industry: string[];
    yearVisit: string[];
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
    rolesOffered: string[];
  };
  stats: {
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: "up" | "down";
  }[];
  hrContacts: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  name: string;
  id: string;
  department: string;
  placed: string;
  package?: string;
  year: string;
}

const useCompanyData = (id: string) => {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const axios = ax(getToken);


  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/companies");
        if (response.data.success) {
          const foundCompany = response.data.data.companies.find(
            (company: CompanyDetail) => company._id === id
          );

          if (foundCompany) {
            foundCompany.stats = [
              {
                title: "Students Hired",
                value: foundCompany.generalInfo.studentsHired.toString(),
                change: "+12.5%",
                icon: Users,
                trend: "up",
              },
              {
                title: "Average Package",
                value: formatCurrency(foundCompany.generalInfo.averagePackage),
                change: "+8.2%",
                icon: Briefcase,
                trend: "up",
              },
              {
                title: "Highest Package",
                value: formatCurrency(foundCompany.generalInfo.highestPackage),
                change: "-2.4%",
                icon: Target,
                trend: "down",
              },
              {
                title: "Placement Rate",
                value: "92%",
                icon: Activity,
                trend: "up",
              },
            ];

            setCompany(foundCompany);
          } else {
            setError("Company not found");
          }
        } else {
          setError(response.data.message || "Failed to fetch company data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  return { company, loading, error };
};

const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudents([
          {
            id: "22204003",
            name: "John C",
            department: "Computer Engineering",
            placed: "2024",
            package: "₹12.5L",
            year: "2024",
          },
          {
            id: "22204007",
            name: "AJ Styles",
            department: "Information Technology",
            placed: "2023",
            package: "₹10.0L",
            year: "2024",
          },
          {
            id: "22204016",
            name: "Randy Orton",
            department: "CSE-AIML",
            placed: "2022",
            package: "₹15.0L",
            year: "2024",
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading, error };
};

const useFilteredStudents = (
  students: Student[],
  searchTerm: string,
  filter: "all" | "placed" | "pending",
  activeFilters: { year: string; departments: string[] },
  sort: string
) => {
  return useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          !searchTerm ||
          student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || student.placed === filter;
        const matchesYear =
          !activeFilters.year || student.year === activeFilters.year;
        const matchesDepartment =
          !activeFilters.departments.length ||
          activeFilters.departments.includes(student.department);

        return (
          matchesSearch && matchesFilter && matchesYear && matchesDepartment
        );
      })
      .sort((a, b) =>
        sort === SORT_OPTIONS.NEWEST
          ? b.year.localeCompare(a.year)
          : a.year.localeCompare(b.year)
      );
  }, [students, searchTerm, filter, activeFilters, sort]);
};

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    company,
    loading: companyLoading,
    error: companyError,
  } = useCompanyData(id!);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudentData();

  const [selected, setSelected] = useState("details");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter] = useState<"all" | "placed" | "pending">("all");
  const [sort, setSort] = useState<
    typeof SORT_OPTIONS.NEWEST | typeof SORT_OPTIONS.OLDEST
  >(SORT_OPTIONS.NEWEST);
  const [activeFilters, setActiveFilters] = useState({
    year: "",
    departments: [] as string[],
  });

  const { getToken } = useAuth();
  const axios = ax(getToken);


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

  const handleDeleteCompany = async () => {
    if (!company) return;
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        const response = await axios.delete(`/companies/${company._id}`);
        if (response.data.success) {
          alert('Company deleted successfully');
          navigate('/companies');
        } else {
          alert(response.data.message || 'Failed to delete company');
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('An error occurred while deleting the company');
      }
    }
  };

  const handleArchiveCompany = async () => {
    if (!company) return;
    try {
      const response = await axios.post('/companies/archive', {
        id: company._id
      });
      if (response.data.success) {
        alert(`Company ${company.archived ? 'unarchived' : 'archived'} successfully`);
        window.location.reload();
      } else {
        alert(response.data.message || 'Failed to update archive status');
      }
    } catch (error) {
      console.error('Error archiving/unarchiving company:', error);
      alert('An error occurred');
    }
  };

  if (companyLoading || studentsLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  if (companyError || studentsError) return <div>Error loading data: {companyError || studentsError}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex items-center justify-between p-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {company.name}
          {company.archived && (
            <Chip className="ml-2" color="warning" size="sm">
              Archived
            </Chip>
          )}
        </h1>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" className="text-neutral-400">
              <MoreVertical size={20} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              onClick={() => navigate(`/company/${company._id}/edit`)}
            >
              Edit Details
            </DropdownItem>
            <DropdownItem
              onClick={handleArchiveCompany}
            >
              {company.archived ? "Unarchive Company" : "Archive Company"}
            </DropdownItem>
            <DropdownItem
              className="text-danger"
              onClick={handleDeleteCompany}
            >
              Delete Company
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Tabs
        selectedKey={selected}
        onSelectionChange={setSelected as any}
        variant="underlined"
        color="primary"
        className="mt-6"
      >
        <Tab key="details" title="Company Details">
          <div className="space-y-6 mt-5">
            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">About</h3>
                <p className="text-default-500 leading-relaxed mx-2">
                  {company.description}
                </p>
              </CardBody>
            </Card>

            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">
                  General Information
                </h3>
                <div className="space-y-6">
                  {/* Industry */}
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-3">Industry</p>
                    <div className="flex flex-wrap gap-2">
                      {company.generalInfo.industry.map((industry) => (
                        <Chip
                          key={industry}
                          variant="dot"
                          color="success"
                          classNames={{
                            base: "text-green-default dark:text-default",
                          }}
                        >
                          {industry}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mx-2">
                      <p className="text-sm text-default-500 mb-1">
                        Year(s) of Visit
                      </p>
                      <p className="text-lg font-semibold">
                        {company.generalInfo.yearVisit.join(", ")}
                      </p>
                    </div>
                    <div className="mx-2">
                      <p className="text-sm text-default-500 mb-1">
                        Total Students Hired
                      </p>
                      <p className="text-lg font-semibold">
                        {company.generalInfo.studentsHired}
                      </p>
                    </div>
                    <div className="mx-2">
                      <p className="text-sm text-default-500 mb-1">
                        Average Package
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(company.generalInfo.averagePackage)}
                      </p>
                    </div>
                    <div className="mx-2">
                      <p className="text-sm text-default-500 mb-1">
                        Highest Package
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(company.generalInfo.highestPackage)}
                      </p>
                    </div>
                  </div>

                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-3">
                      Roles Offered
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {company.generalInfo.rolesOffered?.map((role) => (
                        <Chip
                          key={role}
                          variant="dot"
                          color="success"
                          classNames={{
                            base: "text-green-default dark:text-default",
                          }}
                        >
                          {role}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-default-50 p-2">
              <CardBody>
                <h3 className="text-xl font-semibold mb-4">HR Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Name</p>
                    <p className="text-lg font-semibold">
                      {company.hrContacts.name}
                    </p>
                  </div>
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Phone</p>
                    <p className="text-lg font-semibold">
                      {company.hrContacts.phone}
                    </p>
                  </div>
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Email</p>
                    <p className="text-lg font-semibold">
                      {company.hrContacts.email}
                    </p>
                  </div>
                  <div className="mx-2">
                    <p className="text-sm text-default-500 mb-1">Website</p>
                    <a
                      href={`https://${company.hrContacts.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {company.hrContacts.website}
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="students" title="Candidate Details">
          <div className="flex gap-8 mt-5">
            <div className="w-1/4">
              <Filter
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
            <div className="w-3/4">
              <CompanyTable data={filteredStudents} />
            </div>
          </div>
        </Tab>
      </Tabs>
    </motion.div>
  );
}