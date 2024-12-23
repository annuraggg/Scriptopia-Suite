import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Building2, Calendar } from 'lucide-react';
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { format } from 'date-fns';

const jobData = [
  {
    id: 1,
    position: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    applicationDate: "2024-12-15",
    status: "In Progress",
    timeline: [
      { date: "2024-12-15", stage: "Applied", details: "Application submitted" },
      { date: "2024-12-17", stage: "In Progress", details: "Resume screening" },
    ]
  },
  {
    id: 2,
    position: "UI/UX Designer",
    company: "DesignHub",
    applicationDate: "2024-12-10",
    status: "Selected",
    timeline: [
      { date: "2024-12-10", stage: "Applied", details: "Application submitted" },
      { date: "2024-12-12", stage: "In Progress", details: "Initial screening" },
      { date: "2024-12-14", stage: "Selected", details: "Selected for interview" },
    ]
  }
];

const jobCardVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const Myjobs = () => {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Applied", "Selected", "Hired", "In Progress", "Rejected"];

  const toggleCard = (id: number) => {
    setExpandedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "Applied": "bg-blue-500",
      "Selected": "bg-green-500",
      "Hired": "bg-purple-500",
      "In Progress": "bg-yellow-500",
      "Rejected": "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getDotClasses = (stage: string) => {
    const baseClasses = "w-3 h-3 rounded-full";
    const colorClass = getStatusColor(stage);
    const animationClass = stage === "In Progress" ? "animate-pulse shadow-lg shadow-yellow-500/50" : "";
    return `${baseClasses} ${colorClass} ${animationClass}`;
  };

  const filteredJobs = jobData.filter(job => 
    activeFilter === "All" || job.status === activeFilter
  );

  return (
    <div className="min-h-screen p-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Jobs</BreadcrumbItem>
        <BreadcrumbItem href="/profile">My Jobs</BreadcrumbItem>
      </Breadcrumbs>
      <div className="max-w-2xl pt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">My Job Applications</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map(filter => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeFilter === filter 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                {filter}
              </motion.button>
            ))}
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {filteredJobs.map(job => (
                <motion.div
                  key={job.id}
                  variants={jobCardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden transform transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">{job.position}</h2>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Building2 size={16} />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar size={16} />
                          <span>{format(new Date(job.applicationDate), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCard(job.id)}
                      className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      {expandedCards.includes(job.id) ? (
                        <>Hide Timeline <ChevronUp size={16} /></>
                      ) : (
                        <>View Timeline <ChevronDown size={16} /></>
                      )}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {expandedCards.includes(job.id) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="relative">
                            {job.timeline.map((event, index) => (
                              <div key={index} className="flex gap-4 mb-4">
                                <div className="relative">
                                  <div className={getDotClasses(event.stage)} />
                                  {index !== job.timeline.length - 1 && (
                                    <div className="absolute top-3 left-1.5 w-0.5 h-full bg-zinc-700" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {event.stage}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {format(new Date(event.date), 'MMM dd, yyyy')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {event.details}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Myjobs;