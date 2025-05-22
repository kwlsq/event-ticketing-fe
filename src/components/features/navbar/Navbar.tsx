import AuthDialog from "@/app/components/AuthDialog";
import { useUserContext } from "@/app/context/userContext";
import { Button } from "@/components/ui/button";
import { TokenClaims } from "@/types/auth/TokenPair";
import { jwtDecode } from "jwt-decode";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  let nameInitial;
  console.log(session);

  if (session?.accessToken) {
    const accessTokenDecoded = jwtDecode<TokenClaims>(session.accessToken);
    const name = accessTokenDecoded.name;
    nameInitial = name.charAt(0);
  }

  const handleClickOpenDialog = (val: boolean) => {
    updateIsOpenDialog(true);
    updateIsRegister(val);
  };
  const { isOpenDialog, updateIsOpenDialog, isRegister, updateIsRegister } =
    useUserContext();

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
          <div className="bg-primary p-2 rounded-full w-10 h-10 text-center text-white cursor-pointer">
            {nameInitial}
          </div>
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
