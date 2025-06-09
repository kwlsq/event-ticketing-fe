export interface UserData {
    name?: string;
    email?: string;
    msisdn?: string;
}

export interface UserApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: UserData;
}
