"use client"

import { InvoiceItemsResponse } from "@/types/invoice/invoice";
import { useInvoice } from "../context/use-invoice";

const InvoicePage = () => {
  const { invoice } = useInvoice();

  if (invoice?.eventDetailsResponse === undefined) return;

  const dateTimestamp = new Date(invoice?.eventDetailsResponse.date);

  // Format the date to DD-MM-YYYY
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dateTimestamp);

  return (
    <div className="px-40 pt-9 flex gap-10">
      <div className="w-2/3 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl">Invoice</h2>
          <p>You invoice receipt for your purchase</p>
        </div>

        {/* divider */}
        <p className="w-full border-solid border-[1px] border-neutral-200" />

        <div className="flex flex-col gap-8">
          <div className="flex gap-8">

            {/* User information */}
            <div className="w-full text-xl flex flex-col gap-6">
              <div className="font-semibold flex flex-col gap-1">
                <p className="text-primary">From:</p>
                <p className="text-2xl">{invoice?.userName}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p>{invoice?.msisdn || "Phone number"}</p>
                <p>{invoice?.email}</p>
              </div>
            </div>

            {/* Event information */}
            <div className="w-full text-xl flex flex-col gap-6 items-end">
              <div className="font-semibold flex flex-col gap-1 items-end">
                <p className="text-primary">Event:</p>
                <p className="text-2xl">{invoice?.eventDetailsResponse.name}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <p>{formattedDate}</p>
                <p className="line-clamp-1">{invoice?.eventDetailsResponse.venue}, {invoice?.eventDetailsResponse.location}</p>
              </div>
            </div>
          </div>
          <table className="w-full font-medium table-auto border-collapse">
            <thead>
              <tr className="border-b-[1px] border-solid border-neutral-300 text-neutral-500 text-center">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2 text-left">ITEMS</th>
                <th className="px-3 py-2">QTY</th>
                <th className="px-3 py-2">RATE</th>
                <th className="px-3 py-2">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.invoiceItems.map((item: InvoiceItemsResponse, index: number) => (
                <tr key={item.ticketTypeResponse.id}>
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 text-left">{item.ticketTypeResponse.name}</td>
                  <td className="px-3 py-2">{item.qty}</td>
                  <td className="px-3 py-2">IDR {item.ticketTypeResponse.price.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-2">IDR {item.subtotal.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-fit w-1/3 p-5 flex flex-col gap-5 rounded-2xl border-[1px] border-neutral-300 border-solid">
        <h2 className="font-semibold text-xl">Invoice #{invoice?.id}</h2>
        <div className="flex flex-col gap-5">

          {/* divider */}
          <p className="w-full border-solid border-[1px] border-neutral-200" />

          {/* Prize calculation */}
          <div className="flex flex-col gap-2.5">
            <div className="text-sm text-neutral-500 flex justify-between">
              <p>Subtotal</p>
              <p className="font-medium">IDR {invoice?.amount.toLocaleString('de-DE')}</p>
            </div>
            <div className="text-sm text-neutral-500 flex justify-between">
              <p>Tax</p>
              <p className="font-medium">IDR {(invoice?.fees || 2000).toLocaleString('de-DE')}</p>
            </div>
          </div>

          {/* Divider */}
          <p className="w-full border-dashed border-[1px] border-neutral-200" />

          {/* Final amount */}
          <div className="text-sm text-neutral-500 flex justify-between">
            <p>Total</p>
            <p className="font-medium text-neutral-800">IDR {invoice?.finalAmount.toLocaleString('de-DE')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePage