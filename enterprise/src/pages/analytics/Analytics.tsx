import { useState } from "react";
import { RootState } from "@/types/Reducer";
import { useSelector } from "react-redux";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Select, SelectItem } from "@heroui/select";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  Briefcase,
  Activity,
  Target,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

interface JobPostingData {
  status: string;
  count: number;
  growth: number;
  description: string;
  color: string;
}

interface GrowthData {
  status: string;
  growth: number;
}

interface MonthData {
  [key: string]: GrowthData[];
}

interface YearData {
  [key: string]: MonthData;
}

const userGrowthData = [
  { month: "Jan", activeUsers: 1200, totalUsers: 1500, projectedUsers: 1600 },
  { month: "Feb", activeUsers: 1500, totalUsers: 1800, projectedUsers: 1900 },
  { month: "Mar", activeUsers: 2000, totalUsers: 2300, projectedUsers: 2400 },
  { month: "Apr", activeUsers: 2400, totalUsers: 2800, projectedUsers: 2900 },
  { month: "May", activeUsers: 2800, totalUsers: 3200, projectedUsers: 3400 },
  { month: "Jun", activeUsers: 3200, totalUsers: 3600, projectedUsers: 3800 },
];

const jobPostingsData: JobPostingData[] = [
  {
    status: "Open",
    count: 150,
    growth: 15,
    description: "Active job listings currently accepting applications",
    color: "#7C3AED", // Purple
  },
  {
    status: "In Progress",
    count: 85,
    growth: 10,
    description: "Jobs with ongoing interview processes",
    color: "#3B82F6", // Blue
  },
  {
    status: "Closed",
    count: 75,
    growth: -5,
    description: "Successfully filled positions",
    color: "#10B981", // Green
  },
  {
    status: "Expired",
    count: 25,
    growth: -2,
    description: "Listings that reached their deadline",
    color: "#F59E0B", // Yellow
  },
];

const jobPerformanceData = [
  {
    position: "Software Engineer",
    views: 1200,
    clicks: 300,
    applications: 80,
    conversionRate: 26.7,
  },
  {
    position: "Product Manager",
    views: 800,
    clicks: 200,
    applications: 40,
    conversionRate: 20,
  },
  {
    position: "Data Analyst",
    views: 600,
    clicks: 150,
    applications: 30,
    conversionRate: 20,
  },
  {
    position: "UX Designer",
    views: 900,
    clicks: 250,
    applications: 50,
    conversionRate: 20,
  },
];

const userActivityData = [
  { hour: "00:00", users: 350 },
  { hour: "04:00", users: 200 },
  { hour: "08:00", users: 1200 },
  { hour: "12:00", users: 1800 },
  { hour: "16:00", users: 1600 },
  { hour: "20:00", users: 800 },
];

const monthlyGrowthData: YearData = {
  "2024": {
    Jan: [
      { status: "Open", growth: 15 },
      { status: "In Progress", growth: 10 },
      { status: "Closed", growth: -5 },
      { status: "Expired", growth: -2 },
    ],
    Feb: [
      { status: "Open", growth: 20 },
      { status: "In Progress", growth: 12 },
      { status: "Closed", growth: -3 },
      { status: "Expired", growth: -1 },
    ],
    Mar: [
      { status: "Open", growth: 18 },
      { status: "In Progress", growth: 15 },
      { status: "Closed", growth: -2 },
      { status: "Expired", growth: -1 },
    ],
  },
};

