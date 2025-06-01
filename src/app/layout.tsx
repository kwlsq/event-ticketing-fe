import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { EventProvider } from "./context/use-event";
import { UserProvider } from "./context/userContext";
import { Toaster } from "sonner";
import { PointsProvider } from "./context/pointsContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Purwafest",
  description: "Event ticketing website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider refetchInterval={120} session={session}>
        <body className={`${plusJakarta.className} antialiased`}>
          <UserProvider>
            <PointsProvider>
              <EventProvider>{children}</EventProvider>
              <Toaster />
            </PointsProvider>
          </UserProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
