export interface UserData {
    name: string | null;
    email: string | null;
    msisdn: string | null;
}

export interface UserApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: UserData;
}
