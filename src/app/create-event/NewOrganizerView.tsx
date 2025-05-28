import Navbar from "@/components/features/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "../context/userContext";
import AuthDialog from "../components/AuthDialog";

const NewOrganizerView = () => {
  const { updateIsOpenDialog, updateIsRegister, isOpenDialog, isRegister } =
    useUserContext();

  const handleClickOpenDialog = (val: boolean) => {
    updateIsOpenDialog(true);
    updateIsRegister(val);
  };

  return (
    <div>
      <Navbar />
      <div className="relative min-h-[calc(100vh-64px)] flex justify-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('/event.webp')` }}
        />

        <div className="relative z-10 flex flex-col items-center text-center text-white">
          <h1 className="text-2xl sm:text-6xl font-extrabold md:mt-20 mt-20 lg:mt-20">
            Create event with
          </h1>
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-extrabold text-accent opacity-80 mt-50 md:mt-40 lg:mt-20">
            Purwafest
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mt-50 md:mt-20 lg:mt-20">
            <Button
              variant="outline"
              className="font-bold w-full sm:w-auto text-black"
              onClick={() => handleClickOpenDialog(false)}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="font-bold w-full sm:w-auto text-black"
              onClick={() => handleClickOpenDialog(true)}
            >
              Register
            </Button>
            <AuthDialog
              open={isOpenDialog}
              setOpenDialog={updateIsOpenDialog}
              isButtonRegister={isRegister}
            ></AuthDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrganizerView;
