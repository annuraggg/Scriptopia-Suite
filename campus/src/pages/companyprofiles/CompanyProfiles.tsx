import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  Input,
  Button,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner
} from '@nextui-org/react';
import { Search, Plus, MoreVertical, Copy, ArrowLeft, Calendar, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import ax from '@/config/axios';
import CreateCompanyForm from './CreateCompanyForm';

interface Company {
  _id: string;
  name: string;
  description: string;
  generalInfo: {
    yearVisit: string[];
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
    rolesOffered: string[];
  };
  hrContacts: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
  archived?: boolean;
  createdAt: string;
}

interface Filters {
  year: string;
  studentsRange: string;
  averagePackage: string;
  highestPackage: string;
}

const parseRange = (range: string): [number, number] => {
  if (range.endsWith('+')) {
    const start = parseInt(range.slice(0, -1));
    return [start, Infinity];
  }
  const [start, end] = range.split('-').map(num => parseInt(num));
  return [start, end];
};

const formatPackageRange = (range: string): [number, number] => {
  if (!range) return [0, Infinity];
  const [start, end] = range.split('-');
  if (end === '+') {
    return [parseInt(start) * 100000, Infinity];
  }
  return [parseInt(start) * 100000, parseInt(end) * 100000];
};

const CompanyProfiles = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    year: '',
    studentsRange: '',
    averagePackage: '',
    highestPackage: '',
  });
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/companies");
      console.log("API Response:", response.data);

      if (response.data?.data?.companies) {
        setCompanies(response.data.data.companies);
      } else {
        setError("Invalid data format received from server");
        console.error("Invalid data format:", response.data);
      }
    } catch (err) {
      setError("Failed to load companies");
      console.error("Error fetching companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const companyName = company.name || "";
      if (searchTerm && !companyName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      const isArchived = !!company.archived;
      if (filter === "active" && isArchived) return false;
      if (filter === "archived" && !isArchived) return false;

      if (isFiltersApplied) {
        if (filters.year && !company.generalInfo.yearVisit.includes(filters.year)) {
          return false;
        }

        if (filters.studentsRange) {
          const [min, max] = parseRange(filters.studentsRange);
          if (company.generalInfo.studentsHired < min || company.generalInfo.studentsHired > max) {
            return false;
          }
        }

        if (filters.averagePackage) {
          const [min, max] = formatPackageRange(filters.averagePackage);
          if (company.generalInfo.averagePackage < min || company.generalInfo.averagePackage > max) {
            return false;
          }
        }

        if (filters.highestPackage) {
          const [min, max] = formatPackageRange(filters.highestPackage);
          if (company.generalInfo.highestPackage < min || company.generalInfo.highestPackage > max) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      return sort === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [companies, searchTerm, filter, sort, filters, isFiltersApplied]);

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.post("/companies/archive", { id });
      setCompanies(prev => prev.map(company =>
        company._id === id ? { ...company, archived: !company.archived } : company
      ));
    } catch (err) {
      console.error("Error archiving company:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/companies/${id}`);
      setCompanies(prev => prev.filter(company => company._id !== id));
    } catch (err) {
      console.error("Error deleting company:", err);
    }
  };

  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(1)}L`;

  const clearFilters = () => {
    setFilters({
      year: '',
      studentsRange: '',
      averagePackage: '',
      highestPackage: '',
    });
    setIsFiltersApplied(false);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setIsFiltersApplied(true);
  };

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    companies.forEach(company => {
      company.generalInfo.yearVisit.forEach(year => years.add(year));
    });
    return Array.from(years).sort().reverse();
  }, [companies]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCreateForm ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Company Profiles</h1>
                <Button
                  color="primary"
                  startContent={<Plus size={20} />}
                  onClick={() => setShowCreateForm(true)}
                >
                  Create New Profile
                </Button>
              </div>

              <div className="flex gap-8">
                <div className="w-1/4">
                  <Card className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-default-500">Last Visited</label>
                        <Select
                          placeholder="Select Year"
                          value={filters.year}
                          onChange={(e) => handleFilterChange('year', e.target.value)}
                          className="w-full mt-1"
                        >
                          {availableYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-default-500">Students Hired</label>
                        <Select
                          placeholder="Select Range"
                          value={filters.studentsRange}
                          onChange={(e) => handleFilterChange('studentsRange', e.target.value)}
                          className="w-full mt-1"
                        >
                          <SelectItem key="0-50">0-50</SelectItem>
                          <SelectItem key="51-100">51-100</SelectItem>
                          <SelectItem key="100+">100+</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-default-500">Average Package</label>
                        <Select
                          placeholder="Select Range"
                          value={filters.averagePackage}
                          onChange={(e) => handleFilterChange('averagePackage', e.target.value)}
                          className="w-full mt-1"
                        >
                          <SelectItem key="0-10">0-10L</SelectItem>
                          <SelectItem key="10-20">10-20L</SelectItem>
                          <SelectItem key="20+">20L+</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-default-500">Highest Package</label>
                        <Select
                          placeholder="Select Range"
                          value={filters.highestPackage}
                          onChange={(e) => handleFilterChange('highestPackage', e.target.value)}
                          className="w-full mt-1"
                        >
                          <SelectItem key="0-10">0-10L</SelectItem>
                          <SelectItem key="10-20">10-20L</SelectItem>
                          <SelectItem key="20+">20L+</SelectItem>
                        </Select>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          size="sm"
                          variant="light"
                          onClick={clearFilters}
                        >
                          Clear All
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onClick={applyFilters}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="w-3/4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4 items-center">
                      <Select
                        className="w-[200px]"
                        selectedKeys={[sort]}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <SelectItem key="newest">Newest</SelectItem>
                        <SelectItem key="oldest">Oldest</SelectItem>
                      </Select>
                      <Input
                        className="w-[300px]"
                        placeholder="Search Company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startContent={<Search size={20} />}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <Button
                      className={`w-1/3 ${filter === "all" ? "bg-default-100" : ""}`}
                      variant={filter === "all" ? "flat" : "ghost"}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      className={`w-1/3 ${filter === "active" ? "bg-success-100" : ""}`}
                      variant={filter === "active" ? "flat" : "ghost"}
                      onClick={() => setFilter("active")}
                    >
                      Active
                    </Button>
                    <Button
                      className={`w-1/3 ${filter === "archived" ? "bg-default-100" : ""}`}
                      variant={filter === "archived" ? "flat" : "ghost"}
                      onClick={() => setFilter("archived")}
                    >
                      Archived
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Spinner size="lg" />
                    </div>
                  ) : error ? (
                    <div className="bg-danger-50 dark:bg-danger-900 rounded-lg p-8 text-center">
                      <h3 className="text-lg font-medium text-danger-700 dark:text-danger-300 mb-2">
                        Error loading companies
                      </h3>
                      <Button color="primary" onClick={fetchCompanies}>
                        Retry
                      </Button>
                    </div>
                  ) : filteredCompanies.length === 0 ? (
                    <div className="bg-default-50 dark:bg-default-800 rounded-lg p-8 text-center">
                      <h3 className="text-lg font-medium text-default-700 dark:text-default-300 mb-2">
                        No companies found
                      </h3>
                      <p className="text-default-500 dark:text-default-400 mb-6">
                        {searchTerm || isFiltersApplied
                          ? "Try adjusting your search or filters"
                          : "Create your first company profile to get started"}
                      </p>
                      <Button
                        color="primary"
                        startContent={<Plus size={18} />}
                        onClick={() => setShowCreateForm(true)}
                      >
                        Create New Company
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCompanies.map((company) => (
                        <Card
                          key={company._id}
                          className="p-4 cursor-pointer w-full hover:shadow-md transition-shadow"
                          isPressable
                          onClick={() => navigate(`/company/${company._id}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{company.name}</h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${company.archived
                                    ? "bg-default-100 text-default-600"
                                    : "bg-success-100 text-success-600"
                                    }`}
                                >
                                  {company.archived ? "Archived" : "Active"}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs bg-success-100 text-success-600">
                                  Average Package {formatCurrency(company.generalInfo.averagePackage)}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-default-500 mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  <span>Last Visit {company.generalInfo.yearVisit.length > 0 ? company.generalInfo.yearVisit[0] : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users size={16} />
                                  <span>{company.generalInfo.studentsHired} Students Hired</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign size={16} />
                                  <span>Highest Package {formatCurrency(company.generalInfo.highestPackage)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                variant="flat"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(`https://yourwebsite.com/company/${company._id}`);
                                }}
                              >
                                <Copy size={18} />
                              </Button>
                              <Dropdown>
                                <DropdownTrigger>
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical size={20} />
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                  <DropdownItem onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/company/${company._id}/edit`);
                                  } } key={''}>
                                    Edit Profile
                                  </DropdownItem>
                                  <DropdownItem onClick={(e) => handleArchive(company._id, e)} key={''}>
                                    {company.archived ? "Unarchive" : "Archive"}
                                  </DropdownItem>
                                  <DropdownItem
                                    className="text-danger"
                                    color="danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(company._id);
                                    } } key={''}                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <CreateCompanyForm onClose={() => setShowCreateForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyProfiles;