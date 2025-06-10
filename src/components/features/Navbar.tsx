"use client";

import AuthDialog from "@/app/components/AuthDialog";
import ProfilePopOver from "@/app/components/ProfilePopOver";
import { useUserContext } from "@/app/context/userContext";
import { getProfile } from "@/app/services/userService";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Navbar = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const {
    isOpenDialog,
    updateIsOpenDialog,
    isRegister,
    updateIsRegister,
    isOpenPopOver,
    updateIsOpenPopOver,
    isOrganizer,
  } = useUserContext();

  const { data: session } = useSession();
  const { userDetail,setUserDetail } = useUserContext();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    nameInitial: "",
    role: "",
  });

  const loginParam = searchParams.get("login");
  const pathname = usePathname();

  const updateUserDetail = useCallback(async () => {
    try {
      const userDetailResponse = await getProfile(session);
      setUserDetail(userDetailResponse.data);
    } catch (error) {
      console.error(error);
    }
  }, [session?.accessToken, setUserDetail]);

  useEffect(() => {
    if (session) {
      updateUserDetail();
    }
  }, [session?.accessToken, updateUserDetail]);

  useEffect(() => {
    if (session?.accessToken) {
      const name = userDetail?.name || "";
      const email = userDetail?.email || "";
      const nameInitial = name?.charAt(0) ?? "";
      const role = session.user.roles[0].split("_")[1];
      setUserDetails({ name, email, nameInitial, role });
    }
  }, [session?.accessToken]);

  const handleClickOpenDialog = useCallback(
    (val: boolean) => {
      updateIsOpenDialog(true);
      updateIsRegister(val);
    },
    [updateIsOpenDialog, updateIsRegister]
  );

  useEffect(() => {
    if (loginParam === "true") {
      handleClickOpenDialog(false);
    }
  }, [loginParam, handleClickOpenDialog]);

  return (
    <div className="flex justify-between py-3 border-b-2 px-[100px] z-99">
      <Link href={"/"}>
        <Image
          height={40}
          width={40}
          style={{ width: "100%", height: "auto" }}
          priority
          src="/purwadhika.webp"
          alt="purwafest logo"
        />
      </Link>
      {pathname !== "/create-event" ? (
        <div className="flex items-center gap-5">
          {isOrganizer(session?.user.roles[0]) || session === null ? (
            <Link
              href={"/create-event"}
              className="font-semibold mr-10 text-sm"
            >
              Create Event
            </Link>
          ) : null}

          {session ? (
            <ProfilePopOver
              open={isOpenPopOver}
              setOpenPopOver={updateIsOpenPopOver}
              userDetailSession={userDetails}
              session={session}
            ></ProfilePopOver>
          ) : (
            <>
              <Button onClick={() => handleClickOpenDialog(false)}>
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => handleClickOpenDialog(true)}
              >
                Register
              </Button>
              <AuthDialog
                open={isOpenDialog}
                setOpenDialog={updateIsOpenDialog}
                isButtonRegister={isRegister}
              ></AuthDialog>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
