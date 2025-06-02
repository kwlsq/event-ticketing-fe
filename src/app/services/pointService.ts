import { API_URL } from "@/constants/url";
import { TokenPair } from "@/types/auth/TokenPair";
import axios from "axios";


export async function getTotalPoints(session: TokenPair | null) {
    const auth = `Bearer ${session?.accessToken}`

    const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.points.totalPoints}`, {
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}