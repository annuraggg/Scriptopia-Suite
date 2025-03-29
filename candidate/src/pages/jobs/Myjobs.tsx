import { useState } from "react";
import { ChevronDown, ChevronUp, Building2, Calendar } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody } from "@nextui-org/react";
import { format } from "date-fns";
import { useOutletContext } from "react-router-dom";
import RootContext from "@/types/RootContext";
import { StepStatus, WorkflowStep } from "@shared-types/Posting";
import { AppliedPostingStatus } from "@shared-types/AppliedPosting";

const Myjobs = () => {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const { user } = useOutletContext() as RootContext;

  const filters = ["all", "applied", "hired", "inprogress", "rejected"];

  const toggleCard = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const getDotClasses = (stage: StepStatus) => {
    console.log(stage);
    const colors = {
      pending: "w-3 h-3 rounded-full bg-gray-500",
      completed: "w-3 h-3 rounded-full bg-green-500",
      "in-progress": "w-3 h-3 rounded-full bg-yellow-500",
      failed: "w-3 h-3 rounded-full bg-red-500",
    };
    return colors[stage] || "w-3 h-3 rounded-full bg-gray-500";
  };

  const normalizeText = (text: string) => {
    return text
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getStatusColor = (status: AppliedPostingStatus) => {
    const colors = {
      applied: "bg-blue-500",
      hired: "bg-purple-500",
      inprogress: "bg-yellow-500",
      rejected: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const filteredJobs = user?.appliedPostings?.filter(
    (job) => activeFilter === "all" || job.status === activeFilter
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
                {normalizeText(filter)}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job: any) => (
              <Card
                key={job._id}
                className="w-full rounded-2xl shadow-md border border-gray-200 overflow-hidden"
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">
                        {job.posting?.title}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={16} />
                        <span>{job.posting?.organizationId.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>
                          {format(new Date(job.createdAt!), "MMM dd, yyyy")}
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
                    onClick={() => toggleCard(job._id!)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    {expandedCards.includes(job._id!) ? (
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

                {expandedCards.includes(job._id!) && (
                  <div>
                    <div className="px-6 pb-6">
                      <div className="relative">
                        {" "}
                        <div className="flex gap-4 mb-4">
                          <div className="relative">
                            {" "}
                            <div
                              className={getDotClasses(
                                "completed" as StepStatus
                              )}
                            />
                            <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-300" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              Registered
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(job.createdAt!).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {job.posting?.workflow?.steps.map(
                          (step: WorkflowStep, index: number) => (
                            <div key={index} className="flex gap-4 mb-4">
                              <div className="relative">
                                {" "}
                                <div className={getDotClasses(step.status)} />
                                <div className={step.type} />
                                {job.posting?.workflow?.steps &&
                                  index !==
                                    job.posting?.workflow.steps.length - 1 && (
                                    <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-300" />
                                  )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {step.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {normalizeText(step.type)}
                                </div>
                              </div>
                            </div>
                          )
                        )}
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
