"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEvents } from "../context/use-event";
import PlusIcon from '../../../public/icon/Plus Icon.svg';
import MinusIcon from '../../../public/icon/Minus Icon.svg';
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePointsContext } from "../context/pointsContext";
import PointIcon from "../../../public/icon/point.svg";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { useInvoice } from "../context/use-invoice";
import { useSession } from "next-auth/react";
import { InvoiceItemsRequest, InvoiceRequest } from "@/types/invoice/invoice";

const PurchasePage = () => {

  const { ticketQty, setTicketQty, selectedEvent, promotions } = useEvents();
  const [subtotal, setSubtotal] = useState(0);
  const [selectedPromotion, setSelectedPromotion] = useState(0);
  const [isUsePoint, setUsePoint] = useState(false);
  const { totalPoints } = usePointsContext();
  const { createInvoice } = useInvoice();
  const { data: session } = useSession();

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

  useEffect(() => {
    const calculateSubtotal = () => {
      let total = 0;
      selectedEvent?.eventTicketTypes.map((ticket) => {
        const qty = ticketQty[ticket.id] || 0;
        if (qty > 0) {
          total += ticket.price * ticketQty[ticket.id]
        }
      })
      setSubtotal(total);
    }
    calculateSubtotal();
  }, [ticketQty, selectedEvent?.eventTicketTypes])


  if (!session) return;

  const handleContinuePayment = async () => {

    const invoiceItems: InvoiceItemsRequest[] = [];

    selectedEvent?.eventTicketTypes.forEach(ticket => {
      const qty = ticketQty[ticket.id] || 0;
      if (qty > 0) {
        invoiceItems.push({
          eventTicketTypeID: ticket.id,
          qty
        })
      }
    })

    const invoiceRequest: InvoiceRequest = {
      invoiceItemRequests: invoiceItems,
      pointAmount: isUsePoint ? totalPoints : 0,
      promotionID: selectedPromotion
    }
    console.log(invoiceRequest);

    try {
      const response = await createInvoice(invoiceRequest, session?.accessToken, selectedEvent?.id);
      if (response) return console.log("Successfully create invoice!");
    } catch (error) {
      console.error("Failed to proceed invoice", error);
    }
  }

  return (
    <div className="flex w-full px-40 py-9 gap-10">
      <div className="w-2/3">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl">Payment Details</h2>
          <p>Your payment information will be secured and encrypted</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl">Billing Information</h2>
          {/* CC form  */}
          <form className="flex flex-col gap-5 p-5 border-solid border-[1px] border-neutral-300 rounded-2xl">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Card holder <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Card holder name"
                />

              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Card number <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="16 digits card number"
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-medium">
                  Card number <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-1">
                  <Input
                    placeholder="Card expiry date"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-medium">
                  CVV <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-1">
                  <Input
                    placeholder="Card CVV number"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="w-1/3 p-5 flex flex-col gap-5 rounded-2xl border-[1px] border-neutral-300 border-solid">
        <h2 className="font-semibold text-xl">Your order</h2>
        <div className="flex flex-col gap-5">
          {/* Purchase item list */}
          <div className="flex flex-col gap-6">
            {selectedEvent?.eventTicketTypes.map((ticketType) => (
              <div key={ticketType.id} className={cn('rounded-xl border-neutral-300 flex justify-between', !ticketQty[ticketType.id] && "hidden")}>
                <div className='flex flex-col gap-2.5 text-sm'>
                  <div className="flex flex-col gap-0">
                    <label className='font-medium'>{ticketType.name}</label>
                    <p className="text-neutral-500">{selectedEvent.name}</p>
                  </div>
                  <p className='text-red-700 font-medium'>IDR {(ticketType.price).toLocaleString('de-DE')}</p>
                </div>
                <div className='flex gap-4 items-center'>
                  <Button
                    variant={"outline"}
                    className='p-2 border-[1px] border-solid border-neutral-300 rounded-sm w-fit h-fit'
                    disabled={ticketQty[ticketType.id] == 0}
                    onClick={() => handleTicketMinus(ticketType.id)}
                  >
                    <Image
                      src={MinusIcon}
                      width={12}
                      height={12}
                      alt='Minus icon'
                      className=''
                    />
                  </Button>
                  <span className='font-medium text-sm'>{ticketQty[ticketType.id]}</span>
                  <Button
                    className='p-2 border-[1px] border-solid border-neutral-300 rounded-sm w-fit h-fit'
                    onClick={() => handleTicketPlus(ticketType.id)}
                  >
                    <Image
                      src={PlusIcon}
                      width={12}
                      height={12}
                      alt='Plus icon'
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* divider */}
          <p className="w-full border-solid border-[1px] border-neutral-200" />

          {/* Prize calculation */}
          <div className="flex flex-col gap-2.5">
            <div className="text-sm text-neutral-500 flex justify-between">
              <p>Subtotal</p>
              <p className="font-medium">IDR {subtotal.toLocaleString('de-DE')}</p>
            </div>
            <div className="text-sm text-neutral-500 flex justify-between">
              <p>Tax (2%)</p>
              <p className="font-medium">IDR {((subtotal) * 2 / 100).toLocaleString('de-DE')}</p>
            </div>
          </div>

          {/* Divider */}
          <p className="w-full border-dashed border-[1px] border-neutral-200" />

          {/* Select voucher */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-xs">Use your voucher</label>
            <Select onValueChange={(value) => setSelectedPromotion(Number(value))}>
              <SelectTrigger className="w-full text-sm h-fit">
                <SelectValue placeholder="Choose voucher" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    Your unused voucher
                  </SelectLabel>
                  {Array.isArray(promotions) && promotions.map(promo => (
                    <SelectItem key={promo.id} value={String(promo.id)}>
                      <div>
                        <label className="font-medium">{promo.name}</label>
                        {promo.type === "NOMINAL" ? (
                          <p className="text-xs text-neutral-600">
                            Get Rp. {promo.value.toLocaleString()} cashback from your purchase
                          </p>
                        ) : (
                          <p className="text-xs text-neutral-600">
                            Get {promo.value}% off product price
                          </p>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Point checkbox */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-xs">Pay with your points</label>
            <div
              className="p-3 w-full h-fit flex items-center justify-between disabled:pointer-events-none border-solid border-[1px] rounded-xl border-input"
            >
              <div className="flex gap-2">
                <Image
                  src={PointIcon}
                  width={24}
                  height={24}
                  alt="Point icon"
                />
                <div className="items-start flex flex-col">
                  <label className="text-xs font-medium">Purwa Point</label>
                  <span className="font-semibold">{totalPoints}</span>
                </div>
              </div>
              <Input
                type="checkbox"
                onChange={() => setUsePoint(prev => !prev)}
                className="w-5 h-5 border-neutral-300"
              />
            </div>
          </div>

          <Button onClick={handleContinuePayment} size={"action"}>Continue to payment</Button>

        </div>
      </div>
    </div>
  )
}
export default PurchasePage;