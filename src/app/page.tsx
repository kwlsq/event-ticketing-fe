import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Landing page
      <Dialog>
        <DialogTrigger asChild>
          <button>login</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when .
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              hi
          </div>
          <DialogFooter>
            exit
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <button>Register</button>
      <button>Register User</button>
    </div>
  );
}
