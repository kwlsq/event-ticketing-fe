import { Image } from "../image/image";
import { PromotionProps } from "../promotion/promotion";
import { Review } from "../review/review";

export interface EventProps {
  id: number,
  name: string,
  date: string,
  venue: string,
  location: string,
  isEventFree: boolean,
  startingPrice: number,
  thumbnailUrl?: string
}

export interface EventTicketType {
  id: number, 
  name: string,
  price: number, 
  stock: number, 
  availableQty: number, 
  date: string
}

export interface EventDetailsProps {
  id: number,
  name: string,
  description: string,
  date: string,
  venue: string,
  location: string,
  images: Image[],
  reviews: Review[],
  eventTicketTypes: EventTicketType[],
  promotions?: PromotionProps
}

export interface EventTicketTypeRequest {
  name: string,
  price: number,
  stock: number
}

export interface EventRequest {
  name: string,
  description: string,
  date: Date,
  venue: string,
  location: string,
  isEventFree: boolean,
  ticketSaleDate: Date,
  ticketTypeRequest: EventTicketTypeRequest[] 
}

export interface Category {
  id: number,
  name: string
}