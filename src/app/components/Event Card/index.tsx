import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter
} from "@/components/ui/card";

import Image from "next/image";
import { FC } from "react";

interface EventProps {
  name: string,
  date: string,
  time: number,
  venue: string,
  location: string,
  startingPrice: number
}

const EventCard : FC<EventProps> = ({name, date, time, venue, location, startingPrice}) => {
  return (
    <Card className="shadow-none border-none p-0">
      <CardHeader className="p-0 gap-0">
        <Image
          src= {"https://res.cloudinary.com/ddk6cxc7c/image/upload/v1/purwafest_event/r7qqtw8d6rdieoxgyhmm"}
          width={295}
          height={200}
          alt="event image"
          className="rounded-2xl"
        >
        </Image>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 p-0 justify-center">
        <CardTitle className="text-xl">
          {name}
        </CardTitle>
        <div className="flex gap-3 align-center text-xl">
          <CardDescription>
            {date}
          </CardDescription>
          <CardDescription className="text-2xl leading-5">
            &#x2022;
          </CardDescription>
          <CardDescription>
            {time}
          </CardDescription>
        </div>
        <CardDescription className="line-clamp-1">
          {venue}, {location}
        </CardDescription>
      </CardContent>
      <CardFooter className="text-base pb-4">
        From IDR {startingPrice}K
      </CardFooter>
    </Card>
  )
}

export default EventCard;