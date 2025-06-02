"use client"

import { useEvents } from '../../context/use-event';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import PlusIcon from '../../../../public/icon/Plus Icon.svg';
import MinusIcon from '../../../../public/icon/Minus Icon.svg';
import { Button } from '@/components/ui/button';

const EventDetailPage = () => {

  const eventID = usePathname();

  const { selectedEvent, setSelectedEventID } = useEvents();

  const [ticketQty, setTicketQty] = useState(1);

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
            <div key={ticketType.id} className='p-4 rounded-xl border-neutral-300 border-solid border-[1px] flex justify-between'>
              <div className='flex flex-col gap-2.5'>
                <label className='font-medium'>{ticketType.name}</label>
                <p className='text-red-700 font-medium'>IDR {ticketType.price}</p>
              </div>
              <div className='flex gap-4 items-center'>
                <Button
                  variant={"outline"}
                  className='p-2 border-[1px] border-solid border-neutral-300 rounded-sm'
                  disabled={ticketQty < 1}
                  onClick={() => setTicketQty(ticketQty - 1)}
                >
                  <Image
                    src={MinusIcon}
                    width={14}
                    height={14}
                    alt='Minus icon'
                    className=''
                  />
                </Button>
                <span className='font-medium'>{ticketQty}</span>
                <Button
                  className='p-2 border-[1px] border-solid border-neutral-300 rounded-sm'
                  onClick={() => setTicketQty(ticketQty + 1)}
                >
                  <Image
                    src={PlusIcon}
                    width={14}
                    height={14}
                    alt='Plus icon'
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
