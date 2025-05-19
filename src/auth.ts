import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_URL } from "./constants/url";
import { LoginResponse, TokenClaims } from "./types/auth/TokenPair";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize({ email, password }) {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.auth.login}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    return null;
                }

                const { data } = (await response.json()) as LoginResponse;
                console.log(data)

                //verify jwt signature
                const secret = process.env.JWT_SECRET;
                if (!secret) {
                    console.error("JWT secret not set");
                    return null;
                }

                try {
                    jwt.verify(data.accessToken.value, secret);
                } catch (err) {
                    console.error("JWT verification failed: ", err);
                    return null;
                }

                const decodedToken = jwtDecode<TokenClaims>(data.accessToken.value);

                //extract claims from decoded token
                const { sub, scope, userId } = decodedToken

                const parsedResponse: User = {
                    email: sub,
                    token: {
                        accessToken: {
                            claims: decodedToken,
                            value: data.accessToken.value,
                        },
                        refreshToken: {
                            claims: jwtDecode<TokenClaims>(data.refreshToken.value),
                            value: data.refreshToken.value,
                        },
                    },
                    roles: scope.split(" "),
                    userId: parseInt(userId),
                };

                return parsedResponse ?? null;

            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.accessToken = token.accessToken.value;
            session.refreshToken = token.refreshToken.value;
            session.user = {
                ...session.user,
                roles: token.roles,
                id: token.accessToken.claims.userId,
            };
            return session;
        },
        async jwt({ token, user }) {
            console.log("IN JWT CALLBACK: ", user);
            if (user) {
                token = {
                    accessToken: {
                        claims: user.token.accessToken.claims,
                        value: user.token.accessToken.value,
                    },
                    refreshToken: {
                        claims: user.token.refreshToken.claims,
                        value: user.token.refreshToken.value,
                    },
                    roles: user.roles,
                    userId: user.userId,
                };
            }


            // Handle access token expiration
            if (
                token.accessToken.claims.exp &&
                Date.now() >= token.accessToken.claims.exp * 1000
            ) {
                const newToken = await refreshToken(token.refreshToken.value);
                if (!newToken) {
                    return null;
                }
                token.accessToken = newToken;
            }
            return token;
        },

        async signIn({ user }) {
            console.log("IN SIGNIN CALLBACK: ", user);
            return true;
        },
    }
})

const refreshToken = async (refreshToken: string) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_URL.auth.refresh}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ token: refreshToken }),
    });
    if (!response.ok) {
        console.error("Failed to refresh access token");
        return null;
    }
    const { data } = (await response.json()) as LoginResponse;

    // Verify the JWT signature
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT secret not set");
        return null;
    }

    try {
        jwt.verify(data.accessToken.value, secret);
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }

    const decodedToken = jwtDecode<TokenClaims>(data.accessToken.value);

    return {
        claims: decodedToken,
        value: data.accessToken.value,
    };
};