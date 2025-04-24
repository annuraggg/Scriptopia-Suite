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

interface CandidatePlacementChartProps {
  placed: number;
  unplaced: number;
}

export default function CandidatePlacementChart({
  placed,
  unplaced,
}: CandidatePlacementChartProps) {
  const data = [
    { name: "Placed", value: placed },
    { name: "Unplaced", value: unplaced },
  ];

  const COLORS = ["#10b981", "#f97316"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800">
            Candidate Placement
          </h4>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[0] }}
              ></div>
              <span className="text-sm text-gray-600">Placed</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[1] }}
              ></div>
              <span className="text-sm text-gray-600">Unplaced</span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-2 py-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
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
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} candidates`, "Count"]}
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
