"use client"

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { EventProps, EventRequest, EventDetailsProps } from "@/types/event/event";
import { API_URL } from "@/constants/url";

interface LocationProps {
  code: string;
  name: string;
}

interface EventContextType {
  events: EventProps[],
  loading: boolean,
  error: unknown,
  selectedEventID: number,
  selectedEvent: EventDetailsProps | null,
  totalPages: number,
  page: number,
  sort: string,
  query: string,
  totalElements: number,
  regencies: LocationProps[],
  location: string,

  setSelectedEventID: (selectedEventID: number) => void,
  setSelectedEvent: (selectedEvent: EventDetailsProps | null) => void,
  setTotalPages: (totalPages: number) => void,
  setPage: (page: number) => void,
  setSort: (sort: string) => void,
  setQuery: (query: string) => void,
  setTotalElements: (totalElements: number) => void,
  setRegencies: (regencies: LocationProps[]) => void,
  setLocation: (location: string) => void

  createEvent: (newEvent: EventRequest, accessToken: string) => Promise<EventDetailsProps | undefined>
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [selectedEventID, setSelectedEventID] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventDetailsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('id');
  const [query, setQuery] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [regencies, setRegencies] = useState<LocationProps[]>([]);
  const [location, setLocation] = useState("");


  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.eventPublic}`, {
          params: {
            page: page,
            size: 12,
            sort: sort,
            search: query,
            location: location
          },
        });
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
  }, [page, sort, totalPages, query, location]);

  // Fetch regencies for Jakarta and West Java
  useEffect(() => {

    const cachedRegencies = localStorage.getItem("regenciesData");
    if (cachedRegencies) {
      setRegencies(JSON.parse(cachedRegencies));
      return;
    }

    const fetchRegencies = async () => {
      try {
        const response = await axios.get("api/location");
        setRegencies(response.data.data);

        localStorage.setItem("regenciesData", JSON.stringify(response.data.data));
      } catch (error: unknown) {
        setError(error);
      }
    };
    fetchRegencies();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.eventPublic}/${selectedEventID}`);
        setSelectedEvent(response.data.data);
      } catch (error: unknown) {
        setError(error);
      }
    };
    fetchEventDetails();
  }, [selectedEventID]);

  const createEvent = async (newEvent: EventRequest, accessToken: string): Promise<EventDetailsProps | undefined> => {
    try {
      const response = await axios.post(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.event}/create`, newEvent, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const createdEvent: EventDetailsProps = response.data.data;

      setEvents(prev => [{
        id: createdEvent.id,
        name: createdEvent.name,
        date: createdEvent.date,
        venue: createdEvent.venue,
        location: createdEvent.location,
        isEventFree: newEvent.isEventFree,
        startingPrice: newEvent.ticketTypeRequest[0]?.price || 0
      }, ...prev]);
      return createdEvent;
    } catch (error) {
      setError(error);
    }
  };

  return (
    <EventContext.Provider value={{ events, loading, error, selectedEvent, setSelectedEvent, totalPages, setTotalPages, page, setPage, sort, setSort, query, setQuery, totalElements, setTotalElements, regencies, setRegencies, selectedEventID, setSelectedEventID, location, setLocation, createEvent }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must within EventProvider");
  return context;
}