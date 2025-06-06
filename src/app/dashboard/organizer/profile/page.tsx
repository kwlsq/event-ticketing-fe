"use client";
import { useUserContext } from "@/app/context/userContext";
import { getProfile } from "@/app/services/userService";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";

export default function OrganizerProfilePage() {
  const { data: session } = useSession();
  const { userDetail, setUserDetail } = useUserContext();
  console.log(userDetail)
  const updateUserDetail = useCallback(async () => {
    try {
      const userDetailResponse = await getProfile(session);
      setUserDetail(userDetailResponse.data);
    } catch (error) {
      console.error(error);
    }
  }, [session, setUserDetail]);

  useEffect(() => {
    if (session) {
      updateUserDetail();
    }
  }, [session, updateUserDetail]);

  return <div>{userDetail?.email}</div>;
}
