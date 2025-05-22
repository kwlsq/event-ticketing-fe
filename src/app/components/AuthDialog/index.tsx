"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LoginDialogContent from "./LoginDialogContent";
import RegisterDialogContent from "./RegisterDialogContent";

export default function AuthDialog() {
  const [isRegister, setIsRegister] = useState(false);

  const handleOpenDialog = (isRegister: boolean) => {
    setIsRegister(isRegister);
    console.log(isRegister);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => handleOpenDialog(false)}>Login</Button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <Button onClick={() => handleOpenDialog(true)}>Register</Button>
      </DialogTrigger>
      {isRegister ? (
        <RegisterDialogContent setIsRegister={setIsRegister}></RegisterDialogContent>
      ) : (
        <LoginDialogContent setIsRegister={setIsRegister}></LoginDialogContent>
      )}
    </Dialog>
  );
}
