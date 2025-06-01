"use client";

import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTotalPoints } from "../services/pointService";
import { useSession } from "next-auth/react";

interface PointsContextType {
  totalPoints: number | 0;
  updateTotalPoints: (val: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const usePointsContext = () => {
  const ctx = useContext(PointsContext);
  if (!ctx) {
    throw new Error("Context usage out of provider");
  }
  return ctx;
};

export const PointsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const updateTotalPoints = useCallback(async () => {
    try {
      const totalPoints = await getTotalPoints(session);
      setTotalPoints(totalPoints.data);
    } catch (error) {
      console.error(error);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      updateTotalPoints();
    }
  }, [session, updateTotalPoints]);

  return (
    <PointsContext.Provider
      value={{
        totalPoints,
        updateTotalPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};
