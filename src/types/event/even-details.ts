import { Image } from "../image/image";
import { Review } from "../review/review";
import { EventTicketType } from "./event-ticket-types";

export interface EventDetailsProps {
  id: number,
  name: string,
  description: string,
  date: string,
  venue: string,
  location: string,
  images: Image[],
  reviews: Review[],
  eventTicketTypes: EventTicketType[]
}