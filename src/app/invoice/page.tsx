"use client"

import { useInvoice } from "../context/use-invoice";

const InvoicePage = () => {
  const { invoices } = useInvoice();
  return (
    <div>
      Invoice
      {invoices?.map((invoice) => (
        <div key={invoice.id}>
          {invoice.amount}
        </div>
      ))}
    </div>
  )
}

export default InvoicePage