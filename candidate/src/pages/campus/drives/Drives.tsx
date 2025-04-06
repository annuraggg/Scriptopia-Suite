import { useEffect, useState, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider,
  Input,
  Slider,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import {
  Search,
  Briefcase,
  MapPin,
  Users,
  X,
  CalendarClock,
  Building2,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Delta } from "quill";

import Loader from "@/components/Loader";
import ax from "@/config/axios";
import RootContext from "@/types/RootContext";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";

// Type definitions
type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary";
type JobStatus =
  | "applied"
  | "inprogress"
  | "hired"
  | "rejected"
  | "disqualified";

const JOB_TYPE_COLORS: Record<JobType, string> = {
  full_time: "success",
  part_time: "primary",
  contract: "secondary",
  internship: "warning",
  temporary: "danger",
};

const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  applied: "primary",
  inprogress: "warning",
  hired: "success",
  rejected: "danger",
  disqualified: "danger",
};

/**
 * Home Component - Job listings with search and filters
 */
const Home = () => {
  const { user } = useOutletContext<RootContext>();
  const [postings, setPostings] = useState<ExtendedPosting[]>([]);
  const [filteredPostings, setFilteredPostings] = useState<ExtendedPosting[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    0, 1000000,
  ]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const { getToken } = useAuth();
  const navigate = useNavigate();
  const axios = ax(getToken);

  // Fetch job postings on component mount
  useEffect(() => {
    fetchPostings();
  }, []);

  // Apply filters when filter values or postings change
  useEffect(() => {
    applyFilters();
  }, [selectedJobTypes, salaryRange, postings, searchQuery]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPostings]);

  /**
   * Fetch job postings from API
   */
  const fetchPostings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/drives/candidate");

      if (response.data?.data) {
        setPostings(response.data.data.drives || []);
        setFilteredPostings(response.data.data.drives || []);
      } else {
        setError("No job listings available");
      }
    } catch (err) {
      console.error("Failed to fetch job postings:", err);
      setError("Failed to load job listings. Please try again later.");
      setPostings([]);
      setFilteredPostings([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to job postings
   */
  const applyFilters = () => {
    let filtered = [...postings];

    // Apply job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((posting) =>
        selectedJobTypes.includes(posting.type.toLowerCase() as JobType)
      );
    }

    // Apply salary filter
    filtered = filtered.filter((posting) => {
      const minSalary = posting.salary?.min || 0;
      const maxSalary = posting.salary?.max || 0;

      // Include jobs with overlapping salary ranges
      return (
        (minSalary >= salaryRange[0] && minSalary <= salaryRange[1]) ||
        (maxSalary >= salaryRange[0] && maxSalary <= salaryRange[1]) ||
        (minSalary <= salaryRange[0] && maxSalary >= salaryRange[1])
      );
    });

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (posting) =>
          posting.title.toLowerCase().includes(query) ||
          posting.organizationId?.name?.toLowerCase().includes(query) ||
          posting.location?.toLowerCase().includes(query)
      );
    }

    setFilteredPostings(filtered);
  };

  /**
   * Handle job type selection change
   */
  const handleJobTypeChange = (values: string[]) => {
    setSelectedJobTypes(values as JobType[]);
  };

  /**
   * Handle salary range change
   */
  const handleSalaryChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setSalaryRange(value as [number, number]);
    }
  };

  /**
   * Reset all filters
   */
  const clearFilters = () => {
    setSelectedJobTypes([]);
    setSalaryRange([0, 1000000]);
    setSearchQuery("");
  };

  /**
   * Format job type display text
   */
  const normalizeText = (text: string): string => {
    if (!text) return "N/A";
    const titleCase =
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    return titleCase.replace(/_/g, " ");
  };

  /**
   * Calculate days since posting
   */
  const getAgoDays = (dateString: string | Date): string => {
    if (!dateString) return "Recently";

    try {
      const today = new Date();
      const createdAt = new Date(dateString);
      const diffTime = Math.abs(today.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} days ago`;
    } catch (e) {
      return "Recently";
    }
  };

  /**
   * Get application status for a job posting
   */
  const getStatus = (postingId?: string): JobStatus => {
    if (!postingId || !user?.appliedDrives?.length) return "rejected";

    const appliedDrive = user.appliedDrives.find(
      (drive) => drive.drive === postingId
    );

    return (appliedDrive?.status as JobStatus) || "rejected";
  };

  /**
   * Format salary range for display
   */
  const formatSalary = (salary?: {
    min?: number;
    max?: number;
    currency?: string;
  }): string => {
    if (!salary?.min && !salary?.max) return "Salary not specified";

    const currency = salary.currency?.toUpperCase() || "USD";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });

    if (salary.min && salary.max) {
      return `${formatter.format(salary.min)} - ${formatter.format(
        salary.max
      )}`;
    } else if (salary.min) {
      return `From ${formatter.format(salary.min)}`;
    } else if (salary.max) {
      return `Up to ${formatter.format(salary.max)}`;
    }

    return "Salary not specified";
  };

  /**
   * Format description text from Delta format
   */
  const formatDescription = (description?: Delta): string => {
    if (!description?.ops) return "No description provided";

    try {
      return description.ops
        .map((op) => op.insert?.toString() || "")
        .join("")
        .trim()
        .replace(/\n+/g, " ");
    } catch (e) {
      return "No description provided";
    }
  };

  // Pagination logic
  const paginatedPostings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPostings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPostings, currentPage]);

  const totalPages = Math.ceil(filteredPostings.length / itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Explore Opportunities
            </h1>
            <p className="text-gray-500 mt-1">
              {filteredPostings.length}{" "}
              {filteredPostings.length === 1 ? "job" : "jobs"} available
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - visible on mobile when toggled */}
          <div
            className={`
            md:w-72 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300
            ${
              isFilterVisible
                ? "max-h-[1500px] opacity-100 mb-6 md:mb-0"
                : "max-h-0 md:max-h-[1500px] opacity-0 md:opacity-100"
            }
          `}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={clearFilters}
                    className="font-medium"
                  >
                    Clear all
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="md:hidden"
                    onPress={() => setIsFilterVisible(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <Input
                  label="Search jobs"
                  placeholder="Job title, company, location..."
                  startContent={<Search size={16} className="text-gray-400" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "border-gray-200 shadow-sm",
                  }}
                  onClear={() => setSearchQuery("")}
                />
              </div>

              <Divider className="my-4" />

              {/* Job Type */}
              <div className="my-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">
                  Job Type
                </h3>
                <CheckboxGroup
                  value={selectedJobTypes}
                  onChange={handleJobTypeChange}
                  className="gap-2"
                >
                  <Checkbox value="full_time">
                    <span className="text-sm">Full Time</span>
                  </Checkbox>
                  <Checkbox value="part_time">
                    <span className="text-sm">Part Time</span>
                  </Checkbox>
                  <Checkbox value="contract">
                    <span className="text-sm">Contract</span>
                  </Checkbox>
                  <Checkbox value="internship">
                    <span className="text-sm">Internship</span>
                  </Checkbox>
                  <Checkbox value="temporary">
                    <span className="text-sm">Temporary</span>
                  </Checkbox>
                </CheckboxGroup>
              </div>

              <Divider className="my-4" />

              {/* Salary Range */}
              <div className="my-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">
                  Salary Range
                </h3>
                <Slider
                  value={salaryRange}
                  onChange={handleSalaryChange}
                  label="Salary"
                  maxValue={1000000}
                  minValue={0}
                  step={10000}
                  formatOptions={{ style: "currency", currency: "USD" }}
                  className="my-2 w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(salaryRange[0])}
                  </span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(salaryRange[1])}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job listings */}
          <div className="flex-1">
            {error ? (
              <Card className="w-full shadow-sm mb-6">
                <CardBody className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-3">{error}</p>
                  <Button color="primary" onClick={fetchPostings}>
                    Try Again
                  </Button>
                </CardBody>
              </Card>
            ) : filteredPostings.length === 0 ? (
              <Card className="w-full shadow-sm mb-6">
                <CardBody className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Briefcase size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mb-4 text-center">
                    We couldn't find any jobs matching your criteria.
                  </p>
                  <Button color="primary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                {paginatedPostings.map((posting) => (
                  <Card
                    key={posting._id}
                    className="shadow-sm hover:shadow-md transition-shadow border-none"
                    isPressable
                    onPress={() => navigate(`${posting._id}`)}
                  >
                    <CardBody className="p-5">
                      <div className="flex mb-4">
                        <div
                          className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 mr-4"
                          style={{
                            backgroundImage: posting?.organizationId?.logo
                              ? `url(${posting.organizationId.logo})`
                              : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {!posting?.organizationId?.logo && (
                            <Building2 className="w-full h-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-1">
                            {posting?.title || "Untitled Position"}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="line-clamp-1 mr-2">
                              {posting?.organizationId?.name ||
                                "Unknown Organization"}
                            </span>
                            <Users size={14} className="mr-1" />
                            <span>
                              {posting?.candidates?.length || 0} applicants
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 my-3">
                        {posting?.type && (
                          <Tooltip
                            content={`Job Type: ${normalizeText(posting.type)}`}
                          >
                            <Chip
                              color={
                                JOB_TYPE_COLORS[
                                  posting.type.toLowerCase() as JobType
                                ] as "primary" | "default" | "secondary" | "success" | "warning" | "danger" || "default"
                              }
                              variant="flat"
                              size="sm"
                              startContent={<Briefcase size={14} />}
                              className="h-6"
                            >
                              {normalizeText(posting.type)}
                            </Chip>
                          </Tooltip>
                        )}

                        {posting?.location && (
                          <Tooltip content={`Location: ${posting.location}`}>
                            <Chip
                              color="default"
                              variant="flat"
                              size="sm"
                              startContent={<MapPin size={14} />}
                              className="h-6"
                            >
                              {posting.location}
                            </Chip>
                          </Tooltip>
                        )}

                        {posting?.openings && (
                          <Tooltip
                            content={`${posting.openings} positions available`}
                          >
                            <Chip
                              color="secondary"
                              variant="flat"
                              size="sm"
                              className="h-6"
                            >
                              {posting.openings}{" "}
                              {posting.openings === 1 ? "Opening" : "Openings"}
                            </Chip>
                          </Tooltip>
                        )}

                        <Tooltip
                          content={`Application status: ${normalizeText(
                            getStatus(posting._id)
                          )}`}
                        >
                          <Chip
                            variant="flat"
                            size="sm"
                            color={JOB_STATUS_COLORS[getStatus(posting._id)] as "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined}
                            className="h-6"
                          >
                            {normalizeText(getStatus(posting._id))}
                          </Chip>
                        </Tooltip>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] mb-3">
                        {formatDescription(posting?.description as unknown as Delta)}
                      </p>

                      <Divider className="my-3" />

                      <div className="flex justify-between items-center mt-1 text-xs">
                        <div className="flex items-center text-gray-500">
                          <DollarSign size={14} className="mr-1" />
                          <span>{formatSalary(posting?.salary)}</span>
                        </div>

                        <div className="flex items-center text-gray-500">
                          <CalendarClock size={14} className="mr-1" />
                          <span>
                            {posting?.createdAt
                              ? getAgoDays(posting.createdAt)
                              : "Recently posted"}
                          </span>
                        </div>
                      </div>

                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="mt-3 w-full"
                        endContent={<ChevronRight size={14} />}
                      >
                        View Details
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredPostings.length > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={totalPages}
                  initialPage={1}
                  page={currentPage}
                  onChange={setCurrentPage}
                  showControls
                  className="z-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
