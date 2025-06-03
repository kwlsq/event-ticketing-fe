"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const searchParams = useSearchParams();

  return <Navbar searchParams={searchParams} />;
}
