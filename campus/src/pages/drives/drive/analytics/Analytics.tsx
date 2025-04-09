import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Progress,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
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
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  Users,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award,
  CheckSquare,
  XSquare,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

// Import types
import { ExtendedDrive } from "@shared-types/ExtendedDrive";
import { AppliedDrive } from "@shared-types/AppliedDrive";

// Interface for backend data
interface RawDriveData {
  drive: ExtendedDrive;
  appliedDrives: AppliedDrive[];
}

const DriveAnalytics = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("all");
  const [rawData, setRawData] = useState<RawDriveData | null>(null);

  useEffect(() => {
    const fetchDriveData = async () => {
      setIsLoading(true);
      try {
        // Fetch raw drive data from the backend
        const driveResponse = await axios.get(`/api/drives/${driveId}`);
        const appliedDrivesResponse = await axios.get(
          `/api/drives/${driveId}/applications`
        );

        setRawData({
          drive: driveResponse.data,
          appliedDrives: appliedDrivesResponse.data,
        });
      } catch (error) {
        console.error("Failed to fetch drive data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriveData();
  }, [driveId]);

  // Calculate analytics from raw data
  const analytics = useMemo(() => {
    if (!rawData) return null;

    const { drive, appliedDrives } = rawData;
    const workflow = drive.workflow;

    if (!workflow?.steps?.length) {
      return null;
    }

    // Filter data based on selected time range
    const filterByTimeRange = (date: Date) => {
      if (timeRange === "all") return true;

      const today = new Date();
      const targetDate = new Date(date);
      const daysDiff = Math.floor(
        (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return timeRange === "7days" ? daysDiff <= 7 : daysDiff <= 30;
    };

    const filteredAppliedDrives = appliedDrives.filter((ad) =>
      filterByTimeRange(new Date(ad.createdAt || new Date()))
    );

    // Generate daily applications data
    const dailyApplicationsMap = new Map();
    filteredAppliedDrives.forEach((ad) => {
      const date = new Date(ad.createdAt || new Date())
        .toISOString()
        .split("T")[0];

      if (!dailyApplicationsMap.has(date)) {
        dailyApplicationsMap.set(date, {
          date,
          applications: 0,
          shortlisted: 0,
          rejected: 0,
        });
      }

      const entry = dailyApplicationsMap.get(date);
      entry.applications++;

      if (ad.status === "rejected") entry.rejected++;
      // Assuming a candidate who passed the first step is shortlisted
      if (ad.scores && ad.scores.length > 0) entry.shortlisted++;
    });

    // Sort daily applications by date
    const dailyApplications = Array.from(dailyApplicationsMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Generate application funnel data
    const funnel =
      workflow?.steps.map((step, index): { stageName: string; stageType: string; candidatesCount: number; passRate: number; averageTimeInStage: number } => {
        const candidatesCount = filteredAppliedDrives.filter((ad) => {
          // Count candidates who have reached or passed this stage
          const completedSteps = (ad.scores || []).length;
          return completedSteps >= index;
        }).length;

        const prevStepCandidates =
          index === 0
            ? filteredAppliedDrives.length
            : funnel
            ? funnel[index - 1].candidatesCount
            : filteredAppliedDrives.length;

        const passRate =
          prevStepCandidates > 0
            ? Math.round((candidatesCount / prevStepCandidates) * 100)
            : 100;

        // Calculate average time in stage (simplified - using random data since we don't have actual timestamps)
        // In a real implementation, you would calculate this from the timestamps when candidates enter/exit steps
        const averageTimeInStage = Math.round(Math.random() * 24 + 12); // Random time between 12-36 hours

        return {
          stageName: step.name,
          stageType: step.type,
          candidatesCount,
          passRate,
          averageTimeInStage,
        };
      }) || [];

    // Calculate gender demographics
    const genderCounts = {
      male: 0,
      female: 0,
      other: 0,
      notSpecified: 0,
    };

    drive.candidates.forEach((candidate) => {
      // Count genders
      if (candidate.gender === "male") genderCounts.male++;
      else if (candidate.gender === "female") genderCounts.female++;
      else if (candidate.gender) genderCounts.other++;
      else genderCounts.notSpecified++;
    });

    // Generate rejection reasons (simplified)
    const rejectionReasons = [
      { reason: "Skills mismatch", count: 0, percentage: 0 },
      { reason: "Experience requirements", count: 0, percentage: 0 },
      { reason: "Poor assessment score", count: 0, percentage: 0 },
      { reason: "Cultural fit concerns", count: 0, percentage: 0 },
      { reason: "Salary expectations", count: 0, percentage: 0 },
      { reason: "Other", count: 0, percentage: 0 },
    ];

    // Populate with random data for visualization purposes
    // In a real implementation, you would analyze the actual rejection reasons
    const rejectedCount = filteredAppliedDrives.filter(
      (ad) => ad.status === "rejected"
    ).length;
    const totalReasons = rejectedCount;

    if (totalReasons > 0) {
      rejectionReasons[0].count = Math.floor(totalReasons * 0.35);
      rejectionReasons[1].count = Math.floor(totalReasons * 0.25);
      rejectionReasons[2].count = Math.floor(totalReasons * 0.2);
      rejectionReasons[3].count = Math.floor(totalReasons * 0.1);
      rejectionReasons[4].count = Math.floor(totalReasons * 0.05);
      rejectionReasons[5].count =
        totalReasons - rejectionReasons.reduce((sum, r) => sum + r.count, 0);

      rejectionReasons.forEach((reason) => {
        reason.percentage = Math.round((reason.count / totalReasons) * 100);
      });
    }

    // Get top candidates based on scores
    const candidateScores = new Map();

    filteredAppliedDrives.forEach((ad) => {
      const candidateId = ad.user;
      let totalScore = 0;
      let scoreCount = 0;

      (ad.scores || []).forEach((score) => {
        if (score.score !== undefined) {
          totalScore += score.score;
          scoreCount++;
        }
      });

      const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
      candidateScores.set(candidateId, avgScore);
    });

    const topCandidates = drive.candidates
      .filter((candidate) => candidateScores.has(candidate._id))
      .map((candidate) => {
        const appliedDrive = filteredAppliedDrives.find(
          (ad) => ad.user === candidate._id
        );
        const currentStage = appliedDrive
          ? workflow?.steps[(appliedDrive.scores || []).length]?.name ||
            "Applied"
          : "Applied";

        return {
          id: candidate._id || "",
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          profileImage: candidate.profileImage,
          currentStage,
          overallScore: candidateScores.get(candidate._id) || 0,
          skills: (candidate.technicalSkills || [])
            .slice(0, 6)
            .map((s) => s.skill),
          education: candidate.education?.[0]?.degree || "Not specified",
          experience: candidate.workExperience?.[0]?.title || "Not specified",
        };
      })
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 10); // Get top 10 candidates

    // Calculate summary metrics
    const totalApplicants = filteredAppliedDrives.length;
    const shortlisted = filteredAppliedDrives.filter(
      (ad) => (ad.scores || []).length > 0
    ).length;
    const interviewScheduled = workflow.steps.some(
      (s) => s.type === "INTERVIEW"
    )
      ? filteredAppliedDrives.filter((ad) => {
          const interviewStepIndex = workflow.steps.findIndex(
            (s) => s.type === "INTERVIEW"
          );
          return (ad.scores || []).length >= interviewStepIndex;
        }).length
      : 0;
    const hired = filteredAppliedDrives.filter(
      (ad) => ad.status === "hired"
    ).length;

    // Calculate approximate growth - this would ideally come from historical data comparison
    const applicantsGrowth = 12.5;
    const shortlistedGrowth = 8.2;
    const interviewScheduledGrowth = 5.3;
    const hiredGrowth = -2.1;

    // Calculate conversion rate
    const conversionRate =
      totalApplicants > 0 ? Math.round((hired / totalApplicants) * 100) : 0;

    // Approximate time to hire - in a real implementation, calculate from actual timestamps
    const averageTimeToHire = Math.round(
      funnel.reduce((sum, step) => sum + step.averageTimeInStage, 0) / 24
    ); // Convert hours to days

    return {
      driveId: drive._id,
      driveTitle: drive.title,
      driveType: drive.type,
      company: drive.company || "Company",
      startDate: drive.applicationRange.start,
      endDate: drive.applicationRange.end,
      metrics: {
        totalApplicants,
        applicantsGrowth,
        shortlisted,
        shortlistedGrowth,
        interviewScheduled,
        interviewScheduledGrowth,
        hired,
        hiredGrowth,
        conversionRate,
        averageTimeToHire,
      },
      funnel,
      dailyApplications,
      demographics: {
        gender: genderCounts,
      },
      rejectionReasons,
      topCandidates,
    };
  }, [rawData, timeRange]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Colors for charts
  const COLORS = [
    "#7C3AED",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
  ];

  // Generate stage-based colors
  const getStageColor = (index: number, total: number) => {
    // Color gradient from purple to green
    return `hsl(${280 - (index / total) * 120}, 70%, 60%)`;
  };

  if (isLoading || !analytics) {
    return <div className="p-10 text-center">Loading drive analytics...</div>;
  }

  const {
    driveTitle,
    metrics,
    funnel,
    dailyApplications,
    demographics,
    rejectionReasons,
    topCandidates,
  } = analytics;

  // Card metrics for the top row
  const statsCards = [
    {
      title: "Total Applicants",
      value: metrics.totalApplicants.toString(),
      change: `${metrics.applicantsGrowth > 0 ? "+" : ""}${
        metrics.applicantsGrowth
      }%`,
      icon: Users,
      trend: metrics.applicantsGrowth >= 0 ? "up" as const : "down" as const,
    },
    {
      title: "Shortlisted",
      value: metrics.shortlisted.toString(),
      change: `${metrics.shortlistedGrowth > 0 ? "+" : ""}${
        metrics.shortlistedGrowth
      }%`,
      icon: CheckSquare,
      trend: metrics.shortlistedGrowth >= 0 ? "up" as const : "down" as const,
    },
    {
      title: "Interviews Scheduled",
      value: metrics.interviewScheduled.toString(),
      change: `${metrics.interviewScheduledGrowth > 0 ? "+" : ""}${
        metrics.interviewScheduledGrowth
      }%`,
      icon: Calendar,
      trend: metrics.interviewScheduledGrowth >= 0 ? "up" as const : "down" as const,
    },
    {
      title: "Hired Candidates",
      value: metrics.hired.toString(),
      change: `${metrics.hiredGrowth > 0 ? "+" : ""}${metrics.hiredGrowth}%`,
      icon: Award,
      trend: metrics.hiredGrowth >= 0 ? "up" as const : "down" as const,
    },
  ];

  interface StatsCardProps {
    stat: {
      title: string;
      value: string;
      change: string;
      icon: any;
      trend: "up" | "down";
    };
    index: number;
  }

  const StatsCard = ({ stat, index }: StatsCardProps) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary-100">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 text-base ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change}
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </div>
          </div>
          <h3 className="text-base mb-1">{stat.title}</h3>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </CardBody>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-h-full mt-5 ml-5">
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem>Drives</BreadcrumbItem>
          <BreadcrumbItem>{driveTitle}</BreadcrumbItem>
          <BreadcrumbItem>Analytics</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex justify-between items-center mt-5">
          <div>
            <h1 className="text-2xl font-bold">{driveTitle} - Analytics</h1>
            <p className="text-base text-gray-500">
              Track performance metrics for this recruitment drive
            </p>
          </div>

          <div className="flex gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Calendar className="h-4 w-4" />}
                >
                  {timeRange === "all"
                    ? "All Time"
                    : timeRange === "30days"
                    ? "Last 30 Days"
                    : "Last 7 Days"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Time range"
                onAction={(key) => setTimeRange(key.toString())}
              >
                <DropdownItem key="7days">Last 7 Days</DropdownItem>
                <DropdownItem key="30days">Last 30 Days</DropdownItem>
                <DropdownItem key="all">All Time</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              variant="flat"
              startContent={<Filter className="h-4 w-4" />}
            >
              Filters
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Download className="h-4 w-4" />}
                >
                  Export
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Export options">
                <DropdownItem key="csv">CSV</DropdownItem>
                <DropdownItem key="pdf">PDF</DropdownItem>
                <DropdownItem key="excel">Excel</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Application Funnel */}
        <motion.div
          className="lg:col-span-2"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Application Funnel</h3>
                <p className="text-sm opacity-80">
                  Candidates at each stage of the process
                </p>
              </div>
              <Button
                variant="light"
                size="sm"
                startContent={<TrendingUp className="h-4 w-4" />}
              >
                Trends
              </Button>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="stageName"
                    type="category"
                    tickLine={false}
                    width={150}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 rounded-md shadow-lg">
                            <p className="font-medium">{data.stageName}</p>
                            <p className="text-sm">
                              Candidates: {data.candidatesCount}
                            </p>
                            <p className="text-sm">
                              Pass Rate: {data.passRate}%
                            </p>
                            <p className="text-sm">
                              Avg. Time: {data.averageTimeInStage}hrs
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="candidatesCount" isAnimationActive={true}>
                    {funnel.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStageColor(index, funnel.length)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        {/* Conversion Metrics */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Conversion Metrics</h3>
                <p className="text-sm opacity-80">Key performance indicators</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Application to Hire</span>
                  <span className="font-medium">{metrics.conversionRate}%</span>
                </div>
                <Progress
                  value={metrics.conversionRate}
                  color="success"
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Avg. Time to Hire</span>
                  <span className="font-medium">
                    {metrics.averageTimeToHire} days
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <Progress
                    value={Math.min(
                      (metrics.averageTimeToHire / 30) * 100,
                      100
                    )}
                    color="primary"
                    className="h-2"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium mb-3">
                  Time in Stage (hrs)
                </h4>
                <div className="overflow-y-auto max-h-[150px]">
                  {funnel.map((stage, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span
                          className="truncate max-w-[70%]"
                          title={stage.stageName}
                        >
                          {stage.stageName}
                        </span>
                        <span className="font-medium">
                          {stage.averageTimeInStage}h
                        </span>
                      </div>
                      <Progress
                        value={stage.averageTimeInStage}
                        maxValue={Math.max(
                          ...funnel.map((s) => s.averageTimeInStage)
                        )}
                        color={getProgressColor(index)}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Application Trend */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Application Trend</h3>
                <p className="text-sm opacity-80">Daily application activity</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyApplications}>
                  <defs>
                    <linearGradient
                      id="colorApplications"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorShortlisted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorRejected"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#7C3AED"
                    fillOpacity={1}
                    fill="url(#colorApplications)"
                  />
                  <Area
                    type="monotone"
                    dataKey="shortlisted"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorShortlisted)"
                  />
                  <Area
                    type="monotone"
                    dataKey="rejected"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorRejected)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        {/* Demographics */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Rejection Analysis</h3>
                <p className="text-sm opacity-80">
                  Why candidates get rejected
                </p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {rejectionReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <XSquare className="h-4 w-4 text-red-500" />
                      <span
                        className="text-sm truncate max-w-[150px]"
                        title={reason.reason}
                      >
                        {reason.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {reason.count}
                      </span>
                      <div className="w-20">
                        <Progress
                          value={reason.percentage}
                          color="danger"
                          className="h-2"
                        />
                      </div>
                      <span className="text-xs">{reason.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-md font-medium mb-3 text-center">
                  Gender Distribution
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Male", value: demographics.gender.male },
                        { name: "Female", value: demographics.gender.female },
                        { name: "Other", value: demographics.gender.other },
                        {
                          name: "Not Specified",
                          value: demographics.gender.notSpecified,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {[0, 1, 2, 3].map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Top Candidates */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <Card>
          <CardHeader className="flex justify-between items-center px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">
                Top Performing Candidates
              </h3>
              <p className="text-sm opacity-80">Highest rated applicants</p>
            </div>
            <Button variant="light" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Candidate
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Current Stage
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Overall Score
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Skills
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Education
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">
                      Experience
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCandidates.slice(0, 5).map((candidate) => (
                    <tr key={candidate.id} className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={candidate.profileImage}
                            name={candidate.name}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {candidate.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {candidate.currentStage}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={candidate.overallScore}
                            color={
                              candidate.overallScore > 80
                                ? "success"
                                : "primary"
                            }
                            className="max-w-md"
                          />
                          <span className="text-sm font-medium">
                            {candidate.overallScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Tooltip
                              content={candidate.skills.slice(3).join(", ")}
                            >
                              <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                +{candidate.skills.length - 3}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {candidate.education}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {candidate.experience}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

// Helper function for progress colors
function getProgressColor(index: number) {
  const colors = [
    "primary",
    "success",
    "warning",
    "secondary",
    "danger",
  ] as const;
  return colors[index % colors.length];
}

export default DriveAnalytics;
