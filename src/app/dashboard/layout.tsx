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
    role: "",
  });

  useEffect(() => {
    if (session?.accessToken) {
      const accessTokenDecoded = jwtDecode<TokenClaims>(session.accessToken);
      const name = accessTokenDecoded.name;
      const email = accessTokenDecoded.email;
      const nameInitial = name?.charAt(0) ?? "";
      const role = session.user.roles[0].split("_")[1];
      setUserDetail({ name, email, nameInitial, role });
    }
  }, [session]);

  return (
    <div className="flex gap-5 md:mx-[100px] my-4">
      <Sidebar userDetail={userDetail} />
      <main className="p-4 w-full h-auto">{children}</main>
    </div>
  );
}
