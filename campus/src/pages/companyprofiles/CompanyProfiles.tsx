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
import { Search, Plus, MoreVertical, Calendar, Users, DollarSign, ArrowLeft } from 'lucide-react';
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
  const handleCompanyClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };
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
      // Search filter
      if (searchTerm && !company.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (isFiltersApplied) {
        // Year filter
        if (filters.year && company.lastVisit !== filters.year) {
          return false;
        }

        // Students hired filter
        if (filters.studentsRange) {
          const [min, max] = parseRange(filters.studentsRange);
          if (company.studentsHired < min || company.studentsHired > max) {
            return false;
          }
        }

        // Average package filter
        if (filters.averagePackage) {
          const [min, max] = formatPackageRange(filters.averagePackage);
          if (company.averagePackage < min || company.averagePackage > max) {
            return false;
          }
        }

        // Highest package filter
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

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCreateGroup ? (
            <motion.div
              key="companies-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Company Profiles</h1>
                <div className="flex gap-4 items-center">
                  <Select
                    className="w-32"
                    selectedKeys={[sortBy]}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <SelectItem key="newest">Newest</SelectItem>
                    <SelectItem key="oldest">Oldest</SelectItem>
                  </Select>

                  <div className="w-[400px]">
                    <Input
                      placeholder="Search by Company Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      startContent={<Search className="text-neutral-400" size={20} />}
                      classNames={{
                        input: "bg-neutral-900 text-white",
                        inputWrapper: "bg-neutral-900"
                      }}
                    />
                  </div>

                  <Button
                    color="primary"
                    startContent={<Plus size={20} />}
                    onClick={() => setShowCreateGroup(true)}
                  >
                    Create Company Profile
                  </Button>
                </div>
              </div>

              <div className="flex gap-8">
                {/* Filters Section */}
                <div className="w-1/4">
                  <Card className="bg-neutral-900 p-4">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-neutral-400">Last Visited</label>
                        <Select
                          placeholder="Select Year"
                          value={filters.year}
                          onChange={(e) => handleFilterChange('year', e.target.value)}
                          className="w-full mt-1"
                          classNames={{
                            trigger: "bg-neutral-800",
                          }}
                        >
                          <SelectItem key="2025">2025</SelectItem>
                          <SelectItem key="2024">2024</SelectItem>
                          <SelectItem key="2023">2023</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-neutral-400">Students Hired</label>
                        <Select
                          placeholder="Select Range"
                          value={filters.studentsRange}
                          onChange={(e) => handleFilterChange('studentsRange', e.target.value)}
                          className="w-full mt-1"
                          classNames={{
                            trigger: "bg-neutral-800",
                          }}
                        >
                          <SelectItem key="0-50">0-50</SelectItem>
                          <SelectItem key="51-100">51-100</SelectItem>
                          <SelectItem key="100+">100+</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-neutral-400">Average Package</label>
                        <Select
                          placeholder="Select Range"
                          value={filters.averagePackage}
                          onChange={(e) => handleFilterChange('averagePackage', e.target.value)}
                          className="w-full mt-1"
                          classNames={{
                            trigger: "bg-neutral-800",
                          }}
                        >
                          <SelectItem key="0-10">0-10L</SelectItem>
                          <SelectItem key="10-20">10-20L</SelectItem>
                          <SelectItem key="20+">20L+</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-neutral-400">Highest Package</label>
                        <Select
                          placeholder="Select Range"
                          value={filters.highestPackage}
                          onChange={(e) => handleFilterChange('highestPackage', e.target.value)}
                          className="w-full mt-1"
                          classNames={{
                            trigger: "bg-neutral-800",
                          }}
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
                  {filteredCompanies.map((company) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className="bg-neutral-900 p-4 mb-4 cursor-pointer hover:bg-neutral-800 transition-colors"
                        onClick={() => handleCompanyClick(company.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{company.name}</h3>
                              <span className="px-2 py-1 rounded-full bg-neutral-800 text-xs">
                                Average Package {formatCurrency(company.averagePackage)}
                              </span>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-neutral-400">
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

                          <Dropdown>
                            <DropdownTrigger>
                              <Button isIconOnly variant="light" className="text-neutral-400">
                                <MoreVertical size={20} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              <DropdownItem onClick={() => navigate(`/company/${company.id}/edit`)}>
                                Edit Profile
                              </DropdownItem>
                              <DropdownItem onClick={() => handleCompanyClick(company.id)}>
                                View Details
                              </DropdownItem>
                              <DropdownItem className="text-danger">Delete</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
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
              <div className="mb-4">
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