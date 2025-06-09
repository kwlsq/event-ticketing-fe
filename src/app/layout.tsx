import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { EventProvider } from "./context/use-event";
import { UserProvider } from "./context/userContext";
import { Toaster } from "sonner";
import { PointsProvider } from "./context/pointsContext";
import SessionWrapper from "@/components/features/SessionWrapper";
import NavbarWrapper from "@/components/features/NavbarWrapper";
import { Suspense } from "react";
import { DashboardProvider } from "./context/dashboardContext";
import { InvoiceProvider } from './context/use-invoice';

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
              <DashboardProvider>
                <InvoiceProvider>
                  <Suspense fallback={<div>Loading Navbar...</div>}>
                    <NavbarWrapper />
                  </Suspense>
                  <Suspense>
                    <EventProvider>{children}</EventProvider>
                  </Suspense>
                  <Toaster />
                </InvoiceProvider>
              </DashboardProvider>
            </PointsProvider>
          </UserProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
