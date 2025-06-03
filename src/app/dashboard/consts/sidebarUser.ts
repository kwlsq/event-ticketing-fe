import { ListMenuItem } from "@/types/dashboard/Dashboard";
import { UserRoundPen, List } from "lucide-react";

export const sidebarUser: Array<ListMenuItem> = [
    {
        title: "Personal Info",
        url: "profile",
        icon: UserRoundPen
    },
    {
        title: "My Order",
        url: "order",
        icon: List
    },
]
