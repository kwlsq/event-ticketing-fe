"use client";

import EventCard from "./components/Event Card/index";
import DynamicPagination from "./components/Dynamic Pagination";
import { useEvents } from "./context/use-event";
import { Button } from "@/components/ui/button";
import { useUserContext } from "./context/userContext";
import AuthDialog from "./components/AuthDialog";

export default function Home() {
  const { isOpenDialog, updateIsOpenDialog, isRegister } = useUserContext();

  const { events } = useEvents();

  if (events !== undefined) {
    return (
      <div className="mx-[100px]">
        <Button onClick={() => updateIsOpenDialog(true)}>Login</Button>
        <AuthDialog
          open={isOpenDialog}
          setOpenDialog={updateIsOpenDialog}
          isButtonRegister={isRegister}
        ></AuthDialog>
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
    );
  }
}
