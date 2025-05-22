"use client";

import EventCard from "./components/Event Card/index";
import DynamicPagination from "./components/Dynamic Pagination";
import { useEvents } from "./context/use-event";
import Navbar from "@/components/features/navbar/Navbar";

export default function Home() {
  const { events } = useEvents();

  if (events !== undefined) {
    return (
      <div>
        <Navbar />
        <div className="mx-[100px]">
          <div className="flex flex-wrap gap-5">
            {events.map((event) => (
              <div key={event.id} className="w-[272px]">
                <EventCard
                  name={event.name}
                  date={event.date}
                  venue={event.venue}
                  location={event.location}
                  time={900}
                  startingPrice={event.startingPrice}
                />
              </div>
            ))}
          </div>
          <DynamicPagination />
        </div>
      </div>
    );
  }
}
