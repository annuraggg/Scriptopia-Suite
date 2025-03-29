import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardBody, CardHeader } from "@heroui/card";

const ResumeChart = ({
  chartData,
}: {
  chartData: { day: string; resumes: number }[];
}) => {
  const chartConfig = {
    resumes: {
      label: "Resumes",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="max-h-[64vh] w-full">
      <CardHeader>Resumes Per Day</CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig}>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="resumes"
                type="natural"
                fill="white"
                fillOpacity={0.4}
                stroke="white"
              />
            </AreaChart>
          </ChartContainer>
        </ChartContainer>
      </CardBody>
    </Card>
  );
};

export default ResumeChart;
