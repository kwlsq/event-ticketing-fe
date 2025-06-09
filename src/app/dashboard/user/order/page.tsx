"use client";
import DynamicPagination from "@/app/components/Dynamic Pagination";
import DashboardCardList from "../../components/DashboardCardList";
import { useInvoice } from "@/app/context/use-invoice";
import { useEffect, useState } from "react";

export default function UserOrderPage() {
  const { invoices, updateInvoices } = useInvoice();
  const [page, setPage] = useState(invoices?.data.page);

  useEffect(() => {
    try {
      updateInvoices(page ?? 1, 5);
    } catch (error) {
      console.error(error);
    }
  }, [page, updateInvoices]);
  
  return (
    <div className="flex flex-col">
      <div className="font-medium text-2xl sm:text-3xl md:text-4xl mb-8">
        My Orders
      </div>
      <DashboardCardList invoicesData={invoices?.data} />
      <DynamicPagination
        totalPages={invoices?.data.totalPages ?? 0}
        setPages={setPage}
      />
    </div>
  );
}
