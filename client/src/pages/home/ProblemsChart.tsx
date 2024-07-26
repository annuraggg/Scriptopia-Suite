"use client";

import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardHeader } from "@nextui-org/react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  problems: {
    label: "Problems",
  },
  easy: {
    label: "Easy",
    color: "hsl(var(--chart-3))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-2))",
  },
  hard: {
    label: "Hard",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProblemsChart({
  easyNo = 0,
  mediumNo = 0,
  hardNo = 0,
}: {
  easyNo: number;
  mediumNo: number;
  hardNo: number;
}) {
  const chartData = useMemo(() => {
    return [
      { level: "easy", count: easyNo, fill: "hsl(var(--chart-2)" },
      { level: "Medium", count: mediumNo, fill: "hsl(var(--chart-3))" },
      { level: "Hard", count: hardNo, fill: "hsl(var(--chart-5))" },
    ];
  }, [easyNo, hardNo, mediumNo]);

  const totalProblems = useMemo(() => {
    return easyNo + mediumNo + hardNo;
  }, [easyNo, hardNo, mediumNo]);

  if (totalProblems === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">Problems Solved</CardHeader>
        <div className="flex items-center justify-center flex-1 text-muted-foreground min-h-[30vh] w-[100%]">
          No problems solved yet
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">Problems Solved</CardHeader>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] h-[30vh] w-[100%]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="level"
            innerRadius={60}
            strokeWidth={5}
          >
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
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalProblems.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Problems
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </Card>
  );
}

export default ProblemsChart;
