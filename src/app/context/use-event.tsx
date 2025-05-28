"use client"

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { EventProps, EventRequest } from "@/types/event/event";
import { EventDetailsProps } from "@/types/event/event";
import { API_URL } from "@/constants/url";


interface EventContextType {
  events: EventProps[],
  loading: boolean,
  error: unknown,
  selectedEvent: EventDetailsProps | null,
  totalPages: number,
  page: number,
  sort: string,
  query: string,
  totalElements: number,

  setSelectedEvent: (selectedEvent: EventDetailsProps | null) => void,
  setTotalPages: (totalPages: number) => void,
  setPage: (page: number) => void,
  setSort: (sort: string) => void,
  setQuery: (query: string) => void,
  setTotalElements: (totalElements: number) => void,
  
  createEvent: (newEvent: EventRequest) => Promise<void>
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
  const [query, setQuery] = useState('');
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.event}?page=${page}&size=4&sort=${sort}&search=${query}`);
        const events: EventProps[] = response.data.data.content;
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
        console.log(totalPages);
        setEvents(events);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchEventData();
  }, [page, sort, totalPages, query]);

  const createEvent = async (newEvent: EventRequest) => {
    try {
      const response = await axios.post(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.event}`, newEvent);
      const createdEvent = response.data.data;
      setEvents(prev => [createdEvent, ...prev]);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <EventContext.Provider value={{ events, loading, error, selectedEvent, setSelectedEvent, totalPages, setTotalPages, page, setPage, sort, setSort, query, setQuery, totalElements, setTotalElements, createEvent}}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must within EventProvider");
  return context;
}