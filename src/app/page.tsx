import { Button } from "@/components/ui/button";
import EventCard from './components/Event Card/index';
import DatePicker from './components/Date Picker/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const eventDetails = {
  imageUrl: "https://res.cloudinary.com/ddk6cxc7c/image/upload/v1/purwafest_event/r7qqtw8d6rdieoxgyhmm",
  name: "Rock n Ride Music Festival",
  date: "May 5, 2025",
  time: 1900,
  venue: "Gelora Bung Karno Stadium",
  location: "Jakarta",
  startingPrice: 100000
};

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
      <Button>Button</Button>
      <EventCard
        {...eventDetails}
      />
      <div>
        <DatePicker />
        <Button>Submit</Button>
      </div>
      <button>Register</button>
      <button>Register User</button>

    </div>
  );
}
