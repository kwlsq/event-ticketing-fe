"use client"

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { EventProps } from "@/types/event/event";
import { EventDetailsProps } from "@/types/event/even-details";
import { API_URL } from "@/constants/url";


interface EventContextType {
  events: EventProps[],
  loading: boolean,
  error: unknown,
  selectedEvent: EventDetailsProps | null,
  setSelectedEvent: (selectedEvent: EventDetailsProps | null) => void,
  totalPages: number,
  setTotalPages: (totalPages: number) => void,
  page: number,
  setPage: (page: number) => void
  sort: string,
  setSort: (sort: string) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('id');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.event}?page=${page}&size=4&sort=${sort}`);
        const events: EventProps[] = response.data.data.content;
        setTotalPages(response.data.data.totalPages);
        console.log(totalPages);
        setEvents(events);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchEventData();
  }, [page, sort, totalPages])

  return (
    <EventContext.Provider value={{ events, loading, error, selectedEvent, setSelectedEvent, totalPages, setTotalPages, page, setPage, sort, setSort }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must within EventProvider");
  return context;
}