"use client";

import Navbar from "@/components/features/navbar/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TokenClaims } from "@/types/auth/TokenPair";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    nameInitial: "",
  });

  useEffect(() => {
    if (session?.accessToken) {
      const accessTokenDecoded = jwtDecode<TokenClaims>(session.accessToken);
      const name = accessTokenDecoded.name;
      const email = accessTokenDecoded.email;
      const nameInitial = name?.charAt(0) ?? "";
      setUserDetail({ name, email, nameInitial });
    }
  }, [session]);

  return (
    <div>
      <Navbar></Navbar>
      <Sidebar userDetail={userDetail} />
    </div>
  );
}
