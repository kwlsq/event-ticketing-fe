import { API_URL } from "@/constants/url";
import { TokenPair } from "@/types/auth/TokenPair";
import { UserData } from "@/types/user/user";
import axios from "axios";

export async function registerUser(registrationType: string, data: {
    name: string;
    email: string;
    password: string;
    code: string | undefined;
}) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.user.register}/${registrationType}`, data);

    return response.data;
}

export async function logout(session: TokenPair | null) {
    const auth = `Bearer ${session?.accessToken}`

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.auth.logout}`, session?.refreshToken, {
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}


export async function getProfile(session: TokenPair | null) {
    const auth = `Bearer ${session?.accessToken}`

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.user.detail}`, {
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}

export async function updateProfile (session: TokenPair | null, request: UserData) {
    const auth = `Bearer ${session?.accessToken}`

    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.user.detail}`, request, {
        headers: {
            Authorization: auth,
        }
    });

    return response.data;
}