"use client";

import { DashboardData } from "@/types/dashboard/Dashboard";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardChartProps {
  dashboardData?: DashboardData;
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
    <ChartContainer
      config={chartConfig}
      className="w-full mt-2 h-[300px] md:h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="paymentDate"
            tickLine={true}
            tickMargin={10}
            axisLine={true}
            interval={0}
            minTickGap={20}
            tickFormatter={(value) => value.split("T")[0]}
          />
          <ChartTooltip
            labelFormatter={(value) => value.split("T")[0]}
            content={<ChartTooltipContent />}
          />
          <Line
            type="monotone"
            dataKey="finalAmount"
            stroke="#1890ff"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
