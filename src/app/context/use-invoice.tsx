"use client"

import { API_URL } from "@/constants/url";
import { InvoiceRequest, InvoiceResponseProps } from "@/types/invoice/invoice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useState } from "react";

interface InvoiceContextType {
  invoices: InvoiceResponseProps[] | null,
  page: number

  setInvoices: (invoices: InvoiceResponseProps[] | null) => void,
  setPage: (page: number) => void

  createInvoice: (invoiceRequest: InvoiceRequest, accessToken: string, eventID: number | undefined) => Promise<boolean>
  fetchInvoice: () => void
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<InvoiceResponseProps[] | null>(null);
  const [page, setPage] = useState(0);
  const { data: session } = useSession();

  // Fetch invoice data
  const fetchInvoice = async () => {
    try {
      if (!session?.accessToken) return;
      const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.invoice}`, {
        params: {
          page: page,
          size: 2
        },
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        }
      })
      setInvoices(response.data.data.content)
      console.log(invoices);
      
    } catch (error) {
      console.error("error fetch invoices", error);
    }
  }

  // Create invoice
  const createInvoice = async (invoiceRequest: InvoiceRequest, accessToken: string, eventID: number | undefined): Promise<boolean> => {
    try {

      const response = await axios.post(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.invoice}/create/${eventID}`, invoiceRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  return (
    <InvoiceContext.Provider value={{ invoices, setInvoices, createInvoice, page, setPage, fetchInvoice }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error("Context must be used inside invoice provider!")
  return context;
} 