"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TokenClaims } from "@/types/auth/TokenPair";
import { useSession } from "next-auth/react";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    nameInitial: "",
  });

  console.log(session)

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
      <Sidebar userDetail={userDetail} />
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  );
}
