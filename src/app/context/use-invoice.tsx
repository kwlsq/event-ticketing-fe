"use client";

import { API_URL } from "@/constants/url";
import {
  InvoiceRequest,
  PaginatedInvoiceApiResponse,
} from "@/types/invoice/invoice";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getInvoicesByID } from "../services/dashboardService";

interface InvoiceContextType {
  invoices: PaginatedInvoiceApiResponse | undefined;

  createInvoice: (
    invoiceRequest: InvoiceRequest,
    accessToken: string,
    eventID: number | undefined
  ) => Promise<boolean>;
  updateInvoices: (page: number, size: number) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<
    PaginatedInvoiceApiResponse | undefined
  >();
  const { data: session } = useSession();

  // Fetch invoice data
  const updateInvoices = useCallback(
    async (page: number, size: number) => {
      try {
        const data = await getInvoicesByID(session, page, size);
        setInvoices(data);
      } catch (error) {
        console.error(error);
      }
    },
    [session?.accessToken]
  );

  useEffect(() => {
    if (session) {
      updateInvoices(0, 5);
    }
  }, [session?.accessToken, updateInvoices]);

  // Create invoice
  const createInvoice = async (
    invoiceRequest: InvoiceRequest,
    accessToken: string,
    eventID: number | undefined
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.invoice}/create/${eventID}`,
        invoiceRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updateInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context)
    throw new Error("Context must be used inside invoice provider!");
  return context;
};
