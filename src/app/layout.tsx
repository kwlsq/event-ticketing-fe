import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { EventProvider } from "./context/use-event";
import { UserProvider } from "./context/userContext";
import { Toaster } from "sonner";
import { PointsProvider } from "./context/pointsContext";
import Navbar from "@/components/features/Navbar";
import SessionWrapper from "@/components/features/SessionWrapper";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Purwafest",
  description: "Event ticketing website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} antialiased`}>
        <SessionWrapper>
          <UserProvider>
            <PointsProvider>
              <Navbar />
              <EventProvider>{children}</EventProvider>
              <Toaster />
            </PointsProvider>
          </UserProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
