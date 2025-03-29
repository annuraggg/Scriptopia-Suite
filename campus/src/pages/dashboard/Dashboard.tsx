import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  HelpCircle,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Bell,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@nextui-org/react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("monthly");

  const mockChartData = [
    { name: "Jan", applications: 65, interviews: 28 },
    { name: "Feb", applications: 59, interviews: 32 },
    { name: "Mar", applications: 80, interviews: 41 },
    { name: "Apr", applications: 81, interviews: 37 },
    { name: "May", applications: 56, interviews: 25 },
    { name: "Jun", applications: 55, interviews: 29 },
  ];

  const metrics = [
    {
      title: "Active Drives",
      value: 24,
      change: 12,
      icon: <Briefcase className="w-6 h-6 text-blue-500" />,
    },
    {
      title: "Total Candidates",
      value: 847,
      change: -5,
      icon: <Users className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Open Positions",
      value: 16,
      change: 8,
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
    },
  ];

  const activities = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      status: "completed",
      progress: 100,
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      status: "in-progress",
      progress: 65,
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      status: "in-progress",
      progress: 45,
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, Team
          </h1>
          <p className="mt-2">
            Here's what's happening with your recruitment today.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <Button color="primary">
            <Plus className="w-5 h-5" />
            Create Drives
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={metric.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {metric.icon}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 
                ${
                  metric.change >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {metric.change >= 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <h3 className="text-3xl font-bold">{metric.value}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {metric.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recruitment Overview</h2>
            <div className="flex gap-2">
              {["monthly", "weekly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm">
              View All
            </button>
          </div>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center
                    ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {activity.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.department}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${activity.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Button */}
      <motion.button className="fixed bottom-8 right-8 p-4 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all">
        <HelpCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Dashboard;
