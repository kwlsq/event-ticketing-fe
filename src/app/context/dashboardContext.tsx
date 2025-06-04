"use client";

import { DashboardData, DashboardFilter } from "@/types/dashboard/Dashboard";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getDashboardData } from "../services/dashboardService";
import { useSession } from "next-auth/react";

interface DashboardContextType {
  dashboardData: DashboardData | undefined;
  dashboardFilter: DashboardFilter;
  setDashboardFilter: (filter: DashboardFilter) => void;
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
    [session]
  );

  useEffect(() => {
    if (session) {
      updateDashboardData(dashboardFilter);
    }
  }, [session, dashboardFilter, updateDashboardData]);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        dashboardFilter,
        setDashboardFilter,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
