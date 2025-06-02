"use client"

import { useEvents } from '../../context/use-event';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const EventDetailPage = () => {

  const eventID = usePathname();

  const { selectedEvent, setSelectedEventID } = useEvents();

  useEffect(() => {
    setSelectedEventID(parseInt(eventID.split("/")[2]));
  }, [eventID])

  return (
    <div className='px-80'>
      {selectedEvent?.images.map((image) => (
        <div key={image.id} className='w-full h-[364px] object-cover flex relative'>
          <Image
            src={image.url || "https://placehold.co/1000x1000.png"}
            alt={image.alt}
            layout="fill"
            objectFit='cover'
          />
        </div>
      ))}
      <div className='flex'>
        {/* Event name & description */}
        <div className='flex flex-col gap-6 w-full'>
          <h1 className='font-semibold text-3xl'>{selectedEvent?.name}</h1>
          <p className='line-clamp-3'>{selectedEvent?.description}</p>
        </div>
        <div className='w-full flex flex-col gap-5'>
          {selectedEvent?.eventTicketTypes.map((ticketType) => (
            <div key={ticketType.id} className='p-4 rounded-xl border-neutral-300 border-solid border-[1px]'>
              <div className='flex flex-col gap-2.5'>
                <label className='font-medium'>{ticketType.name}</label>
                <p className='text-red-700 font-medium'>IDR {ticketType.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