const Analytics = () => {
  const org = useSelector((state: RootState) => state.organization);
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedMonth, setSelectedMonth] = useState<string>("Jan");
  const currentGrowthData: GrowthData[] =
    monthlyGrowthData[selectedYear]?.[selectedMonth] || [];

  type StatCard = {
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: "up" | "down";
  };

  const statsCards: StatCard[] = [
    {
      title: "Total Users",
      value: "3,200",
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Job Postings",
      value: "150",
      change: "+8.2%",
      icon: Briefcase,
      trend: "up",
    },
    {
      title: "Application Rate",
      value: "78%",
      change: "-2.4%",
      icon: Target,
      trend: "down",
    },
    {
      title: "User Engagement",
      value: "92%",
      change: "+5.1%",
      icon: Activity,
      trend: "up",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  interface StatsCardProp {
    stat: StatCard;
    index: number;
  }

  const StatsCard = ({ stat, index }: StatsCardProp) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 text-base">
              {stat.change}
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </div>
          </div>
          <h3 className="text-base mb-1">{stat.title}</h3>
          <p className="text-base">{stat.value}</p>
        </CardBody>
      </Card>
    </motion.div>
  );

  return (
    <div className=" max-h-full mt-5 ml-5">
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem>Analytics</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex justify-between items-center mt-5">
          <div>
            <h1 className="text-base">Analytics Dashboard</h1>
            <p className="text-base">Track your organization's performance</p>
          </div>

          <div className="flex gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Calendar className="h-4 w-4" />}
                >
                  {timeRange === "30days" ? "Last 30 Days" : "Last 90 Days"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Time range"
                onAction={(key) => setTimeRange(key.toString())}
              >
                <DropdownItem key="7days">Last 7 Days</DropdownItem>
                <DropdownItem key="30days">Last 30 Days</DropdownItem>
                <DropdownItem key="90days">Last 90 Days</DropdownItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">User Growth</h3>
                <p className="text-sm opacity-80">
                  Monthly user acquisition trend
                </p>
              </div>
              <Button
                variant="light"
                size="sm"
                startContent={<Filter className="h-4 w-4" />}
              >
                Filter
              </Button>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient
                      id="colorGradient1"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorGradient2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(229, 231, 235, 0.2)"
                  />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#7C3AED"
                    fill="url(#colorGradient1)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalUsers"
                    stroke="#3B82F6"
                    fill="url(#colorGradient2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Daily User Activity</h3>
                <p className="text-sm  opacity-80">
                  24-hour activity distribution
                </p>
              </div>
              <Button
                variant="light"
                size="sm"
                startContent={<UserCheck className="h-4 w-4" />}
              >
                Details
              </Button>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userActivityData}>
                  <defs>
                    <linearGradient
                      id="colorActivity"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(229, 231, 235, 0.2)"
                  />
                  <XAxis dataKey="hour" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#10B981"
                    fill="url(#colorActivity)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Job Postings Performance
                </h3>
                <p className="text-sm  opacity-80">
                  Detailed metrics by position
                </p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b ">
                      <th className="py-3 px-4 text-left text-sm font-semibold ">
                        Position
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold ">
                        Views
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold ">
                        Clicks
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold ">
                        Applications
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold ">
                        Conversion Rate
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold ">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobPerformanceData.map((job, index) => (
                      <tr key={job.position} className="border-b">
                        <td className="py-4 px-4 text-sm font-medium">
                          {job.position}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {job.views.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {job.clicks.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {job.applications.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={job.conversionRate}
                              className="max-w-md"
                              color={
                                job.conversionRate > 25 ? "success" : "warning"
                              }
                            />
                            <span className="text-sm">
                              {job.conversionRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              index === 0
                                ? "bg-green-100 text-green-800"
                                : index === 1
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {index === 0
                              ? "High Performance"
                              : index === 1
                              ? "Good"
                              : "Needs Attention"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Job Status Distribution
                </h3>
                <p className="text-sm  opacity-80">
                  Current status of all postings
                </p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 flex flex-row gap-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobPostingsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {jobPostingsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    wrapperStyle={{
                      paddingLeft: "32px",
                    }}
                    content={({ payload }) => (
                      <div className="flex flex-col gap-2">
                        {payload &&
                          payload.map((entry, index) => (
                            <div
                              key={`legend-${index}`}
                              className="flex items-start gap-2"
                            >
                              <div
                                className="w-3 h-3 rounded-full mt-1.5"
                                style={{ backgroundColor: entry.color }}
                              />
                              <div>
                                <span className="text-sm font-medium">
                                  {entry.value}
                                </span>
                                <p className="text-xs">
                                  {jobPostingsData[index].description}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="pb-2"
          transition={{ delay: 0.8 }}
        >
          <Card className="">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Posting Growth Trends</h3>
                <p className="text-sm  opacity-80">Month-over-month changes</p>
              </div>
              <div className="flex gap-2 w-[40%]">
                <Select
                  selectedKeys={[selectedYear]}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className=""
                >
                  {Object.keys(monthlyGrowthData).map((year) => (
                    <SelectItem key={year}>{year}</SelectItem>
                  ))}
                </Select>
                <Select
                  selectedKeys={[selectedMonth]}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className=""
                >
                  {Object.keys(monthlyGrowthData[selectedYear] || {}).map(
                    (month) => (
                      <SelectItem key={month}>{month}</SelectItem>
                    )
                  )}
                </Select>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(229, 231, 235, 0.2)"
                  />
                  <XAxis dataKey="status" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Growth"]}
                  />
                  <Bar dataKey="growth" fill="#7C3AED" radius={[4, 4, 0, 0]}>
                    {currentGrowthData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.growth > 0 ? "#10B981" : "#EF4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
