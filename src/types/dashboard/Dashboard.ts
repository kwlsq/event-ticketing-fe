import { LucideIcon } from "lucide-react";

export interface DashboardApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: DashboardData;
}

export interface ListMenuItem {
    title: string;
    url: string;
    icon: LucideIcon
}

export interface DashboardChartData {
    finalAmount: number;
    paymentDate: string;
}

export interface DashboardData {
    totalSales: number;
    totalAttendees: number;
    totalEvents: number;
    chartData: DashboardChartData[];
}

export type DashboardFilter = "yearly" | "monthly" | "daily";
