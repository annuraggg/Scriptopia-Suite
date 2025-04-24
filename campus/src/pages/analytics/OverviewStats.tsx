import { Users, Briefcase, Building2, Award } from "lucide-react";
import Stat from "./Stat";
import { DashboardStats } from "@shared-types/InstituteAnalytics";
import { motion } from "framer-motion";

interface OverviewStatsProps {
  stats: DashboardStats;
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
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
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Stat
          title="Total Candidates"
          value={stats.quickStats.totalCandidates}
          icon={<Users size={22} />}
          color="bg-blue-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <Stat
          title="Active Drives"
          value={stats.quickStats.activeDrives}
          icon={<Briefcase size={22} />}
          color="bg-emerald-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <Stat
          title="Companies"
          value={stats.quickStats.totalDrives}
          icon={<Building2 size={22} />}
          color="bg-purple-600"
        />
      </motion.div>
      <motion.div variants={item}>
        <Stat
          title="Placement Rate"
          value={stats.quickStats.placementRate}
          icon={<Award size={22} />}
          color="bg-amber-500"
        />
      </motion.div>
    </motion.div>
  );
}
