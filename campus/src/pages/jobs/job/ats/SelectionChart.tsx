import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  selected: {
    label: "Selected",
  },
} satisfies ChartConfig;

export const SelectionChart = ({
  chartData,
}: {
  chartData: { total: number; selected: number };
}) => {
  const percentage = (chartData.selected / chartData.total) * 100;

  const data = [
    {
      name: "Selected",
      value: chartData.selected,
      fill: "var(--color-selected)",
    },
    { name: "Total", value: chartData.total, fill: "transparent" },
  ];
  return (
    <Card className="flex flex-col w-fit overflow-hidden">
      <CardHeader className="items-center pb-0">Selection Rate</CardHeader>
      <CardBody className="flex items-center justify-between overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <ChartContainer
            config={chartConfig}
            className="aspect-square min-w-[400px] overflow-hidden max-h-[250px]"
          >
            <RadialBarChart
              data={data}
              startAngle={0}
              endAngle={360}
              innerRadius={80}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="value" color="white" className="fill-white" />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-white text-4xl font-bold"
                          >
                            {chartData.selected.toLocaleString()} /{" "}
                            {chartData.total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={((viewBox.cy || 0) + 5) + 24}
                            className="fill-white mt-2"
                          >
                            selected
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardBody>
      <CardFooter className="flex items-center justify-center pb-7">
        <TrendingUp size={24} className="fill-selected mr-2" />
        <p className="text-lg font-bold">
          Selection Rate: {percentage.toFixed(2)}%
        </p>
      </CardFooter>
    </Card>
  );
};
