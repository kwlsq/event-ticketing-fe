"use client";

import { createContext, FC, ReactNode, useContext, useState } from "react";

interface UserContextType {
  isOpenDialog: boolean | false;
  isRegister: boolean | false;
  updateIsOpenDialog: (val: boolean) => void;
  updateIsRegister: (val: boolean) => void;
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

  const updateIsOpenDialog = (val: boolean) => {
    setIsOpenDialog(val);
  };

  const updateIsRegister = (val: boolean) => {
    setIsRegister(val);
  };

  return (
    <UserContext.Provider
      value={{ isOpenDialog, updateIsOpenDialog, isRegister, updateIsRegister }}
    >
      {children}
    </UserContext.Provider>
  );
};
