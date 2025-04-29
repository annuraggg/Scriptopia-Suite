import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spacer,
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useAnalyticsService } from "./analytics";
import {
  AnalyticsData,
  DashboardStats,
} from "@shared-types/InstituteAnalytics";
import OverviewStats from "./OverviewStats";
import RecentActivity from "./RecentActivity";
import DriveDistributionChart from "./DriveDistributionChart";
import OngoingApplications from "./OngoingApplications";
import UpcomingEvents from "./UpcomingEvents";
import DriveAnalytics from "./DriveAnalytics";
import CandidateAnalytics from "./CandidateAnalytics";
import DepartmentAnalytics from "./DepartmentAnalytics";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const analyticsService = useAnalyticsService();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardData, analyticsResults] = await Promise.all([
          analyticsService.fetchDashboardStats(),
          analyticsService.fetchAnalytics(),
        ]);

        setDashboardStats(dashboardData);
        setAnalyticsData(analyticsResults);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !dashboardStats || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2  ">
              Analytics Dashboard
            </h1>
            <Breadcrumbs className="text-sm">
              <BreadcrumbItem>Analytics</BreadcrumbItem>
              <BreadcrumbItem>{dashboardStats.institute.name}</BreadcrumbItem>
            </Breadcrumbs>
          </div>

          <Tabs
            aria-label="Dashboard tabs"
            color="primary"
            variant="solid"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            classNames={{
              tabList: "bg-white shadow-sm rounded-lg p-1",
              cursor: "bg-primary-100",
              tab: "data-[hover=true]:text-primary h-10",
              tabContent: "group-data-[selected=true]:text-primary font-medium",
            }}
          >
            <Tab key="overview" title="Overview">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Card className="shadow-md border-none mt-4">
                  <CardBody className="p-6">
                    <OverviewStats stats={dashboardStats} />

                    <Spacer y={4} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DriveDistributionChart
                        distribution={dashboardStats.driveTypeDistribution}
                      />
                      <UpcomingEvents events={dashboardStats.upcomingEvents} />
                    </div>

                    <Spacer y={4} />

                    <div className="grid grid-cols-1 gap-6">
                      <OngoingApplications
                        applications={dashboardStats.ongoingApplications}
                      />
                      <RecentActivity
                        activities={dashboardStats.recentActivity}
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </Tab>

            <Tab key="drives" title="Drive Analytics">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Card className="shadow-md border-none mt-4">
                  <CardBody className="p-6">
                    <DriveAnalytics
                      driveStats={analyticsData.driveStats}
                      timelineData={{
                        driveCreationTimeline:
                          analyticsData.timelineStats.driveCreationTimeline,
                        drivePublishingTimeline:
                          analyticsData.timelineStats.drivePublishingTimeline,
                      }}
                    />
                  </CardBody>
                </Card>
              </motion.div>
            </Tab>

            <Tab key="candidates" title="Candidate Analytics">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Card className="shadow-md border-none mt-4">
                  <CardBody className="p-6">
                    <CandidateAnalytics
                      candidateStats={analyticsData.candidateStats}
                    />
                  </CardBody>
                </Card>
              </motion.div>
            </Tab>

            <Tab key="departments" title="Department Analytics">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Card className="shadow-md border-none mt-4">
                  <CardBody className="p-6">
                    <DepartmentAnalytics />
                  </CardBody>
                </Card>
              </motion.div>
            </Tab>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
