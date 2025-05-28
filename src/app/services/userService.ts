import { API_URL } from "@/constants/url";
import { TokenPair } from "@/types/auth/TokenPair";
import axios from "axios";

export async function registerUser(registrationType: string, data: {
    name: string;
    email: string;
    password: string;
    code: string | undefined;
}) {
    const response = await axios.post(`${API_URL.BASE_URL_LOCAL}${API_URL.user.register}/${registrationType}`, data);

    return response.data;
}

export async function logout(session: TokenPair) {
    const auth = `Bearer ${session.accessToken}`

    const response = await axios.post(`${API_URL.BASE_URL_LOCAL}${API_URL.auth.logout}`, session.refreshToken, {
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}