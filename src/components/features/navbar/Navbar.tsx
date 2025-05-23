import AuthDialog from "@/app/components/AuthDialog";
import ProfilePopOver from "@/app/components/ProfilePopOver";
import { useUserContext } from "@/app/context/userContext";
import { Button } from "@/components/ui/button";
import { TokenClaims } from "@/types/auth/TokenPair";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const {
    isOpenDialog,
    updateIsOpenDialog,
    isRegister,
    updateIsRegister,
    isOpenPopOver,
    updateIsOpenPopOver,
  } = useUserContext();

  const { data: session } = useSession();
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    nameInitial: "",
  });

  console.log(session);

  useEffect(() => {
    if (session?.accessToken) {
      const accessTokenDecoded = jwtDecode<TokenClaims>(session.accessToken);
      const name = accessTokenDecoded.name;
      const email = accessTokenDecoded.email;
      const nameInitial = name?.charAt(0) ?? "";
      setUserDetail({ name, email, nameInitial });
    }
  }, [session]);

  const handleClickOpenDialog = (val: boolean) => {
    updateIsOpenDialog(true);
    updateIsRegister(val);
  };
  console.log(userDetail);
  return (
    <div className="flex justify-between py-3 border-b-2 px-[100px]">
      <Link href={"/"}>
        <Image
          height={40}
          width={40}
          src="/purwadhika.webp"
          alt="purwafest logo"
        />
      </Link>
      <div className="flex items-center gap-5">
        <Link href={"/organizer"} className="font-semibold mr-10 text-sm">
          Create Event
        </Link>

        {session ? (
          <ProfilePopOver
            open={isOpenPopOver}
            setOpenPopOver={updateIsOpenPopOver}
            userDetail={userDetail}
          ></ProfilePopOver>
        ) : (
          <>
            <Button onClick={() => handleClickOpenDialog(false)}>Login</Button>
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
    </div>
  );
};

export default Navbar;
