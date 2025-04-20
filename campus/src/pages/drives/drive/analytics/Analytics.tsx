import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Progress,
} from "@nextui-org/react";
import {
  Users,
  UserCheck,
  Clock,
  Award,
  AlertCircle,
  TrendingUp,
  School,
  BarChart2,
  DollarSign,
  Clipboard,
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DriveAnalytics } from "@shared-types/DriveAnalytics";

interface Drive {
  _id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
  };
  status: string;
  jobRole?: string;
  jobDescription?: string;
  applicationRange?: {
    start: string;
    end: string;
  };
  workflow?: {
    steps: Array<{
      name: string;
      description?: string;
    }>;
  };
}

interface DriveAnalyticsResponse {
  analytics: DriveAnalytics;
  drive: Drive;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];
const GENDER_COLORS = {
  male: "#3b82f6",
  female: "#ec4899",
  other: "#8b5cf6",
};

const DriveAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [data, setData] = useState<DriveAnalyticsResponse | null>(null);
  const [selected, setSelected] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDriveAnalytics = async () => {
      try {
        const response = await axios.get(`/drives/${id}/analytics`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching drive analytics:", error);
        toast.error("Failed to load drive analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchDriveAnalytics();
  }, [id, axios]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analytics Not Available</h2>
        <p className="text-gray-500">
          Unable to load drive analytics. Please try again later.
        </p>
        <Button
          color="primary"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const { analytics, drive } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(1) + "%";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stageData = analytics.stageAnalytics.map((stage) => ({
    name: stage.stageName,
    dropOff: stage.dropOffRate,
    pass: stage.passRate,
  }));

  const candidateStatusData = [
    { name: "Hired", value: analytics.hiredCandidates },
    { name: "Rejected", value: analytics.rejectedCandidates },
    { name: "In Progress", value: analytics.inProgressCandidates },
  ];

  const genderData = analytics.genderDistribution
    ? [
        { name: "Male", value: analytics.genderDistribution.male },
        { name: "Female", value: analytics.genderDistribution.female },
        { name: "Other", value: analytics.genderDistribution.other },
      ]
    : [];

  const degreeData = analytics.educationDistribution
    ? Object.entries(analytics.educationDistribution.degreeTypes).map(
        ([degree, count]) => ({
          name: degree,
          value: count,
        })
      )
    : [];

  const renderStatsCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string
  ) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className="w-full md:w-1/2 lg:w-1/4 p-2"
    >
      <Card className="h-full">
        <CardBody className="flex flex-row items-center">
          <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-xl font-bold">{value}</h3>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );

  const renderSalaryMetrics = () => (
    <Card className="mb-6">
      <CardHeader className="border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center">
          <DollarSign size={20} className="mr-2" />
          Salary Analysis
        </h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 mb-1">Average CTC</p>
            <h4 className="text-xl font-bold">
              {formatCurrency(analytics.salary.averageCTC)}
            </h4>
          </div>
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 mb-1">Highest Package</p>
            <h4 className="text-xl font-bold">
              {formatCurrency(analytics.salary.highestCTC)}
            </h4>
          </div>
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 mb-1">Lowest Package</p>
            <h4 className="text-xl font-bold">
              {formatCurrency(analytics.salary.lowestCTC)}
            </h4>
          </div>
          <div className="text-center p-4">
            <p className="text-sm text-gray-500 mb-1">Median Package</p>
            <h4 className="text-xl font-bold">
              {formatCurrency(analytics.salary.medianCTC)}
            </h4>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderStageAnalysis = () => (
    <Card className="mb-6">
      <CardHeader className="border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center">
          <Clipboard size={20} className="mr-2" />
          Stage Analysis
        </h3>
      </CardHeader>
      <CardBody>
        {analytics.bottleneckStage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-800 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              Bottleneck Identified
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              {analytics.bottleneckStage.stageName} has the highest drop-off
              rate ({formatPercentage(analytics.bottleneckStage.dropOffRate)}).
            </p>
          </div>
        )}

        <div className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stageData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="pass" name="Pass Rate (%)" fill="#4ade80" />
              <Bar dataKey="dropOff" name="Drop-off Rate (%)" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-4">Stage Details</h4>
          <div className="space-y-4">
            {analytics.stageAnalytics.map((stage, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between mb-2">
                  <h5 className="font-medium">{stage.stageName}</h5>
                  {stage.isBottleneck && (
                    <Chip color="warning" size="sm">
                      Bottleneck
                    </Chip>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                  <div>
                    Total Candidates:{" "}
                    <span className="font-medium">{stage.totalCandidates}</span>
                  </div>
                  <div>
                    Passed:{" "}
                    <span className="font-medium">
                      {stage.passedCandidates}
                    </span>
                  </div>
                  <div>
                    Failed:{" "}
                    <span className="font-medium">
                      {stage.failedCandidates}
                    </span>
                  </div>
                  <div>
                    Pass Rate:{" "}
                    <span className="font-medium">
                      {formatPercentage(stage.passRate)}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Pass Rate</span>
                    <span>{formatPercentage(stage.passRate)}</span>
                  </div>
                  <Progress
                    value={stage.passRate}
                    color={
                      stage.passRate > 70
                        ? "success"
                        : stage.passRate > 40
                        ? "warning"
                        : "danger"
                    }
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderDemographics = () => (
    <Card className="mb-6">
      <CardHeader className="border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center">
          <Users size={20} className="mr-2" />
          Candidate Demographics
        </h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.genderDistribution && (
            <div>
              <h4 className="font-medium mb-4 text-center">
                Gender Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {genderData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(GENDER_COLORS)[
                            index % Object.values(GENDER_COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {analytics.educationDistribution && (
            <div>
              <h4 className="font-medium mb-4 text-center">
                Education Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={degreeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {degreeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {analytics.educationDistribution &&
          analytics.educationDistribution.topSchools.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-4">Top Schools</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.educationDistribution.topSchools.map(
                  (school, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <School size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium truncate">{school.school}</p>
                        <p className="text-sm text-gray-500">
                          {school.count} candidates
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </CardBody>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{drive.title} Analytics</h1>
            <p className="text-gray-500 mt-1">
              {drive.company?.name} · {drive.jobRole || "Various Roles"}
            </p>
          </div>
          <Button
            color="primary"
            className="mt-4 md:mt-0"
            onClick={() => window.history.back()}
          >
            Back to Drives
          </Button>
        </div>

        <Divider className="my-4" />

        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          className="mt-6"
        >
          <Tab key="overview" title="Overview" />
          <Tab key="stages" title="Stage Analysis" />
          <Tab key="demographics" title="Demographics" />
        </Tabs>
      </motion.div>

      {selected === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            {renderStatsCard(
              "Total Candidates",
              analytics.totalCandidates,
              <Users size={24} className="text-blue-500" />,
              "blue"
            )}
            {renderStatsCard(
              "Applied Candidates",
              analytics.appliedCandidates,
              <UserCheck size={24} className="text-green-500" />,
              "green"
            )}
            {renderStatsCard(
              "Hired Candidates",
              analytics.hiredCandidates,
              <Award size={24} className="text-purple-500" />,
              "purple"
            )}
            {renderStatsCard(
              "Application Rate",
              formatPercentage(analytics.applicationRate),
              <TrendingUp size={24} className="text-teal-500" />,
              "teal"
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader className="border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <BarChart2 size={20} className="mr-2" />
                  Key Performance Indicators
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
                      <Users size={32} className="text-blue-600" />
                    </div>
                    <h4 className="text-2xl font-bold">
                      {formatPercentage(analytics.applicationRate)}
                    </h4>
                    <p className="text-sm text-gray-500">Application Rate</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                      <UserCheck size={32} className="text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold">
                      {formatPercentage(analytics.conversionRate)}
                    </h4>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-4">
                      <Clock size={32} className="text-amber-600" />
                    </div>
                    <h4 className="text-2xl font-bold">
                      {analytics.timeToHire
                        ? analytics.timeToHire.toFixed(1)
                        : "N/A"}
                    </h4>
                    <p className="text-sm text-gray-500">Avg. Days to Hire</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Candidate Status</h3>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={candidateStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value, percent }) =>
                          `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        <Cell fill="#4ade80" /> {/* Hired - Green */}
                        <Cell fill="#f87171" /> {/* Rejected - Red */}
                        <Cell fill="#fbbf24" /> {/* In Progress - Yellow */}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              {renderSalaryMetrics()}
            </div>
          </motion.div>
        </div>
      )}

      {selected === "stages" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderStageAnalysis()}
        </motion.div>
      )}

      {selected === "demographics" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderDemographics()}
        </motion.div>
      )}
    </div>
  );
};

export default DriveAnalyticsPage;
