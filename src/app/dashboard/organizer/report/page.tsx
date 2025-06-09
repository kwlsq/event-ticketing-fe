"use client";
import { useDashboardContext } from "@/app/context/dashboardContext";
import DashboardCard from "./DashboardCard";
import DashboardChart from "./DashboardChart";
import { DashboardFilter } from "@/types/dashboard/Dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizerReportPage() {
  const { dashboardData, dashboardFilter, setDashboardFilter } =
    useDashboardContext();

  const filters: Array<DashboardFilter> = ["yearly", "monthly", "daily"];
  const isLoading = !dashboardData?.data;

  return (
    <div className="flex flex-col">
      <div className="font-medium md:text-4xl">Dashboard</div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <DashboardCard dashboardData={dashboardData?.data} />
      )}

      <div className="flex gap-1 bg-gray-100 w-fit p-1 rounded-xs my-5">
        {filters.map((filter) => (
          <div
            key={filter}
            className={`rounded-xs p-2 w-20 text-center font-semibold cursor-pointer ${
              dashboardFilter === filter ? "bg-white" : ""
            }`}
            onClick={() => setDashboardFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </div>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-[300px] md:h-[400px] w-full rounded-lg" />
      ) : (
        <DashboardChart
          dashboardData={dashboardData?.data}
          dashboardFilter={dashboardFilter}
        />
      )}
    </div>
  );
}
