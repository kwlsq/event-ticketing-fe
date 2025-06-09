import { Button } from "@/components/ui/button";
import { PaginatedEvents } from "@/types/dashboard/Dashboard";
import { PaginatedInvoices } from "@/types/invoice/invoice";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardCardListProps {
  eventsData?: PaginatedEvents;
  invoicesData?: PaginatedInvoices;
}

export default function DashboardCardList({
  eventsData,
  invoicesData,
}: DashboardCardListProps) {
  const isEvent = !!eventsData;
  const listItems = isEvent
    ? eventsData?.content.map((event) => ({
        id: event.id,
        name: event.name,
        date: event.date,
        location: event.location,
        thumbnail: event.thumbnailUrl,
      }))
    : invoicesData?.content.map((invoice) => ({
        id: invoice.id,
        name: invoice.eventDetailsResponse.name,
        date: invoice.eventDetailsResponse.date,
        location: invoice.eventDetailsResponse.location,
        thumbnail:
          invoice.eventDetailsResponse.images[0]?.url ||
          "https://placehold.co/321x200.png",
      }));

  return (
    <div>
      {listItems?.map((item) => {
        const dateTimestamp = new Date(item.date);
        const dayEvent = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
        }).format(dateTimestamp);
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(dateTimestamp);
        const formattedTime = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(dateTimestamp);

        return (
          <div key={item.id} className="flex w-full gap-5 mb-8">
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
                src={item.thumbnail || "https://placehold.co/321x200.png"}
                alt="event image"
                width={321}
                height={200}
                className="rounded-xl"
                quality={100}
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <div className="font-semibold text-xl">{item.name}</div>
              <div className="flex text-gray-500">
                <div>{formattedTime}</div>
                <Dot />
                <div>{item.location}</div>
              </div>
              <Link href={`/event-details/${item.id}`}>
                <Button className="rounded-md w-fit mt-4">View details</Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
