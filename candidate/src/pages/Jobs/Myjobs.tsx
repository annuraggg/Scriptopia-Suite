import { useState } from "react";
import { ChevronDown, ChevronUp, Building2, Calendar } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody } from "@nextui-org/react";
import { format } from "date-fns";

const jobData = [
  {
    _id: "21",
    position: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    applicationDate: "2024-12-15",
    status: "In Progress",
    timeline: [
      {
        date: "2024-12-15",
        stage: "Applied",
        details: "Application submitted",
      },
      { date: "2024-12-17", stage: "In Progress", details: "Resume screening" },
    ],
  },
  {
    _id: "2",
    position: "UI/UX Designer",
    company: "DesignHub",
    applicationDate: "2024-12-10",
    status: "Selected",
    timeline: [
      {
        date: "2024-12-10",
        stage: "Applied",
        details: "Application submitted",
      },
      {
        date: "2024-12-12",
        stage: "In Progress",
        details: "Initial screening",
      },
      {
        date: "2024-12-14",
        stage: "Selected",
        details: "Selected for interview",
      },
    ],
  },
];

const Myjobs = () => {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Applied",
    "Selected",
    "Hired",
    "In Progress",
    "Rejected",
  ];

  const toggleCard = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Applied: "bg-blue-500",
      Selected: "bg-green-500",
      Hired: "bg-purple-500",
      "In Progress": "bg-yellow-500",
      Rejected: "bg-red-500",
    }; // @ts-expect-error - TS doesn't recognize the keys
    return colors[status] || "bg-gray-500";
  };

  const getDotClasses = (stage: string) => {
    const baseClasses = "w-3 h-3 rounded-full";
    const colorClass = getStatusColor(stage);
    return `${baseClasses} ${colorClass}`;
  };

  const filteredJobs = jobData.filter(
    (job) => activeFilter === "All" || job.status === activeFilter
  );

  return (
    <div className="min-h-screen mt-5 ml-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Jobs</BreadcrumbItem>
        <BreadcrumbItem href="/profile">My Jobs</BreadcrumbItem>
      </Breadcrumbs>
      <div className="max-w-2xl pt-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Job Applications</h1>

          <div className="flex flex-wrap gap-2 mb-5">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="w-full rounded-2xl shadow-md border border-gray-200 overflow-hidden"
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">{job.position}</h2>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={16} />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>
                          {format(
                            new Date(job.applicationDate),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleCard(job._id)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    {expandedCards.includes(job._id) ? (
                      <>
                        Hide Timeline <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        View Timeline <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </CardBody>

                {expandedCards.includes(job._id) && (
                  <div>
                    <div className="px-6 pb-6">
                      <div className="relative">
                        {job.timeline.map((event, index) => (
                          <div key={index} className="flex gap-4 mb-4">
                            <div className="relative">
                              <div className={getDotClasses(event.stage)} />
                              {index !== job.timeline.length - 1 && (
                                <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-300" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">
                                {event.stage}
                              </div>
                              <div className="text-sm text-gray-600">
                                {format(new Date(event.date), "MMM dd, yyyy")}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.details}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myjobs;
