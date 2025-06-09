import { EventDetailsProps, EventProps } from "../event/event";
import { TicketTypeResponse } from "../ticketTypes/ticketTypes";

enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUND = "REFUND"
}

export interface PaginatedInvoiceApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaginatedInvoices;
}

export interface PaginatedInvoices {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    content: InvoiceResponseProps[]; 
}

export interface InvoiceResponseProps {
  id: number,
  event: EventProps,
  userName: string,
  email: string,
  msisdn: string,
  status: PaymentStatus,
  paymentDate: string,
  paymentMethod: string,
  amount: number,
  fees: number,
  finalAmount: number,
  pointUsed: number,
  eventDetailsResponse: EventDetailsProps,
  invoiceItems: InvoiceItemsResponse[],
}

export interface InvoiceItemsResponse {
  subtotal: number,
  qty: number,
  ticketTypeResponse: TicketTypeResponse
}

export interface InvoiceItemsRequest {
  eventTicketTypeID: number,
  qty: number,
}

export interface InvoiceRequest {
  invoiceItemRequests: InvoiceItemsRequest[],
  pointAmount: number,
  promotionID: number
}