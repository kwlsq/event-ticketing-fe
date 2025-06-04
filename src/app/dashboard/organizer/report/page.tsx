"use client";
import { useDashboardContext } from "@/app/context/dashboardContext";
import DashboardCard from "./DashboardCard";
import DashboardChart from "./DashboardChart";

export default function OrganizerReportPage() {
  const { dashboardData } = useDashboardContext();

  return (
    <div>
      <div className="font-medium md:text-4xl mb-8">Dashboard</div>
      <DashboardCard dashboardData={dashboardData?.data} />
      <DashboardChart />
    </div>
  );
}
