import axios from "axios";

export async function registerUser(registrationType: string, data: {
    name: string;
    email: string;
    password: string;
    code: string | undefined;
}) {
    const response = await axios.post(`/user/register/${registrationType}`, data);
    return response.data;
}