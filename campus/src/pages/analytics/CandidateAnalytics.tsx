import { Users, UserCheck, FileText, CheckCheck } from "lucide-react";
import { CandidateStats } from "@shared-types/InstituteAnalytics";
import Stat from "./Stat";
import CandidatePlacementChart from "./CandidatePlacementChart";
import { motion } from "framer-motion";

interface CandidateAnalyticsProps {
  candidateStats: CandidateStats;
}

export default function CandidateAnalytics({
  candidateStats,
}: CandidateAnalyticsProps) {
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
            title="Total Candidates"
            value={candidateStats.totalCandidates}
            icon={<Users size={20} />}
            color="bg-blue-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Pending Candidates"
            value={candidateStats.pendingCandidates}
            icon={<UserCheck size={20} />}
            color="bg-amber-500"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Total Applications"
            value={candidateStats.applicationStats.totalApplications}
            icon={<FileText size={20} />}
            color="bg-indigo-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Placement Rate"
            value={`${candidateStats.placementStats.placementRate.toFixed(1)}%`}
            icon={<CheckCheck size={20} />}
            color="bg-emerald-600"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="col-span-1">
          <CandidatePlacementChart
            placed={candidateStats.placementStats.placed}
            unplaced={candidateStats.placementStats.unplaced}
          />
        </div>
      </motion.div>
    </div>
  );
}
