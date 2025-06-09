"use client";

import {
  DashboardSummaryApiResponse,
  DashboardFilter,
  PaginatedEventsApiResponse,
} from "@/types/dashboard/Dashboard";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAllOwnedEvents,
  getDashboardData,
} from "../services/dashboardService";
import { useSession } from "next-auth/react";

interface DashboardContextType {
  dashboardData: DashboardSummaryApiResponse | undefined;
  dashboardEventsData: PaginatedEventsApiResponse | undefined;
  dashboardFilter: DashboardFilter;
  setDashboardFilter: (filter: DashboardFilter) => void;
  updateDashboardEventsData: (page: number, size: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboardContext = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("Context usage out of provider");
  }
  return ctx;
};

export const DashboardProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();

  const [dashboardEventsData, setDashboardEventsData] = useState();
  const [dashboardData, setDashboardData] = useState();
  const [dashboardFilter, setDashboardFilter] =
    useState<DashboardFilter>("yearly");

  const updateDashboardData = useCallback(
    async (filter: DashboardFilter) => {
      try {
        const data = await getDashboardData(session, filter);
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      }
    },
    [session?.accessToken]
  );

  useEffect(() => {
    if (session) {
      updateDashboardData(dashboardFilter);
    }
  }, [session?.accessToken, dashboardFilter, updateDashboardData]);

  const updateDashboardEventsData = useCallback(
    async (page: number, size: number) => {
      try {
        const data = await getAllOwnedEvents(session, page, size);
        setDashboardEventsData(data);
      } catch (error) {
        console.error(error);
      }
    },
    [session?.accessToken]
  );

  useEffect(() => {
    if (session) {
      updateDashboardEventsData(0, 5);
    }
  }, [session?.accessToken, updateDashboardEventsData]);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        dashboardEventsData,
        dashboardFilter,
        setDashboardFilter,
        updateDashboardEventsData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
