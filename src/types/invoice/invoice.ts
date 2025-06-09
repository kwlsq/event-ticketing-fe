import { EventDetailsProps, EventProps } from "../event/event";

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
  amount: number,
  fees: number,
  finalAmount: number,
  pointUsed: number,
  eventDetails: EventDetailsProps,
  invoiceItems: InvoiceItemsResponse[],
}

export interface InvoiceItemsResponse {
  eventTicketTypeID: number,
  qty: number,

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