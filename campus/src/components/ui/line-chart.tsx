// components/ui/line-chart.tsx
"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface LineChartProps {
  data: any[]
  categories: {
    name: string
    value: string
    color: string
  }[]
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  startEndOnly?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGrid?: boolean
  height?: number
}

export function LineChart({
  data,
  categories,
  index,
  colors = ["#0ea5e9", "#84cc16", "#ef4444", "#eab308"],
  valueFormatter = (value: number) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  height = 300,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} className="[&_.recharts-cartesian-grid-horizontal]:stroke-border [&_.recharts-cartesian-grid-vertical]:stroke-border">
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-border" />}
        {showXAxis && (
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            tick={{ transform: "translate(0, 10)" }}
            className="text-sm text-muted-foreground fill-muted-foreground"
            interval={startEndOnly ? "preserveStartEnd" : undefined}
          />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-sm text-muted-foreground fill-muted-foreground"
            tickFormatter={valueFormatter}
          />
        )}
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    {payload.map((category, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {category.name}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {valueFormatter(category.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        {categories.map((category, i) => (
          <Line
            key={category.value}
            type="monotone"
            dataKey={category.value}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
            name={category.name}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}