import { Button } from "@/components/ui/button";
import { PaginatedEvents } from "@/types/dashboard/Dashboard";
import { Dot } from "lucide-react";
import Image from "next/image";

interface DashboardCardListProps {
  eventsData: PaginatedEvents | undefined;
}

export default function DashboardCardList({
  eventsData,
}: DashboardCardListProps) {
  return (
    <div>
      {eventsData?.content.map((event) => {
        const dateTimestamp = new Date(event.date);

        // Get the day of the week
        const dayEvent = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(dateTimestamp);
        // Format the date to DD-MM-YYYY
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(dateTimestamp);
        // Format time to 24 hours
        const formattedTime = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(dateTimestamp);

        return (
          <div key={event.id} className="flex w-full gap-5 mb-8">
            <div className="rounded-xl overflow-hidden border-2 border-solid border-neutral-200 items-center w-20 h-20">
              <p className="px-6 py-1 bg-blue-50 font-medium border-b-2 border-solid border-neutral-200 w-full text-center text-gray-500">
                {dayEvent.substring(0, 3)}
              </p>
              <p className="py-3 font-medium w-full text-center">
                {formattedDate.split(" ")[0]}{" "}
                {formattedDate.split(" ")[1].substring(0, 3)}
              </p>
            </div>
            <div>
              <Image
                src={event.thumbnailUrl || "https://placehold.co/321x200.png"}
                alt="event image"
                width={321}
                height={200}
                className="rounded-xl"
                quality={100}
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <div className="font-semibold text-xl">{event.name}</div>
              <div className="flex text-gray-500">
                <div>{formattedTime}</div>
                <Dot />
                <div>{event.location}</div>
              </div>
              <Button className="rounded-md w-fit mt-4">View details</Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
