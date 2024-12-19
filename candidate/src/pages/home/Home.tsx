import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Select, SelectItem, Slider, Card, Pagination } from "@nextui-org/react";
import { Search, MapPin, Briefcase, Building2, Calendar, BriefcaseIcon } from 'lucide-react';

// Types
interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: number;
  type: string;
  industry: string;
  postedDate: string;
  description: string;
  logo: React.ReactNode;
}

const Home = () => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [salaryRange, setSalaryRange] = useState([30000, 150000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');

  // Mock data
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing'];
  const locations = ['New York', 'San Francisco', 'London', 'Remote', 'Tokyo'];

  // Mock job postings with 10 items
  const mockJobs: JobPosting[] = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'San Francisco',
      salary: 120000,
      type: 'Full-time',
      industry: 'Technology',
      postedDate: '2024-12-18',
      description: 'Join our dynamic team of developers...',
      logo: <BriefcaseIcon className="w-12 h-12 p-2 rounded-xl" />,
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateCo',
      location: 'New York',
      salary: 135000,
      type: 'Full-time',
      industry: 'Technology',
      postedDate: '2024-12-17',
      description: 'Lead product development initiatives...',
      logo: <BriefcaseIcon className="w-12 h-12 p-2 marker rounded-xl" />,
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'Remote',
      salary: 95000,
      type: 'Full-time',
      industry: 'Technology',
      postedDate: '2024-12-16',
      description: 'Create beautiful user experiences...',
      logo: <BriefcaseIcon className="w-12 h-12 p-2 rounded-xl" />,
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'DataCo',
      location: 'London',
      salary: 110000,
      type: 'Remote',
      industry: 'Technology',
      postedDate: '2024-12-15',
      description: 'Analysis of complex datasets...',
      logo: <BriefcaseIcon className="w-12 h-12 p-2 rounded-xl" />,
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Tokyo',
      salary: 125000,
      type: 'Full-time',
      industry: 'Technology',
      postedDate: '2024-12-14',
      description: 'Manage cloud infrastructure...',
      logo: <BriefcaseIcon className="w-12 h-12 p-2 rounded-xl" />,
    },
  ];

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Job card animation
  const jobCardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header Section with Animated Glow */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 relative inline-block transition-shadow px-2 py-2 drop-shadow-glow-extralight-dark">
          <span className="relative z-10">Find Your Dream Job</span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-10 blur-xl animate-drip-expand" />
        </h1>
        <p className="text-gray-600">
          Discover thousands of job opportunities with all the information you need
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-xl p-6 shadow-md mb-8 backdrop-blur-sm"
      >
        {/* Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search jobs, companies, or keywords..."
            startContent={<Search className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
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

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            placeholder="Industry"
            startContent={<Building2 className="text-gray-400" />}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </Select>
          <div className="px-4">
            <Slider
              label="Salary Range"
              step={1000}
              minValue={30000}
              maxValue={150000}
              value={salaryRange}
              onChange={(value) => setSalaryRange(value as number[])}
              className="max-w-md"
            />
          </div>
          <Select
            placeholder="Sort by"
            startContent={<Calendar className="text-gray-400" />}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <SelectItem key="recent" value="recent">Most Recent</SelectItem>
            <SelectItem key="salary" value="salary">Highest Salary</SelectItem>
            <SelectItem key="relevance" value="relevance">Most Relevant</SelectItem>
          </Select>
        </div>
      </motion.div>

      {/* Scrollable Job Listings */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-hide mb-8 pr-4"
      >
        {mockJobs.map((job) => (
          <motion.div
            key={job.id}
            variants={jobCardVariants}
            whileHover={{ scale: 1.02 }}
            className="transform transition-all duration-200"
          >
            <Card className="p-4 hover:shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                {job.logo}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-gray-600 text-sm mt-1">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {job.company}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    ${job.salary.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          total={10}
          initialPage={currentPage}
          onChange={(page) => setCurrentPage(page)}
          showControls
          className="backdrop-blur-sm rounded-xl p-2"
        />
      </div>
    </div>
  );
};

export default Home;