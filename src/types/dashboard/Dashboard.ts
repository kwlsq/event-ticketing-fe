import { LucideIcon } from "lucide-react";

export interface ListMenuItem {
    title: string;
    url: string;
    icon: LucideIcon
}

export interface DashboardData {
    totalSales: number;
    totalAttendees: number;
    totalEvents: number;
    chartData: Array<ChartData>;
}

interface ChartData {
    finalAmount: number;
    paymentDate: string;
}

export type DashboardFilter = "yearly" | "monthly" | "daily";
