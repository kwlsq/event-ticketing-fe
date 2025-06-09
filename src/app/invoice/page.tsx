"use client"

import { useInvoice } from "../context/use-invoice";

const InvoicePage = () => {
  const { invoices } = useInvoice();
  console.log(invoices)
  return (
    <div>
      Invoice
      
    </div>
  )
}

export default InvoicePage