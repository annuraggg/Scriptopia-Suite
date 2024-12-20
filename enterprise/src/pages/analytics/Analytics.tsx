import { useState } from 'react';
import { RootState } from "@/types/Reducer";
import { useSelector } from "react-redux";
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
  Progress
} from "@nextui-org/react";
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
  Area
} from 'recharts';
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
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const userGrowthData = [
  { month: 'Jan', activeUsers: 1200, totalUsers: 1500, projectedUsers: 1600 },
  { month: 'Feb', activeUsers: 1500, totalUsers: 1800, projectedUsers: 1900 },
  { month: 'Mar', activeUsers: 2000, totalUsers: 2300, projectedUsers: 2400 },
  { month: 'Apr', activeUsers: 2400, totalUsers: 2800, projectedUsers: 2900 },
  { month: 'May', activeUsers: 2800, totalUsers: 3200, projectedUsers: 3400 },
  { month: 'Jun', activeUsers: 3200, totalUsers: 3600, projectedUsers: 3800 },
];

const jobPostingsData = [
  { status: 'Open', count: 150, growth: 15 },
  { status: 'In Progress', count: 85, growth: 10 },
  { status: 'Closed', count: 75, growth: -5 },
  { status: 'Expired', count: 25, growth: -2 },
];

const jobPerformanceData = [
  { position: 'Software Engineer', views: 1200, clicks: 300, applications: 80, conversionRate: 26.7 },
  { position: 'Product Manager', views: 800, clicks: 200, applications: 40, conversionRate: 20 },
  { position: 'Data Analyst', views: 600, clicks: 150, applications: 30, conversionRate: 20 },
  { position: 'UX Designer', views: 900, clicks: 250, applications: 50, conversionRate: 20 },
];

const userActivityData = [
  { hour: '00:00', users: 350 },
  { hour: '04:00', users: 200 },
  { hour: '08:00', users: 1200 },
  { hour: '12:00', users: 1800 },
  { hour: '16:00', users: 1600 },
  { hour: '20:00', users: 800 },
];

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'];

const Analytics = () => {
  const org = useSelector((state: RootState) => state.organization);
  const [timeRange, setTimeRange] = useState('30days');

  const statsCards = [
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
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem>Analytics</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
            <p className="text-zinc-500 mt-1">Track your organization's performance and metrics</p>
          </div>
          <div className="flex gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Calendar className="h-4 w-4" />}
                  className=""
                >
                  {timeRange === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Time range selection"
                onAction={(key) => setTimeRange(key.toString())}
              >
                <DropdownItem key="7days">Last 7 Days</DropdownItem>
                <DropdownItem key="30days">Last 30 Days</DropdownItem>
                <DropdownItem key="90days">Last 90 Days</DropdownItem>
                <DropdownItem key="custom">Custom Range</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              className=""
              startContent={<Filter className="h-4 w-4" />}
            >
              Filters
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<Download className="h-4 w-4" />}
                  className=""
                >
                  Export
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Export options">
                <DropdownItem key="csv">Export as CSV</DropdownItem>
                <DropdownItem key="pdf">Export as PDF</DropdownItem>
                <DropdownItem key="excel">Export as Excel</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-zinc-800`}>
                    <stat.icon className={`h-6 w-6`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                    {stat.trend === 'up' ?
                      <ArrowUpRight className="h-4 w-4" /> :
                      <ArrowDownRight className="h-4 w-4" />
                    }
                  </div>
                </div>
                <h3 className="text-gray-300 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-">{stat.value}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">User Growth</h3>
                <p className="text-sm text-gray-500">Monthly user acquisition trend</p>
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
                    <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
          <Card className="shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Daily User Activity</h3>
                <p className="text-sm text-gray-500">24-hour activity distribution</p>
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
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
          <Card className="shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Job Postings Performance</h3>
                <p className="text-sm text-gray-500">Detailed metrics by position</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Position</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Views</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Clicks</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Applications</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Conversion Rate</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobPerformanceData.map((job, index) => (
                      <tr key={job.position} className="border-b border-gray-100 hover:bg-zinc-600">
                        <td className="py-4 px-4 text-sm font-medium">{job.position}</td>
                        <td className="py-4 px-4 text-sm">{job.views.toLocaleString()}</td>
                        <td className="py-4 px-4 text-sm">{job.clicks.toLocaleString()}</td>
                        <td className="py-4 px-4 text-sm">{job.applications.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={job.conversionRate}
                              className="max-w-md"
                              color={job.conversionRate > 25 ? "success" : "warning"}
                            />
                            <span className="text-sm">{job.conversionRate}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${index === 0 ? 'bg-green-100 text-green-800' :
                            index === 1 ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {index === 0 ? 'High Performance' :
                              index === 1 ? 'Good' : 'Needs Attention'}
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
          <Card className="shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Job Status Distribution</h3>
                <p className="text-sm text-gray-500">Current status of all postings</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
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
                    {jobPostingsData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={({ payload }) => (
                      <div className="flex justify-center gap-6">
                        {payload && payload.map((entry, index) => (
                          <div key={`legend-${index}`} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-gray-600">{entry.value}</span>
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
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="flex justify-between items-center px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Posting Growth Trends</h3>
                <p className="text-sm text-gray-500">Month-over-month changes</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobPostingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="status" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="growth"
                    fill="#7C3AED"
                    radius={[4, 4, 0, 0]}
                  >
                    {jobPostingsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.growth > 0 ? '#10B981' : '#EF4444'}
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