import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input, Select, SelectItem, Card, Pagination } from "@nextui-org/react";
import { Search, MapPin, Briefcase, Building2, Calendar, BriefcaseIcon } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

interface Posting {
  _id: string;
  title: string;
  department: string;
  type: string;
  published: boolean;
  publishedOn: string;
  applicationRange: {
    start: string;
    end: string;
  };
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [postings, setPostings] = useState<Posting[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
  const locations = ['New York', 'San Francisco', 'London', 'Remote', 'Tokyo'];

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/postings");
      const activePostings = response.data.data.postings.filter((posting: Posting) => {
        return posting.published && new Date(posting.applicationRange.end) > new Date();
      });
      setPostings(activePostings);
      setDepartments(response.data.data.departments);
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to fetch job postings");
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const jobCardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeUntilDeadline = (endDate: string) => {
    const now = new Date();
    const deadline = new Date(endDate);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 relative inline-block">
          <span className="relative z-10">Find Your Dream Job</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-10 blur-xl" />
        </h1>
        <p className="text-gray-400">
          Discover opportunities that match your skills and aspirations
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-xl p-6 shadow-md mb-8 bg-content1"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search jobs or keywords..."
            startContent={<Search className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            placeholder="Select location"
            startContent={<MapPin className="text-gray-400" />}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </Select>
          <Select
            placeholder="Job Type"
            startContent={<Briefcase className="text-gray-400" />}
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
          >
            {jobTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            placeholder="Department"
            startContent={<Building2 className="text-gray-400" />}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </Select>
          <Select
            placeholder="Sort by"
            startContent={<Calendar className="text-gray-400" />}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <SelectItem key="recent" value="recent">Most Recent</SelectItem>
            <SelectItem key="deadline" value="deadline">Deadline</SelectItem>
          </Select>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide mb-8 pr-4"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading job postings...</p>
          </div>
        ) : postings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No active job postings found</p>
          </div>
        ) : (
          postings.map((job) => (
            <motion.div
              key={job._id}
              variants={jobCardVariants}
              whileHover={{ scale: 1.02 }}
              className="transform transition-all duration-200"
            >
              <Card className="p-4 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <BriefcaseIcon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                      <span className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      Posted {formatDate(job.publishedOn)}
                    </div>
                    <div className="text-sm font-medium text-warning-500">
                      {getTimeUntilDeadline(job.applicationRange.end)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="flex justify-center mt-8">
        <Pagination
          total={10}
          initialPage={currentPage}
          onChange={(page) => setCurrentPage(page)}
          showControls
          className="rounded-xl p-2"
        />
      </div>
    </div>
  );
};

export default Home;