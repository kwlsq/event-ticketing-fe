"use client";

<<<<<<< HEAD
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
=======
import EventCard from './components/Event Card/index';
import DynamicPagination from './components/Dynamic Pagination';
import { useEvents } from './context/use-event';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectLabel, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select';

const sortLabels: Record<string, string> = {
  name: "Sort by Name",
  venue: "Sort by Venue",
  location: "Sort by Location",
  date: "Sort by Date",
  id: "Sort by"
}

export default function Home() {

  const { events, totalPages, setSort, sort } = useEvents();

  const handleSort = (value: string) => {
    setSort(value);
>>>>>>> f8162f9a655101e81c7ec712967785b559126ffc
  }

  return (
    <div className="mx-[100px] flex flex-col gap-9">
      <div className='flex gap-3.5 text-neutral-400 w-full justify-end'>
        <Button
          variant={"outline"}
          className=''
        >
          Date
        </Button>
        <Button
          variant={"outline"}
          className='text-neutral-400'
        >
          Price
        </Button>
        <Select onValueChange={handleSort} value={sort}>
          <SelectTrigger className='rounded-full'>
            <SelectValue>
              {sortLabels[sort]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                Sort by
              </SelectLabel>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="venue">Venue</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="id">Default</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {events?.map((event) => (
          <div key={event.id}>
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
      <DynamicPagination totalPages={totalPages} />
    </div>
  );
}
