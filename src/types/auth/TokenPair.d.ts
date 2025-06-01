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

interface TokenWithValue {
  value: string;
}

export interface LoginResponse {
  data: {
    accessToken: TokenWithValue;
    refreshToken: TokenWithValue;
  };
}
