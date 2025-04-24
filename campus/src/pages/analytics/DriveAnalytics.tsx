import { DriveStats } from "@shared-types/InstituteAnalytics";
import Stat from "./Stat";
import DriveDistributionChart from "./DriveDistributionChart";
import TimelineChart from "./TimelineChart";
import { Briefcase, CheckCircle, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface DriveAnalyticsProps {
  driveStats: DriveStats;
  timelineData: {
    driveCreationTimeline: Array<{ month: string; count: number }>;
    drivePublishingTimeline: Array<{ month: string; count: number }>;
  };
}

export default function DriveAnalytics({
  driveStats,
  timelineData,
}: DriveAnalyticsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Stat
            title="Total Drives"
            value={driveStats.totalDrives}
            icon={<Briefcase size={20} />}
            color="bg-blue-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Ongoing Drives"
            value={driveStats.ongoingDrives}
            icon={<Clock size={20} />}
            color="bg-emerald-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Completed Drives"
            value={driveStats.completedDrives}
            icon={<CheckCircle size={20} />}
            color="bg-purple-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Avg Max Salary"
            value={`${
              driveStats.salaryStatistics.commonCurrency
            } ${driveStats.salaryStatistics.avgMaxSalary.toLocaleString()}`}
            icon={<CreditCard size={20} />}
            color="bg-amber-500"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div>
          <DriveDistributionChart distribution={driveStats.driveTypes} />
        </div>
        <div>
          <TimelineChart
            title="Drive Creation Timeline"
            data={timelineData.driveCreationTimeline}
            color="#3b82f6"
          />
        </div>
      </motion.div>
    </div>
  );
}
