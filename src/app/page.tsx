"use client";

import EventCard from "./components/Event Card/index";
import DynamicPagination from "./components/Dynamic Pagination";
import { useEvents } from "./context/use-event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SortIcon from '../../public/icon/Sort Descending Icon.svg';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const sortLabels: Record<string, string> = {
  name: "Sort by Name",
  venue: "Sort by Venue",
  location: "Sort by Location",
  date: "Sort by Date",
  id: "Sort by",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutID: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => func(...args), delay);
  }
}

export default function Home() {
  const { events, totalPages, setSort, sort, query, setQuery, totalElements, setPage, regencies, location, setLocation } = useEvents();
  const [searchQuery, setSearchQuery] = useState(query);
  const router = useRouter();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value !== "id") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    params.set("page", "0")
    router.push(`?${params.toString()}`)
    setSort(value);
  };

  const debouncedSetQuery = useRef(
    debounce((val: string) => {
      const params = new URLSearchParams(window.location.search);

      if (val) {
        params.set("query", val);
      } else {
        params.delete("query");
      }

      params.set("page", "0");
      router.push(`?${params.toString()}`);
      setQuery(val)
    }, 500)
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetQuery(value);
  }

  const handleLocationFilter = (location: string) => {
    const params = new URLSearchParams(window.location.search);

    if (location === "all") {
      params.delete("location");
      setLocation("");
    } else {
      params.set("location", location);
      setLocation(location);
    }

    params.set("page", "0");
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="mx-[100px] flex flex-col gap-9 mt-5">
        <div className="flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Search event"
            onChange={handleChange}
            value={searchQuery}
            className="bg-[#F2F6FF] border-none h-12 rounded-full w-full"
          />
          <div className={cn("flex gap-3.5 w-2xs justify-end", sort !== "id" ? "text-neutral-600" : "text-neutral-400")}>
            <Select onValueChange={handleLocationFilter} value={location}>
              <SelectTrigger className={cn("rounded-full border-none shadow-none", location !== "" && "border-neutral-600")}>
                <SelectValue
                  placeholder="All location"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Location</SelectLabel>
                  <SelectItem value={"all"}>
                    All locations
                  </SelectItem>
                  {regencies.map((regency) => (
                    <SelectItem key={regency.code} value={regency.name}>
                      {regency.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter button & title */}
        <div className="flex justify-end w-full items-end">
          {query === "" && location === "" && (
            <h2
              className="text-2xl font-semibold w-full"
            >Showing events in Indonesia
            </h2>)}

          {query !== "" && location === "" && (
            <h2
              className="text-2xl font-semibold w-full"
            >Showing {totalElements} results for &quot;{query}&quot;
            </h2>)}

          {query === "" && location !== "" && (
            <h2
              className="text-2xl font-semibold w-full"
            >Showing events in {location}
            </h2>)}

          {query !== "" && location !== "" && (
            <h2
              className="text-2xl font-semibold w-full"
            >Showing {totalElements} results for &quot;{query}&quot; in {location}
            </h2>)}
          <div className={cn("flex gap-3.5 w-full justify-end", sort !== "id" ? "text-neutral-600" : "text-neutral-400")}>
            <Select onValueChange={handleSort} value={sort}>
              <SelectTrigger className={cn("rounded-full", sort !== "id" && "border-neutral-600")}>
                <Image
                  src={SortIcon}
                  width={24}
                  height={24}
                  alt="Sort icon"
                />
                <SelectValue
                  className={cn("")}
                >{sortLabels[sort]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="id">Default</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Event list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {events?.map((event) => (
            <div key={event.id}>
              <EventCard
                name={event.name}
                date={event.date}
                venue={event.venue}
                location={event.location}
                startingPrice={event.startingPrice}
                id={event.id}
                isEventFree={event.isEventFree}
                thumbnailUrl={event.thumbnailUrl}
              />
            </div>
          ))}
        </div>
        {/* Event pagination */}
        <DynamicPagination totalPages={totalPages} setPages={setPage} />
      </div>
    </div>
  );
}
