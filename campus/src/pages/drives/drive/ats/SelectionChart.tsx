import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const SelectionChart = ({
  chartData,
}: {
  chartData: { total: number; selected: number };
}) => {
  const percentage = (chartData.selected / chartData.total) * 100;

  const data = [
    {
      name: "Selected",
      value: chartData.selected,
      fill: "url(#colorGradient)",
    },
    {
      name: "Total",
      value: chartData.total,
      fill: "#e2e8f0", // Light gray background
    },
  ];

  return (
    <Card className="h-full w-full shadow-none">
      <CardHeader className="text-center pb-0">
        <h3 className="text-xl font-semibold text-gray-800">Selection Rate</h3>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-0">
        <div className="relative w-full h-full">
          <RadialBarChart
            data={data}
            startAngle={0}
            endAngle={360}
            innerRadius={80}
            outerRadius={140}
            barSize={30}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <PolarGrid gridType="circle" radialLines={false} stroke="none" />
            <RadialBar dataKey="value" background  />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <g>
                        <text
                          x={viewBox.cx}
                          y={viewBox?.cy ?? 0}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox?.cy ?? 0 - 10}
                            className="text-4xl font-bold fill-gray-700"
                          >
                            {chartData.selected.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox?.cy ?? 0 + 20}
                            className="text-lg fill-gray-500"
                          >
                            of {chartData.total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox?.cy ?? 0 + 45}
                            className="text-sm fill-gray-400"
                          >
                            selected
                          </tspan>
                        </text>
                      </g>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center pb-6 pt-2">
        <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
        <p className="text-lg font-semibold text-gray-700">
          {percentage.toFixed(1)}% Selection Rate
        </p>
      </CardFooter>
    </Card>
  );
};

export default SelectionChart;
