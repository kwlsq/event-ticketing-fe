import { LucideIcon } from "lucide-react";

export interface DashboardSummaryApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardData;
}

export interface PaginatedEventsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaginatedEvents;
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

export interface PaginatedEvents {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    content: EventPreview[]; // Main event list
}

export interface EventPreview {
    id: number;
    name: string;
    date: string;
    venue: string;
    location: string;
    startingPrice: number | null;
    thumbnailUrl: string | null;
    eventFree: boolean;
}