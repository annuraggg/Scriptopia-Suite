import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardBody,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Accordion,
  AccordionItem,
  Avatar,
  Tooltip,
  Progress,
} from "@nextui-org/react";
import {
  Plus,
  Calendar,
  FileText,
  HelpCircle,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Clock,
  Bell,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/types/Reducer";
import CreateJobModal from "../jobs/CreateJobModal";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface Posting {
  _id: string;
  title: string;
  department: string;
  type: string;
  published: boolean;
  publishedOn: string;
  updatedOn: string;
  workflow?: {
    currentStep: number;
    steps: Array<{
      name: string;
      type: string;
    }>;
  };
  applicationRange: {
    start: string;
    end: string;
  };
  candidates?: Array<any>;
  status?: string;
}

/* interface AuditLog {
 user: string;
 userId: string;
 action: string;
 type: string;
 timestamp?: string;
} */

interface CandidateQuery {
  id: string;
  question: string;
  postingTitle: string;
  candidateName: string;
  timestamp: string;
  status: "pending" | "answered";
}

const mockQueries: CandidateQuery[] = [
  {
    id: "1",
    question: "What are the requirements for remote work arrangements?",
    postingTitle: "Senior Software Engineer",
    candidateName: "John Doe",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "pending",
  },
  {
    id: "2",
    question: "Is relocation assistance provided for international candidates?",
    postingTitle: "Product Manager",
    candidateName: "Emma Wilson",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: "answered",
  },
  {
    id: "3",
    question: "What is the expected start date for this position?",
    postingTitle: "UX Designer",
    candidateName: "Mike Chen",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: "pending",
  },
];

const Dashboard: React.FC = () => {
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [selectedView, setSelectedView] = useState('overview');

  const org = useSelector((state: RootState) => state.organization);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const axios = ax(getToken);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/postings");
      setPostings(response.data.data.postings);
      setDepartments(response.data.data.departments);
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to fetch dashboard data");
      setIsLoading(false);
    }
  };

  const mockChartData = [
    { name: "Jan", applications: 65, interviews: 28 },
    { name: "Feb", applications: 59, interviews: 32 },
    { name: "Mar", applications: 80, interviews: 41 },
    { name: "Apr", applications: 81, interviews: 37 },
    { name: "May", applications: 56, interviews: 25 },
    { name: "Jun", applications: 55, interviews: 29 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const ActivityFeed: React.FC = () => (
    <div className="space-y-4 overflow-y-auto max-h-[345px]">
      <AnimatePresence>
        {postings.slice(0, 5).map((posting, index) => (
          <motion.div
            key={posting._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl p-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full /20 flex items-center justify-center">
                {posting.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-warning-500" />
                )}
              </div>
              <div className="flex-1">
                <p className=" font-medium">{posting.title}</p>
                <p className="text-sm">{posting.department}</p>
                <p className="text-sm">{getRelativeTime(posting.updatedOn)}</p>
              </div>
              <Button
                isIconOnly
                variant="light"
                className="hover:"
                onClick={() => navigate(`/jobs/${posting._id}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            <Progress
              size="sm"
              value={
                posting.workflow?.currentStep
                  ? (posting.workflow.currentStep /
                      posting.workflow.steps.length) *
                    100
                  : 0
              }
              className="mt-4"
              color="success"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const MetricCard: React.FC<{
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
  }> = ({ title, value, change, icon }) => (
    <Card className="">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl`}>{icon}</div>
          <div
            className={`px-2 py-1 rounded-lg text-sm flex items-center gap-1 ${
              change >= 0
                ? "bg-success-500/20 text-success-500"
                : "bg-danger-500/20 text-danger-500"
            }`}
          >
            {change >= 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm mt-1">{title}</p>
        </div>
      </CardBody>
    </Card>
  );

  const HelpModal = () => (
    <Modal
      isOpen={isHelpOpen}
      onClose={() => setIsHelpOpen(false)}
      className=""
      size="2xl"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="">Help Center</ModalHeader>
        <ModalBody className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className=" border-none">
              <CardBody>
                <h3 className="text-lg font-semibold  mb-2">
                  Quick Start Guide
                </h3>
                <p className="">
                  New to the platform? Follow our step-by-step guide to get
                  started with recruitment.
                </p>
                <Button className="mt-4" color="primary" variant="flat">
                  View Guide
                </Button>
              </CardBody>
            </Card>
            <Card className="bg-success-500/20 border-none">
              <CardBody>
                <h3 className="text-lg font-semibold  mb-2">Video Tutorials</h3>
                <p className="">
                  Watch our comprehensive video tutorials to master the
                  platform.
                </p>
                <Button className="mt-4" color="success" variant="flat">
                  Watch Now
                </Button>
              </CardBody>
            </Card>
          </div>
          <Accordion className="px-0">
            <AccordionItem
              key="1"
              aria-label="Getting Started"
              title={
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 " />
                  <span>Getting Started</span>
                </div>
              }
              className=""
            >
              Learn how to create your first job posting, set up workflows, and
              manage candidates effectively.
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Managing Workflows"
              title={
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-success-500" />
                  <span>Managing Workflows</span>
                </div>
              }
              className=""
            >
              Customize and optimize your hiring workflows for different
              positions and departments.
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Best Practices"
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-warning-500" />
                  <span>Best Practices</span>
                </div>
              }
              className=""
            >
              Tips and tricks for successful recruitment and candidate
              management.
            </AccordionItem>
          </Accordion>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-full mt-5 ml-5">
      <div className="mb-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w mx-auto pb-2 space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 justify-between flex items-center gap-4"
        >
          <div>
            <h3 className="font-bold mb-2">Welcome back, {org.name}</h3>
            <p className="">
              Here's what's happening with your recruitment today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip content="Notifications">
              <Button
                isIconOnly
                variant="light"
                className=""
                onClick={() => navigate("/notifications")}
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Tooltip>
            <Button
              color="primary"
              endContent={<Plus size={20} />}
              onPress={() => {
                if (!departments.length) {
                  toast.error("Please create a department first");
                  return;
                }
                setIsCreateJobOpen(true);
              }}
            >
              Create Job
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <MetricCard
            title="Active Jobs"
            value={postings.filter((p) => p.published).length}
            change={12}
            icon={<Briefcase className="w-6 h-6" />}
          />
          <MetricCard
            title="Total Candidates"
            value={postings.reduce(
              (acc, post) => acc + (post.candidates?.length || 0),
              0
            )}
            change={-5}
            icon={<Users className="w-6 h-6 text-success-500" />}
          />
          <MetricCard
            title="Open Positions"
            value={
              postings.filter(
                (p) =>
                  p.published && new Date(p.applicationRange.end) > new Date()
              ).length
            }
            change={8}
            icon={<TrendingUp className="w-6 h-6 text-warning-500" />}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <Card className="">
              <CardBody>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold ">
                    Recruitment Overview
                  </h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="flat" color="primary">
                      Monthly
                    </Button>
                    <Button size="sm" variant="flat" color="default">
                      Weekly
                    </Button>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="applications"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={{ fill: "#06b6d4" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="interviews"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: "#22c55e" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full " />
                    <span className="text-sm ">Applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success-500" />
                    <span className="text-sm ">Interviews</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="">
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold ">Recent Activity</h2>
                  <Button size="sm" variant="light">
                    View All
                  </Button>
                </div>
                <ActivityFeed />
              </CardBody>
            </Card>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          <Card className="lg:col-span-1">
            <CardBody>
              <h2 className="text-xl font-semibold  mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  className="h-24"
                  color="secondary"
                  variant="flat"
                  startContent={<Calendar className="w-5 h-5" />}
                  onClick={() => navigate("/calendar")}
                >
                  <div className="text-left">
                    <div className="font-semibold">Schedule Interviews</div>
                    <div className="text-sm opacity-80">
                      Manage upcoming interviews
                    </div>
                  </div>
                </Button>
                <Button
                  className="h-24 "
                  color="secondary"
                  variant="flat"
                  startContent={<FileText className="w-5 h-5" />}
                  onClick={() => navigate("/reports")}
                >
                  <div className="text-left">
                    <div className="font-semibold">Generate Reports</div>
                    <div className="text-sm opacity-80">
                      Download recruitment analytics
                    </div>
                  </div>
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2 max-h-[300px]">
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold ">Candidate Queries</h2>
                <Button size="sm" variant="light">
                  View All
                </Button>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {mockQueries.map((query, index) => (
                    <motion.div
                      key={query.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className=" rounded-xl p-4  transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-warning-500/20 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-warning-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{query.question}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm">
                              {query.postingTitle}
                            </span>
                            <span className="">•</span>
                            <span className="text-sm">
                              {query.candidateName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              color={
                                query.status === "pending"
                                  ? "warning"
                                  : "success"
                              }
                            >
                              {query.status}
                            </Badge>
                            <span className="text-sm">
                              {getRelativeTime(query.timestamp)}
                            </span>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          variant="light"
                          className="hover:"
                          onClick={() => navigate(`/queries/${query.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-1">
            <CardBody>
              <h2 className="text-xl font-semibold  mb-4">Team Members</h2>
              <div className="space-y-4">
                {["Alice Smith", "Bob Johnson", "Carol White"].map((name) => (
                  <div key={name} className="flex items-center gap-3">
                    <Avatar name={name} className="/20" size="sm" />
                    <div>
                      <p className=" font-medium">{name}</p>
                      <p className="text-sm">Hiring Manager</p>
                    </div>
                  </div>
                ))}
                <Button
                  className="w-full"
                  color="default"
                  variant="flat"
                  startContent={<Plus className="w-4 h-4" />}
                  onClick={() => navigate("/settings/members")}
                >
                  Add Team Member
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <div className="absolute -inset-0.5  rounded-full animate-ping opacity-20" />
          <Button
            isIconOnly
            color="primary"
            className="rounded-full w-12 h-12 shadow-lg relative z-10"
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        deparments={departments}
      />
      <HelpModal />
    </div>
  );
};

export default Dashboard;
