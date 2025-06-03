import { ListMenuItem } from "@/types/dashboard/Dashboard";
import { UserRoundPen, List, ChartLine } from "lucide-react";

export const sidebarOrganizer: Array<ListMenuItem> = [
    {
        title: "Personal Info",
        url: "profile",
        icon: UserRoundPen
    },
    {
        title: "Dashboard",
        url: "report",
        icon: ChartLine
    },
    {
        title: "My Event",
        url: "sales",
        icon: List
    },
]
