import { DashboardData } from "@/types/dashboard/Dashboard";

const cardStyle = `flex flex-col rounded-xl shadow-lg px-5 py-3 gap-2`;
const cardTitleStyle = `font-semibold`;
const cardContentStyle = `font-bold text-sidebar-primary`;

interface DashboardCardProps {
  dashboardData?: DashboardData | undefined;
}

export default function DashboardCard({ dashboardData }: DashboardCardProps) {
  const { totalSales, totalAttendees, totalEvents } = dashboardData || {};

  return (
    <div className="grid md:grid-cols-3 w-full md:gap-10">
      <div className={cardStyle}>
        <div className={cardTitleStyle}>Total Sales</div>
        <div className={cardContentStyle}>{totalSales}</div>
      </div>
      <div className={cardStyle}>
        <div className={cardTitleStyle}>Total Attendees</div>
        <div className={cardContentStyle}>{totalAttendees}</div>
      </div>
      <div className={cardStyle}>
        <div className={cardTitleStyle}>Total Events</div>
        <div className={cardContentStyle}>{totalEvents}</div>
      </div>
    </div>
  );
}
