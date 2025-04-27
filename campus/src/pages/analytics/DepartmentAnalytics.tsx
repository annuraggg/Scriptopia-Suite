import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Spinner,
} from "@nextui-org/react";
import { DepartmentStats } from "@shared-types/InstituteAnalytics";
import Stat from "./Stat";
import { useAnalyticsService } from "./analytics";
import { Building, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DepartmentAnalytics() {
  const [departmentStats, setDepartmentStats] =
    useState<DepartmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const analyticsService = useAnalyticsService();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await analyticsService.fetchDepartmentAnalytics();
        setDepartmentStats(data);
      } catch (error) {
        console.error("Error fetching department analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !departmentStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" color="primary" />
        <span className="ml-4 text-gray-600">
          Loading department analytics...
        </span>
      </div>
    );
  }

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
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Stat
            title="Total Departments"
            value={departmentStats.totalDepartments}
            icon={<Building size={20} />}
            color="bg-blue-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Departments with Placements"
            value={departmentStats.summary.departmentsWithPlacements}
            icon={<CheckCircle size={20} />}
            color="bg-emerald-600"
          />
        </motion.div>
        <motion.div variants={item}>
          <Stat
            title="Departments with Candidates"
            value={departmentStats.summary.departmentsWithCandidates}
            icon={<Users size={20} />}
            color="bg-purple-600"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Department Placement Rates
            </h4>
          </CardHeader>
          <CardBody className="p-0">
            <Table
              aria-label="Department placement rates"
              classNames={{
                th: "bg-gray-50 text-gray-600 text-xs uppercase tracking-wider py-3",
                td: "py-3",
              }}
            >
              <TableHeader>
                <TableColumn>DEPARTMENT</TableColumn>
                <TableColumn>CANDIDATES</TableColumn>
                <TableColumn>PLACEMENT RATE</TableColumn>
                <TableColumn>PROGRESS</TableColumn>
              </TableHeader>
              <TableBody>
                {departmentStats.departmentStats.map((dept, index) => (
                  <TableRow
                    key={dept.departmentId}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className="font-medium text-gray-700">
                      {dept.name}
                    </TableCell>
                    <TableCell>
                      {dept.placementMetrics.totalCandidates}
                    </TableCell>
                    <TableCell className="font-medium">
                      {dept.placementMetrics.placementRate.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Progress
                        value={dept.placementMetrics.placementRate}
                        color={
                          dept.placementMetrics.placementRate > 70
                            ? "success"
                            : dept.placementMetrics.placementRate > 40
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                        radius="sm"
                        classNames={{
                          track: "bg-gray-200",
                          indicator:
                            "bg-gradient-to-r from-blue-400 to-blue-600",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
