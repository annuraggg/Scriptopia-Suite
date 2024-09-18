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
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

export const SelectionChart = ({
  chartData,
}: {
  chartData: { candidates: number }[];
}) => {
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
              data={chartData}
              endAngle={100}
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
              <RadialBar dataKey="candidates" color="white" className="fill-white" />
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
                            {chartData[0].candidates.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-white"
                          >
                            candidates
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

        <CardFooter className="flex-col items-start gap-2 text-sm min-h-[10vh]">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% today <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total resumes for the last 15 days
          </div>
        </CardFooter>
      </CardBody>
    </Card>
  );
};
