import { EventDetailsProps, EventProps } from "../event/event";
import { TicketTypeResponse } from "../ticketTypes/ticketTypes";

enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUND = "REFUND"
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