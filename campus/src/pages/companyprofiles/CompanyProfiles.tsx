import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Card,
} from '@nextui-org/react';
import { Search, Plus, MoreVertical, Calendar, Users, DollarSign, ArrowLeft, Copy } from 'lucide-react';
import CreateCompanyForm from "./CreateCompanyForm";

interface Company {
  id: string;
  name: string;
  lastVisit: string;
  studentsHired: number;
  averagePackage: number;
  highestPackage: number;
}

interface Filters {
  year: string;
  studentsRange: string;
  averagePackage: string;
  highestPackage: string;
}

const companies: Company[] = [
  {
    id: '1',
    name: 'OmniCloud Solutions',
    lastVisit: '2025',
    studentsHired: 75,
    averagePackage: 11000000,
    highestPackage: 20000000,
  },
  {
    id: '2',
    name: 'TechHive Systems',
    lastVisit: '2024',
    studentsHired: 45,
    averagePackage: 9500000,
    highestPackage: 17500000,
  },
  {
    id: '3',
    name: 'BrightEdge Marketing',
    lastVisit: '2024',
    studentsHired: 45,
    averagePackage: 8000000,
    highestPackage: 10500000,
  },
  {
    id: '4',
    name: 'AI Core Analytics',
    lastVisit: '2023',
    studentsHired: 60,
    averagePackage: 8900000,
    highestPackage: 21000000,
  },
  {
    id: '5',
    name: 'Visionary Studios',
    lastVisit: '2023',
    studentsHired: 40,
    averagePackage: 7500000,
    highestPackage: 12500000,
  },
];

const parseRange = (range: string): [number, number] => {
  if (range.endsWith('+')) {
    const start = parseInt(range.slice(0, -1));
    return [start, Infinity];
  }
  const [start, end] = range.split('-').map(num => parseInt(num));
  return [start, end];
};

export default function CompanyProfiles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    year: '',
    studentsRange: '',
    averagePackage: '',
    highestPackage: '',
  });
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "archived">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const formatPackageRange = (range: string): [number, number] => {
    if (!range) return [0, Infinity];
    const [start, end] = range.split('-');
    if (end === '+') {
      return [parseInt(start) * 100000, Infinity];
    }
    return [parseInt(start) * 100000, parseInt(end) * 100000];
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      if (searchTerm && !company.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (isFiltersApplied) {
        if (filters.year && company.lastVisit !== filters.year) {
          return false;
        }

        if (filters.studentsRange) {
          const [min, max] = parseRange(filters.studentsRange);
          if (company.studentsHired < min || company.studentsHired > max) {
            return false;
          }
        }

        if (filters.averagePackage) {
          const [min, max] = formatPackageRange(filters.averagePackage);
          if (company.averagePackage < min || company.averagePackage > max) {
            return false;
          }
        }

        if (filters.highestPackage) {
          const [min, max] = formatPackageRange(filters.highestPackage);
          if (company.highestPackage < min || company.highestPackage > max) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return parseInt(b.lastVisit) - parseInt(a.lastVisit);
      }
      return parseInt(a.lastVisit) - parseInt(b.lastVisit);
    });
  }, [searchTerm, sortBy, filters, isFiltersApplied]);

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

  const handleCompanyClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://yourwebsite.com/company/${id}`);
  };

  const renderCompanyList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading companies...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-danger-50 dark:bg-danger-900 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-danger-700 dark:text-danger-300 mb-2">Error loading companies</h3>
          <p className="text-danger-500 dark:text-danger-400 mb-6">{error}</p>
          <Button color="primary">
            Retry
          </Button>
        </div>
      );
    }

    if (filteredCompanies.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No companies found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || isFiltersApplied
              ? "Try adjusting your search or filters"
              : "Create your first company profile to get started"}
          </p>
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onClick={() => setShowCreateGroup(true)}
          >
            Create Company Profile
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <Card
            key={company.id}
            className="p-4 cursor-pointer w-full hover:shadow-md transition-shadow"
            isPressable
            onClick={() => handleCompanyClick(company.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <span className="px-2 py-1 rounded-full text-xs bg-success-100 text-success-600">
                    Average Package {formatCurrency(company.averagePackage)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-default-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Last Visit {company.lastVisit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{company.studentsHired} Students Hired</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>Highest Package {formatCurrency(company.highestPackage)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  onClick={(e) => handleCopyLink(company.id, e)}
                >
                  <Copy size={18} />
                </Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      variant="flat"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={(key) => {
                    if (key === "edit") {
                      navigate(`/company/${company.id}/edit`);
                      const event = window.event;
                      if (event) {
                        event.stopPropagation();
                      }
                    } else if (key === "delete") {
                      // Handle delete action
                    }
                  }}>
                    <DropdownItem key="edit">Edit Profile</DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCreateGroup ? (
            <motion.div
              key="companies-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Company Profiles</h1>
                <Button
                  color="primary"
                  startContent={<Plus size={20} />}
                  onClick={() => setShowCreateGroup(true)}
                >
                  Create Company Profile
                </Button>
              </div>

              <div className="flex gap-8">
                {/* Filters Section */}
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
                          <SelectItem key="2025">2025</SelectItem>
                          <SelectItem key="2024">2024</SelectItem>
                          <SelectItem key="2023">2023</SelectItem>
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

                {/* Companies List */}
                <div className="w-3/4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4 items-center">
                      <Select
                        className="w-[200px]"
                        selectedKeys={[sortBy]}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <SelectItem key="newest">Newest</SelectItem>
                        <SelectItem key="oldest">Oldest</SelectItem>
                      </Select>

                      <Input
                        className="w-[300px]"
                        placeholder="Search Company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startContent={<Search className="text-default-400" size={20} />}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <Button
                      className={`w-1/3 ${filterStatus === "all" ? "bg-default-100" : ""}`}
                      variant={filterStatus === "all" ? "flat" : "ghost"}
                      onClick={() => setFilterStatus("all")}
                    >
                      All
                    </Button>
                    <Button
                      className={`w-1/3 ${filterStatus === "active" ? "bg-success-100" : ""}`}
                      variant={filterStatus === "active" ? "flat" : "ghost"}
                      onClick={() => setFilterStatus("active")}
                    >
                      Active
                    </Button>
                    <Button
                      className={`w-1/3 ${filterStatus === "archived" ? "bg-default-100" : ""}`}
                      variant={filterStatus === "archived" ? "flat" : "ghost"}
                      onClick={() => setFilterStatus("archived")}
                    >
                      Archived
                    </Button>
                  </div>

                  {renderCompanyList()}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="create-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8">
                <Button
                  variant="light"
                  startContent={<ArrowLeft size={20} />}
                  onClick={() => setShowCreateGroup(false)}
                >
                  Back to Companies
                </Button>
              </div>
              <CreateCompanyForm onClose={() => setShowCreateGroup(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}