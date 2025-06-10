"use client"

import { useEvents } from '../../context/use-event';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PlusIcon from '../../../../public/icon/Plus Icon.svg';
import MinusIcon from '../../../../public/icon/Minus Icon.svg';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import MapIcon from "../../../../public/icon/Map Pin Icon.svg"
import StarIcon from "../../../../public/icon/Tabler Star Icon.svg"

const EventDetailPage = () => {

  const { data: session } = useSession();
  const eventID = usePathname();
  const router = useRouter();
  const { selectedEvent, setSelectedEventID, ticketQty, setTicketQty } = useEvents();

  const rawSellDate = selectedEvent?.eventTicketTypes[0].date;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const isSellDateValid = rawSellDate && new Date(rawSellDate) < todayDate;

  // boolean to disable purchase button if selling date is not >= today
  const disablePurchaseButton = !isSellDateValid;

  useEffect(() => {
    setSelectedEventID(parseInt(eventID.split("/")[2]));
  }, [eventID, setSelectedEventID])

  const handleTicketMinus = (id: number) => {
    setTicketQty((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleTicketPlus = (id: number) => {
    setTicketQty((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + 1, 0),
    }));
  };

  const handlePurchase = () => {
    const purchasePayload = {
      invoiceItemRequests: Object.entries(ticketQty)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({
          eventTicketTypeID: Number(id),
          qty
        })),
    };
    console.log(purchasePayload);
    router.push('/purchase');
  }

  if (!selectedEvent?.date) return;

  const dateTimestamp = new Date(selectedEvent?.date);

  // Get the day of date
  const dayEvent = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateTimestamp);
  // Format the date to DD-MM-YYYY
  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(dateTimestamp);
  // Format time to 24 hours
  const formattedTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(dateTimestamp);

  // formatted review data


  return (
    <div className='px-40 flex flex-col gap-14 pt-9'>
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {selectedEvent?.images.map((image) => (
            <CarouselItem key={image.id}>
              <div>
                <Card>
                  <CardContent className='flex w-[800px] h-[364px] items-center justify-center'>
                    <Image
                      src={image.url || "https://placehold.co/1000x1000.png"}
                      alt={image.alt}
                      layout="fill"
                      objectFit='cover'
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className='flex gap-10'>
        <div className='w-full flex flex-col gap-14'>
          {/* Event name & description */}
          <div className='flex flex-col gap-6 w-full'>
            <h1 className='font-semibold text-3xl'>{selectedEvent?.name}</h1>
            <p className='line-clamp-3'>{selectedEvent?.description}</p>
          </div>
          {/* Event date and location */}
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-6'>
              <div className='rounded-xl overflow-hidden border-2 border-solid border-neutral-200 items-center w-20 h-20'>
                <p className='px-6 py-1 bg-blue-50 font-medium border-b-2 border-solid border-neutral-200 w-full text-center'>{dayEvent.substring(0, 3)}</p>
                <p className='py-3 font-medium w-full text-center'>{formattedDate.split(" ")[0]} {formattedDate.split(" ")[1].substring(0, 3)}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='font-semibold'>{formattedDate}</p>
                <p className='text-sm'>{formattedTime}</p>
              </div>
            </div>
            <div>
              <div className='flex items-center gap-6'>
                <div className='flex rounded-xl overflow-hidden border-2 border-solid border-neutral-200 items-center justify-center w-20 h-20'>
                  <Image
                    src={MapIcon}
                    alt='Map Icon'
                    width={32}
                    height={32}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='font-semibold'>{selectedEvent.venue}</p>
                  <p className='text-sm'>{selectedEvent.location}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Event review */}
          <div>
            <h2 className='text-2xl font-semibold'>Review</h2>
            <div>
              {selectedEvent.reviews.map((review) => {
                const date = new Date(review.createdAt)
                const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
                return (
                  <div key={review.review} className='flex flex-col gap-3 w-full py-6 border-b-[1px] border-solid border-neutral-300'>
                    <div className='flex gap-2 items-center'>
                      <div className='rounded-full bg-neutral-500 w-9 h-9' />
                      <div>
                        <p className='font-semibold'>{review.userName}</p>
                        <div className='flex gap-1 items-center'>
                          {[...Array(review.rating)].map((_, i) => (
                            <Image
                              key={i}
                              src={StarIcon}
                              alt='Star Icon'
                              width={16}
                              height={16}
                            />
                          ))}
                          <p className='text-sm font-medium'>{formattedDate}</p>
                        </div>
                      </div>
                    </div>
                    <p className='text-sm text-neutral-400'>{review.review}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* Purchase ticket type */}
        <div className='w-full flex flex-col gap-9'>
          <h2 className='text-2xl font-semibold'>Ticket available</h2>
          <div className='flex flex-col gap-5'>
            {selectedEvent?.eventTicketTypes.map((ticketType) => (
              <div key={ticketType.id} className='p-4 rounded-xl border-neutral-300 border-solid border-[1px] flex justify-between'>
                <div className='flex flex-col gap-2.5'>
                  <label className='font-medium'>{ticketType.name}</label>
                  <p className='text-red-700 font-medium'>IDR {(ticketType.price).toLocaleString('de-DE')}</p>
                </div>
                <div className='flex gap-4 items-center'>
                  <Button
                    variant={"outline"}
                    className='p-2 border-[1px] border-solid border-neutral-300 rounded-sm'
                    disabled={ticketQty[ticketType.id] == 0}
                    onClick={() => handleTicketMinus(ticketType.id)}
                  >
                    <Image
                      src={MinusIcon}
                      width={14}
                      height={14}
                      alt='Minus icon'
                      className=''
                    />
                  </Button>
                  <span className='font-medium'>{ticketQty[ticketType.id] || 0}</span>
                  <Button
                    className='p-2 border-[1px] border-solid border-neutral-300 rounded-sm'
                    onClick={() => handleTicketPlus(ticketType.id)}
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
          {session
            ? <Button
              type="submit"
              size={"action"}
              onClick={handlePurchase}
              disabled={session ? disablePurchaseButton : true}
            >{session ? "Purchase tickets" : "Login/Register"}</Button>
            : <Button
              type="submit"
              size={"action"}
              onClick={handlePurchase}
            >Login / Register</Button>
          }
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
