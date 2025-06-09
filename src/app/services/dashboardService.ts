import { API_URL } from "@/constants/url";
import { TokenPair } from "@/types/auth/TokenPair";
import axios from "axios";


export async function getDashboardData(session: TokenPair | null, filter: string) {
    const auth = `Bearer ${session?.accessToken}`

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.dashboard.dashboardData}`, {
        params: { filter: filter },
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}

export async function getAllOwnedEvents(session: TokenPair | null, page: number, size: number | 0) {
    const auth = `Bearer ${session?.accessToken}`

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.dashboard.dashboardEvent}`, {
        params: { size: size, page: page },
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}