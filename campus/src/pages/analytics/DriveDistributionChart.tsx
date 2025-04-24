import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface DriveDistributionProps {
  distribution: Record<string, number>;
}

export default function DriveDistributionChart({
  distribution,
}: DriveDistributionProps) {
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const data = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden h-full">
        <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Drive Type Distribution
          </h4>
        </CardHeader>
        <CardBody className="px-2 py-4">
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} drives`, "Count"]}
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
