import { JwtPayload } from "jwt-decode";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface Token {
  value: string
  expiresAt: string
  tokenType: string
}

export interface TokenClaims extends JwtPayload {
  userId: string;
  scope: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  statusCode: number;
  messages: string[];
  data: TokenPair;
}

