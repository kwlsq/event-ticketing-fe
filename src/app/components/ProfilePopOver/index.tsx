"use client";

import { usePointsContext } from "@/app/context/pointsContext";
import { logout } from "@/app/services/userService";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { TokenPair } from "@/types/auth/TokenPair";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  open: boolean;
  setOpenPopOver: (val: boolean) => void;
  userDetail: {
    nameInitial: string;
    name: string;
    email: string;
    role: string;
  };
  session: TokenPair;
}

const handleLogout = async (
  data: TokenPair,
  setOpenPopOver: (val: boolean) => void
) => {
  try {
    await logout(data);
    signOut();
    setOpenPopOver(false);
  } catch (error) {
    console.error(error);
  }
};

const ProfilePopOver: React.FC<Props> = ({
  open,
  setOpenPopOver,
  userDetail,
  session,
}) => {
  const { totalPoints } = usePointsContext();
  return (
    <Popover open={open} onOpenChange={setOpenPopOver}>
      <PopoverTrigger>
        <div
          className="bg-primary p-2 rounded-full w-10 h-10 text-center text-white cursor-pointer"
          onClick={() => setOpenPopOver(true)}
        >
          {userDetail.nameInitial}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="px-5 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-blue-800 text-white">
          <div
            className={`flex justify-between items-center ${
              userDetail.role === "user" ? `border-b-1` : ``
            } border-[#5499E3] pb-2`}
          >
            <div>
              <div className="font-bold text-sm">{userDetail.name}</div>
              <div className="text-xs">{userDetail.email}</div>
            </div>
            <Link
              href={`/dashboard/${userDetail.role}/profile`}
              className="cursor-pointer"
            >
              <Image
                src="/icon/chevron-right.svg"
                alt="arrow right icon"
                height={20}
                width={20}
              />
            </Link>
          </div>

          {userDetail.role === "user" ? (
            <div className="flex gap-2 items-center mt-2">
              <div>
                <Image
                  src="/icon/point.svg"
                  alt="point's icon"
                  height={20}
                  width={20}
                />
              </div>
              <div className="font-semibold">
                {totalPoints.toLocaleString("id-ID")} Points
              </div>
            </div>
          ) : null}
        </div>
        <Button
          variant="text"
          className="mt-5 p-0 text-destructive"
          onClick={() => handleLogout(session, setOpenPopOver)}
        >
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopOver;
