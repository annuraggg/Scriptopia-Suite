import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Spinner,
} from "@nextui-org/react";
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import CreateCompanyForm from "./CreateCompanyForm";
import EditCompanyModal from "./EditCompanyModal";
import { Company } from "@shared-types/Company";

interface Filters {
  year: string;
  studentsRange: string;
  averagePackage: string;
  highestPackage: string;
}

const parseRange = (range: string): [number, number] => {
  if (range.endsWith("+")) {
    const start = parseInt(range.slice(0, -1));
    return [start, Infinity];
  }
  const [start, end] = range.split("-").map((num) => parseInt(num));
  return [start, end];
};

const formatPackageRange = (range: string): [number, number] => {
  if (!range) return [0, Infinity];
  const [start, end] = range.split("-");
  if (end === "+") {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [refetchCompanies, setRefetchCompanies] = useState(false);

  // Loading states for different operations
  const [isDeleting, setIsDeleting] = useState(false);
  const [archivingCompanyId, setArchivingCompanyId] = useState<string | null>(
    null
  );
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [isClearingFilters, setIsClearingFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    year: "",
    studentsRange: "",
    averagePackage: "",
    highestPackage: "",
  });
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  // Helper functions for getting metrics from yearStats array
  const getTotalStudentsHired = (company: Company): number => {
    return company.generalInfo.yearStats.reduce(
      (total, stat) => total + stat.hired,
      0
    );
  };

  const getAveragePackage = (company: Company): number => {
    const stats = company.generalInfo.yearStats;
    if (stats.length === 0) return 0;

    // Calculate weighted average based on number of students hired per year
    const totalStudents = stats.reduce((sum, stat) => sum + stat.hired, 0);
    if (totalStudents === 0) return 0;

    const weightedSum = stats.reduce(
      (sum, stat) => sum + stat.average * stat.hired,
      0
    );

    return weightedSum / totalStudents;
  };

  const getHighestPackage = (company: Company): number => {
    const stats = company.generalInfo.yearStats;
    if (stats.length === 0) return 0;
    return Math.max(...stats.map((stat) => stat.highest));
  };

  const getYearsOfVisit = (company: Company): string[] => {
    return company.generalInfo.yearStats.map((stat) => stat.year);
  };

  const getMostRecentYear = (company: Company): string => {
    const years = getYearsOfVisit(company);
    return years.length > 0 ? years.sort().reverse()[0] : "N/A";
  };

  // Helper function to show error messages
  const showError = (err: any, defaultMessage: string) => {
    let message = defaultMessage;
    if (err?.response?.data?.message) {
      message = err.response.data.message;
    }
    toast.error(message);
  };

  const fetchCompanies = async () => {
    setIsLoading(true);
    axios
      .get("/companies")
      .then((response) => {
        if (response.data?.data?.companies) {
          setCompanies(response.data.data.companies);
          setError(null);
        } else {
          setError("Invalid data format received from server");
          console.error("Invalid data format:", response.data);
          toast.error("Invalid data format received from server");
        }
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message || "Failed to load companies";
        setError(errorMessage);
        console.error("Error fetching companies:", err);
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, [refetchCompanies]);

  const refreshCompanies = async () => {
    try {
      setIsRefreshing(true);
      await fetchCompanies();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const companyName = company.name || "";
        if (
          searchTerm &&
          !companyName.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        const isArchived = !!company.isArchived;
        if (filter === "active" && isArchived) return false;
        if (filter === "archived" && !isArchived) return false;

        if (isFiltersApplied) {
          // Filter by year
          if (
            filters.year &&
            !getYearsOfVisit(company).includes(filters.year)
          ) {
            return false;
          }

          // Filter by students range
          if (filters.studentsRange) {
            const [min, max] = parseRange(filters.studentsRange);
            const totalHired = getTotalStudentsHired(company);
            if (totalHired < min || totalHired > max) {
              return false;
            }
          }

          // Filter by average package
          if (filters.averagePackage) {
            const [min, max] = formatPackageRange(filters.averagePackage);
            const avgPackage = getAveragePackage(company);
            if (avgPackage < min || avgPackage > max) {
              return false;
            }
          }

          // Filter by highest package
          if (filters.highestPackage) {
            const [min, max] = formatPackageRange(filters.highestPackage);
            const highestPackage = getHighestPackage(company);
            if (highestPackage < min || highestPackage > max) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        return sort === "newest"
          ? new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          : new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
      });
  }, [companies, searchTerm, filter, sort, filters, isFiltersApplied]);

  const handleArchive = async (id: string) => {
    try {
      setArchivingCompanyId(id);
      const company = companies.find((c) => c._id === id);
      const isCurrentlyArchived = !!company?.isArchived;

      await axios.post("/companies/archive", { id });

      // Update the local state immediately
      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id
            ? { ...company, isArchived: !company.isArchived }
            : company
        )
      );

      toast.success(
        `Company ${
          isCurrentlyArchived ? "unarchived" : "archived"
        } successfully`
      );
    } catch (err) {
      console.error("Error archiving company:", err);
      showError(err, "Failed to archive company");
      // Refresh companies to ensure state is synced with server
      refreshCompanies();
    } finally {
      setArchivingCompanyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/companies/${id}`);

      // Update local state
      setCompanies((prev) => prev.filter((company) => company._id !== id));
      setShowDeleteModal(false);
      setCompanyToDelete(null);
      toast.success("Company deleted successfully");
    } catch (err) {
      console.error("Error deleting company:", err);
      showError(err, "Failed to delete company");
      // Refresh companies to ensure state is synced with server
      refreshCompanies();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setRefetchCompanies(true); // Refresh companies after editing
    setShowEditModal(false);
    setCompanyToEdit(null);
    toast.success("Company updated successfully");
  };

  const formatCurrency = (amount: number) =>
    `₹${(amount / 100000).toFixed(1)}L`;

  const clearFilters = async () => {
    try {
      setIsClearingFilters(true);
      setFilters({
        year: "",
        studentsRange: "",
        averagePackage: "",
        highestPackage: "",
      });
      setIsFiltersApplied(false);
      toast.success("Filters cleared");
    } catch (err) {
      console.error("Error clearing filters:", err);
      showError(err, "Failed to clear filters");
    } finally {
      setIsClearingFilters(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = async () => {
    try {
      setIsApplyingFilters(true);
      setIsFiltersApplied(true);
      toast.success("Filters applied");
    } catch (err) {
      console.error("Error applying filters:", err);
      showError(err, "Failed to apply filters");
    } finally {
      setIsApplyingFilters(false);
    }
  };

  // Get all unique years from all companies' yearStats
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    companies.forEach((company) => {
      company.generalInfo.yearStats.forEach((stat) => years.add(stat.year));
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
                <h1 className="text-2xl font-bold">
                  Company Profiles
                  {isRefreshing && <Spinner size="sm" className="ml-2" />}
                </h1>
                <div className="flex gap-2">
                  <Button
                    variant="bordered"
                    onClick={refreshCompanies}
                    isLoading={isRefreshing}
                    isDisabled={isLoading}
                  >
                    Refresh
                  </Button>
                  <Button
                    color="primary"
                    startContent={<Plus size={20} />}
                    onClick={() => setShowCreateForm(true)}
                  >
                    Create New Profile
                  </Button>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-1/4">
                  <Card className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-default-500">
                          Last Visited
                        </label>
                        <Select
                          placeholder="Select Year"
                          value={filters.year}
                          onChange={(e) =>
                            handleFilterChange("year", e.target.value)
                          }
                          className="w-full mt-1"
                          isDisabled={isApplyingFilters || isClearingFilters}
                        >
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-default-500">
                          Students Hired
                        </label>
                        <Select
                          placeholder="Select Range"
                          value={filters.studentsRange}
                          onChange={(e) =>
                            handleFilterChange("studentsRange", e.target.value)
                          }
                          className="w-full mt-1"
                          isDisabled={isApplyingFilters || isClearingFilters}
                        >
                          <SelectItem key="0-50">0-50</SelectItem>
                          <SelectItem key="51-100">51-100</SelectItem>
                          <SelectItem key="100+">100+</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-default-500">
                          Average Package
                        </label>
                        <Select
                          placeholder="Select Range"
                          value={filters.averagePackage}
                          onChange={(e) =>
                            handleFilterChange("averagePackage", e.target.value)
                          }
                          className="w-full mt-1"
                          isDisabled={isApplyingFilters || isClearingFilters}
                        >
                          <SelectItem key="0-10">0-10L</SelectItem>
                          <SelectItem key="10-20">10-20L</SelectItem>
                          <SelectItem key="20+">20L+</SelectItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-default-500">
                          Highest Package
                        </label>
                        <Select
                          placeholder="Select Range"
                          value={filters.highestPackage}
                          onChange={(e) =>
                            handleFilterChange("highestPackage", e.target.value)
                          }
                          className="w-full mt-1"
                          isDisabled={isApplyingFilters || isClearingFilters}
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
                          isLoading={isClearingFilters}
                          isDisabled={isApplyingFilters || isClearingFilters}
                        >
                          Clear All
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onClick={applyFilters}
                          isLoading={isApplyingFilters}
                          isDisabled={isApplyingFilters || isClearingFilters}
                        >
                          {isApplyingFilters ? "Applying..." : "Apply Filters"}
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
                      className={`w-1/3 ${
                        filter === "all" ? "bg-default-100" : ""
                      }`}
                      variant={filter === "all" ? "flat" : "ghost"}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      className={`w-1/3 ${
                        filter === "active" ? "bg-success-100" : ""
                      }`}
                      variant={filter === "active" ? "flat" : "ghost"}
                      onClick={() => setFilter("active")}
                    >
                      Active
                    </Button>
                    <Button
                      className={`w-1/3 ${
                        filter === "archived" ? "bg-default-100" : ""
                      }`}
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
                      <p className="text-danger-600 dark:text-danger-400 mb-4">
                        {error}
                      </p>
                      <Button
                        color="primary"
                        onClick={refreshCompanies}
                        isLoading={isRefreshing}
                      >
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
                          onClick={() => navigate(`/companies/${company._id}`)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {company.name}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    company.isArchived
                                      ? "bg-default-100 text-default-600"
                                      : "bg-success-100 text-success-600"
                                  }`}
                                >
                                  {company.isArchived ? "Archived" : "Active"}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs bg-success-100 text-success-600">
                                  Average Package{" "}
                                  {formatCurrency(getAveragePackage(company))}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-default-500 mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  <span>
                                    Last Visit {getMostRecentYear(company)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users size={16} />
                                  <span>
                                    {getTotalStudentsHired(company)} Students
                                    Hired
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign size={16} />
                                  <span>
                                    Highest Package{" "}
                                    {formatCurrency(getHighestPackage(company))}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 items-center justify-center">
                              <Dropdown>
                                <DropdownTrigger>
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    onClick={(e) => e.stopPropagation()}
                                    isDisabled={
                                      archivingCompanyId === company._id
                                    }
                                  >
                                    {archivingCompanyId === company._id ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <MoreVertical size={20} />
                                    )}
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                  onAction={(key) => {
                                    if (key === "edit") {
                                      setCompanyToEdit(company);
                                      setShowEditModal(true);
                                    } else if (key === "archive") {
                                      handleArchive(company._id!);
                                    } else if (key === "delete") {
                                      setCompanyToDelete(company._id!);
                                      setShowDeleteModal(true);
                                    }
                                  }}
                                  disabledKeys={[
                                    ...(company.isArchived ? ["edit"] : []), // Disable edit for archived companies
                                    ...(archivingCompanyId === company._id
                                      ? ["edit", "archive", "delete"]
                                      : []),
                                  ]}
                                >
                                  {!company.isArchived ? (
                                    <DropdownItem key="edit">
                                      Edit Profile
                                    </DropdownItem>
                                  ) : null}
                                  <DropdownItem key="archive">
                                    {company.isArchived
                                      ? "Unarchive"
                                      : "Archive"}
                                  </DropdownItem>
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

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this company? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="flat"
                onClick={() => setShowDeleteModal(false)}
                isDisabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isDeleting}
                onClick={() => {
                  if (companyToDelete) {
                    handleDelete(companyToDelete);
                  }
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showEditModal && companyToEdit && !companyToEdit.isArchived && (
        <EditCompanyModal
          company={companyToEdit}
          onClose={() => {
            setShowEditModal(false);
            setCompanyToEdit(null);
          }}
          onSave={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default CompanyProfiles;
