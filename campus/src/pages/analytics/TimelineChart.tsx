import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";

interface TimelineData {
  month: string;
  count: number;
}

interface TimelineChartProps {
  title: string;
  data: TimelineData[];
  color?: string;
}

export default function TimelineChart({
  title,
  data,
  color = "#8884d8",
}: TimelineChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    monthLabel: item.month.substring(5),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-md overflow-hidden h-full">
        <CardHeader className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        </CardHeader>
        <CardBody className="px-2 py-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fontSize: 12, fill: "#666" }}
                  tickLine={{ stroke: "#ccc" }}
                  axisLine={{ stroke: "#ccc" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#666" }}
                  tickLine={{ stroke: "#ccc" }}
                  axisLine={{ stroke: "#ccc" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Count"]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={color}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  activeDot={{ r: 8, strokeWidth: 0, fill: color }}
                  name="Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
