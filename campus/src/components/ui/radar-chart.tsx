// components/ui/radar-chart.tsx
"use client"

import {Legend, Radar, RadarChart as RechartsRadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface RadarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  height?: number
}

export function RadarChart({
  data,
  index,
  categories,
  colors = ["#0ea5e9", "#84cc16", "#ef4444", "#eab308"],
  valueFormatter = (value: number) => value.toString(),
  height = 300,
}: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart
        data={data}
        className="[&_.recharts-polar-grid-angle_line]:stroke-border [&_.recharts-polar-radius-axis-line]:stroke-border"
      >
        <PolarGrid className="stroke-border" />
        <PolarAngleAxis
          dataKey={index}
          className="text-sm text-muted-foreground fill-muted-foreground"
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, "auto"]}
          tickFormatter={valueFormatter}
          className="text-sm text-muted-foreground fill-muted-foreground"
        />
        {categories.map((category, i) => (
          <Radar
            key={category}
            name={category}
            dataKey={category}
            stroke={colors[i % colors.length]}
            fill={colors[i % colors.length]}
            fillOpacity={0.3}
            className="stroke-2"
          />
        ))}
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}