"use client";

import { useDashboardContext } from "@/app/context/dashboardContext";

export default function OrganizerReportPage() {
  const { dashboardData, dashboardFilter } = useDashboardContext();
  console.log(dashboardData, dashboardFilter);
  return <div>organizer report</div>;
}
