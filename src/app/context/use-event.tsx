"use client"

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { EventProps, EventRequest, EventDetailsProps, Category } from "@/types/event/event";
import { API_URL } from "@/constants/url";
import { useSearchParams } from "next/navigation";
import { PromotionProps, PromotionRequest } from "@/types/promotion/promotion";

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
  ticketQty: Record<number, number>,
  promotions: PromotionProps | null,
  categories: Category[] | null,
  category: Category | null,

  setSelectedEventID: (selectedEventID: number) => void,
  setSelectedEvent: (selectedEvent: EventDetailsProps | null) => void,
  setTotalPages: (totalPages: number) => void,
  setPage: (page: number) => void,
  setSort: (sort: string) => void,
  setQuery: (query: string) => void,
  setTotalElements: (totalElements: number) => void,
  setRegencies: (regencies: LocationProps[]) => void,
  setLocation: (location: string) => void,
  setTicketQty: React.Dispatch<React.SetStateAction<Record<number, number>>>,
  setPromotions: (promotion: PromotionProps) => void,
  setCategories: (categories: Category[] | null) => void,
  setCategory: (category: Category) => void

  createEvent: (newEvent: EventRequest, accessToken: string) => Promise<EventDetailsProps | undefined>
  uploadImage: (file: File[], accessToken: string, eventID: number) => Promise<boolean>
  createPromotion: (promotionRequest: PromotionRequest, accessToken: string) => Promise<boolean>
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {

  const searchParams = useSearchParams();

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
  const [ticketQty, setTicketQty] = useState<Record<number, number>>({});
  const [promotions, setPromotions] = useState<PromotionProps | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [category, setCategory] = useState<Category>({ id: 0, name: "All" });

  useEffect(() => {
    const pageParam = Number(searchParams.get("page") || "0");
    const sortParam = searchParams.get("sort") || "id";
    const queryParam = searchParams.get("query") || "";
    const locationParam = searchParams.get("location") || "";

    setPage(pageParam);
    setSort(sortParam);
    setQuery(queryParam);
    setLocation(locationParam);
  }, [searchParams]);

  // Fetch event category
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.category}`);
        setCategories([{ id: 0, name: "All" }, ...response.data]);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchCategoryData();
  }, []);

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
            location: location,
            category: category.id === 0 ? "" : category.id,
          },
        });
        const events: EventProps[] = response.data.data.content;
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
        setEvents(events);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchEventData();
  }, [page, sort, query, location, category]);

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
        setPromotions(response.data.data.promotions);
      } catch (error: unknown) {
        setError(error);
      }
    };
    fetchEventDetails();
  }, [selectedEventID]);

  // Create event function
  const createEvent = async (newEvent: EventRequest, accessToken: string): Promise<EventDetailsProps | undefined> => {
    try {

      const response = await axios.post(`${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.event}/create`, newEvent, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const createdEvent: EventDetailsProps = response.data.data;

      setTotalElements(totalElements + 1);

      return createdEvent;
    } catch (error) {
      setError(error);
    }
  };

  // Upload image to cloud
  const uploadImage = async (files: File[], accessToken: string, eventID: number): Promise<boolean> => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("multipartFiles", file);
      });

      const response = await axios.post(
        `${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.image}/${eventID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error("Image upload failed:", error);
      return false;
    }
  }

  // Create promotion if organizer add promotion in the event
  const createPromotion = async (promotion: PromotionRequest, accessToken: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.promotion}/create`,
        promotion,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error("Failed to create promotion:", error);
      return false;
    }
  }

  return (
    <EventContext.Provider value={{
      events,
      loading,
      error,
      selectedEvent,
      setSelectedEvent,
      totalPages,
      setTotalPages,
      page,
      setPage,
      sort,
      setSort,
      query,
      setQuery,
      totalElements,
      setTotalElements,
      regencies,
      setRegencies,
      selectedEventID,
      setSelectedEventID,
      location,
      setLocation,
      createEvent,
      ticketQty,
      setTicketQty,
      promotions,
      setPromotions,
      uploadImage,
      createPromotion,
      categories,
      setCategories,
      category,
      setCategory
    }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must within EventProvider");
  return context;
}