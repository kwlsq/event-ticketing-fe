"use client";

import { DashboardData } from "@/types/dashboard/Dashboard";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardChartProps {
  dashboardData?: DashboardData | undefined;
  dashboardFilter: string;
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#1890ff",
  },
} satisfies ChartConfig;

export default function DashboardChart({
  dashboardData,
  dashboardFilter,
}: DashboardChartProps) {
  const { chartData } = dashboardData || {};
  console.log(dashboardFilter);

  return (
    <ChartContainer config={chartConfig} className="md:h-[400px] w-full mt-2">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="paymentDate"
          tickLine={true}
          tickMargin={10}
          axisLine={true}
          interval={1}
          textAnchor="start"
          tickFormatter={(value) => value.split("T")[0]}
        />
        <ChartTooltip
          labelFormatter={(value) => value.split("T")[0]}
          content={<ChartTooltipContent />}
        />
        <Line
          type="monotone"
          dataKey="finalAmount"
          fill="var(--color-desktop)"
          radius={4}
          strokeWidth={2}
          stroke="#1890ff"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
