"use client";
import { useDashboardContext } from "@/app/context/dashboardContext";
import DashboardCardList from "../../components/DashboardCardList";
import DynamicPagination from "@/app/components/Dynamic Pagination";
import { useEffect, useState } from "react";

export default function OrganizerSalesPage() {
  const { dashboardEventsData, updateDashboardEventsData } =
    useDashboardContext();
  const [page, setPage] = useState(dashboardEventsData?.data.page);

  useEffect(() => {
    try {
      updateDashboardEventsData(page ?? 1, 5);
    } catch (error) {
      console.error(error);
    }
  }, [page, updateDashboardEventsData]);
  
  
  return (
    <div className="flex flex-col">
      <div className="font-medium text-2xl sm:text-3xl md:text-4xl mb-8">
        My Events
      </div>
      <DashboardCardList eventsData={dashboardEventsData?.data} />
      <DynamicPagination
        totalPages={dashboardEventsData?.data.totalPages ?? 0}
        setPages={setPage}
      />
    </div>
  );
}
