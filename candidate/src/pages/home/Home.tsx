import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Input,
  Select,
  SelectItem,
  Card,
  Pagination,
  Slider,
  Modal,
  Button,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  AlertCircle,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import ApplicationForm from "./ApplicationForm";
import { ExtendedPosting as Posting } from "@shared-types/ExtendedPosting";

const jobTypes = [
  "full_time",
  "part_time",
  "internship",
  "contract",
  "temporary",
];
const locations = ["Remote", "On-site", "Hybrid"];
const openingsRange = ["1-5", "6-10", "11-20", "20+"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedOpeningsRange, setSelectedOpeningsRange] = useState("");
  const [selectedPostingsSort, setSelectedPostingsSort] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 200000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/postings/candidate/postings");
      if (response.data?.data) {
        setPostings(response.data.data);
        setDepartments(response.data.data.departments || []);

        const maxSalary = Math.max(
          ...response.data.data.map((p: Posting) => p.salary.max)
        );
        setSalaryRange([0, maxSalary]);
      }
    } catch (err) {
      console.error("Failed to fetch job postings:", err);
      setPostings([]);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      // Add more currencies as needed
    };
    return symbols[currency] || currency;
  };

  const formatCurrency = (min: number, max: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
  };

  const isPostingExpired = (endDate: Date) => {
    return endDate < new Date();
  };

  const getTimeUntilDeadline = (endDate: string) => {
    if (isPostingExpired(new Date(endDate))) {
      return "Expired";
    }
    const now = new Date();
    const deadline = new Date(endDate);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  const handlePostingClick = (posting: Posting) => {
    if (isPostingExpired(posting.applicationRange.end)) {
      setShowExpiredModal(true);
      return;
    }

    setSelectedPosting(posting);
    setShowApplication(true);
  };

  const getOpeningsRangeFilter = (openings: number) => {
    switch (selectedOpeningsRange) {
      case "1-5":
        return openings >= 1 && openings <= 5;
      case "6-10":
        return openings >= 6 && openings <= 10;
      case "11-20":
        return openings >= 11 && openings <= 20;
      case "20+":
        return openings > 20;
      default:
        return true;
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  let filteredPostings = postings.filter((posting) => {
    return (
      posting.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedLocation || posting.location === selectedLocation) &&
      (!selectedJobType || posting.type === selectedJobType) &&
      (!selectedDepartment || posting.department === selectedDepartment) &&
      (posting?.salary?.max ?? 0) >= salaryRange[0] &&
      (posting?.salary?.min ?? 0) <= salaryRange[1] &&
      getOpeningsRangeFilter(posting.openings)
    );
  });

  // Sort by number of postings if selected
  if (selectedPostingsSort) {
    const departmentPostingCounts = filteredPostings.reduce((acc, posting) => {
      acc[posting.department ?? 0] = (acc[posting.department ?? 0] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    filteredPostings.sort((a, b) => {
      const countA = departmentPostingCounts[a.department ?? 0] || 0;
      const countB = departmentPostingCounts[b.department ?? 0] || 0;
      return selectedPostingsSort === "most_postings"
        ? countB - countA
        : countA - countB;
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (showApplication && selectedPosting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen p-8"
      >
        <Button
          color="primary"
          variant="light"
          onPress={() => setShowApplication(false)}
          className="mb-6"
        >
          ← Back to Jobs
        </Button>

        <ApplicationForm
          posting={{
            _id: selectedPosting._id,
            title: selectedPosting.title,
            additionalDetails: selectedPosting.additionalDetails as { [category: string]: { [field: string]: { required: boolean; allowEmpty: boolean; }; }; } | undefined,
          }}
          onClose={() => setShowApplication(false)}
          onSubmit={async (formData) => {
            try {
              // Implement your form submission logic here
              console.log("Form submitted:", formData);
              // After successful submission
              setShowApplication(false);
            } catch (error) {
              console.error("Error submitting application:", error);
            }
          }}
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-default-500">
            Browse through opportunities from top companies
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search jobs..."
              startContent={<Search className="text-default-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              placeholder="Location"
              startContent={<MapPin className="text-default-400" />}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {capitalizeFirstLetter(location)}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Job Type"
              startContent={<Briefcase className="text-default-400" />}
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
            >
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Department"
              startContent={<Building2 className="text-default-400" />}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
            <div>
              <label className="text-sm text-default-500 mb-2 block">
                Salary Range (Annual)
              </label>
              <Slider
                label="Salary"
                step={10000}
                minValue={0}
                maxValue={200000}
                value={salaryRange}
                onChange={setSalaryRange as any}
                className="max-w-md"
                startContent={<DollarSign className="text-default-400" />}
                renderValue={() => (
                  <div className="text-default-500">
                    {formatCurrency(salaryRange[0], salaryRange[1], "USD")}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="text-sm text-default-500 mb-2 block">
                Number of Openings
              </label>
              <Select
                placeholder="Select range"
                value={selectedOpeningsRange}
                onChange={(e) => setSelectedOpeningsRange(e.target.value)}
              >
                {openingsRange.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range} positions
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm text-default-500 mb-2 block">
                Sort by Postings
              </label>
              <Select
                placeholder="Sort by postings"
                value={selectedPostingsSort}
                onChange={(e) => setSelectedPostingsSort(e.target.value)}
              >
                <SelectItem key="most_postings" value="most_postings">
                  Most Postings First
                </SelectItem>
                <SelectItem key="least_postings" value="least_postings">
                  Least Postings First
                </SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4"
          >
            {filteredPostings.map((posting) => (
              <motion.div
                key={posting._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.01 }}
                className="w-full cursor-pointer"
                onClick={() => handlePostingClick(posting)}
              >
                <Card
                  className={`p-6 hover:shadow-lg transition-shadow ${
                    isPostingExpired(posting.applicationRange.end)
                      ? "opacity-75 cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{posting.title}</h3>
                      <div className="flex items-center gap-4 text-default-500">
                        <span className="flex items-center gap-1">
                          <Building2 size={16} />
                          {posting.organizationId.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {capitalizeFirstLetter(posting.location)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {posting.type.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-success-600 font-medium">
                        {formatCurrency(
                          posting.salary.min ?? 0,
                          posting.salary.max ?? 0,
                          posting.salary.currency || "USD"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm ${
                          isPostingExpired(posting.applicationRange.end)
                            ? "text-danger-500 font-medium"
                            : "text-default-500"
                        }`}
                      >
                        {getTimeUntilDeadline(posting.applicationRange.end.toString())}
                      </p>
                      <p className="text-sm text-default-400">
                        {posting.openings} opening
                        {posting.openings > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-8">
          <Pagination
            total={Math.ceil(filteredPostings.length / 10)}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      </motion.div>

      <Modal
        isOpen={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          <ModalBody className="p-6">
            <div className="flex justify-end mb-2">
              <Button
                isIconOnly
                variant="light"
                onPress={() => setShowExpiredModal(false)}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Posting Expired</h3>
              <p className="text-default-500 mb-6">
                This job posting has expired and is no longer accepting
                applications.
              </p>
              <Button
                color="primary"
                onPress={() => setShowExpiredModal(false)}
                className="w-full"
              >
                Browse Other Opportunities
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
