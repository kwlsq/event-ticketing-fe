"use client"

import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter
} from "@/components/ui/card";

import Image from "next/image";
import { EventProps } from "@/types/event/event";
import { FC } from "react";
import { useEvents } from "@/app/context/use-event";
import { useRouter } from "next/navigation";

const EventCard : FC<EventProps> = ({name, date, venue, location, startingPrice, id, thumbnailUrl}) => {

  const {setSelectedEventID} = useEvents();
  const router = useRouter();

  const handleClickCard = (eventID: number) => {
    setSelectedEventID(eventID);
    router.push(`/event-details/${eventID}`)
  }

  const dateTimestamp = new Date(date);

  // Get the day of date
  const dayEvent = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(dateTimestamp);

  // Format the date to DD-MM-YYYY
  const formattedDate = new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: 'long', year: 'numeric'}).format(dateTimestamp);

  // Format time to 24 hours
  const formattedTime = new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute:'2-digit', hour12:false}).format(dateTimestamp);

  return (
    <Card
    className="shadow-none border-none p-0 w-full"
    onClick={() => {handleClickCard(id)}}
    >
      <CardHeader className="p-0 gap-0">
        <Image
          src= {thumbnailUrl || "https://placehold.co/295x200.png"}
          alt="event image"
          className="rounded-2xl"
          quality={100}
          layout="responsive"
          width={295}
          height={200}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 p-0 justify-center">
        <CardTitle className="text-xl">
          {name}
        </CardTitle>
        <div className="flex gap-3 items-center text-xl">
          <CardDescription>
            {dayEvent.substring(0,3)}, {formattedDate}
          </CardDescription>
          <CardDescription className="text-base w-1.5 h-1.5 bg-neutral-400 rounded-full"/>
          <CardDescription>
            {formattedTime}
          </CardDescription>
        </div>
        <CardDescription className="line-clamp-1">
          {venue}, {location}
        </CardDescription>
      </CardContent>
      <CardFooter className="text-base pb-4">
        From IDR {Math.floor(startingPrice / 1000)}K
      </CardFooter>
    </Card>
  )
}

export default EventCard;