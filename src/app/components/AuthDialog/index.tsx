"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import LoginDialogContent from "./LoginDialogContent";
import RegisterDialogContent from "./RegisterDialogContent";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
  open: boolean;
  setOpenDialog: (val: boolean) => void;
  isButtonRegister: boolean;
}

const AuthDialog: React.FC<Props> = ({
  open,
  setOpenDialog,
  isButtonRegister,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isButtonRegister ? "Create account" : "Login"}
          </DialogTitle>
        </DialogHeader>
        {isButtonRegister ? (
          <RegisterDialogContent></RegisterDialogContent>
        ) : (
          <LoginDialogContent></LoginDialogContent>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
