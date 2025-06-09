"use client";

import { ROLE } from "@/constants/userConstants";
import { UserData } from "@/types/user/user";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";

interface UserContextType {
  isOpenDialog: boolean | false;
  isRegister: boolean | false;
  isOpenPopOver: boolean | false;
  userDetail: UserData | undefined;
  updateIsOpenDialog: (val: boolean) => void;
  updateIsRegister: (val: boolean) => void;
  updateIsOpenPopOver: (val: boolean) => void;
  isOrganizer: (val: string | undefined) => boolean;
  setUserDetail: (val: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("Context usage out of provider");
  }
  return ctx;
};

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<UserData>();

  const updateIsOpenDialog = (val: boolean) => {
    setIsOpenDialog(val);
  };

  const updateIsRegister = (val: boolean) => {
    setIsRegister(val);
  };

  const updateIsOpenPopOver = (val: boolean) => {
    setIsOpenPopOver(val);
  };

  const isOrganizer = (role: string | undefined) => {
    if (role?.split("_")[1] === ROLE.ORGANIZER) {
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        isOpenDialog,
        updateIsOpenDialog,
        isRegister,
        updateIsRegister,
        isOpenPopOver,
        updateIsOpenPopOver,
        isOrganizer,
        userDetail,
        setUserDetail
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
