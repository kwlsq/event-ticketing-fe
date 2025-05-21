import AuthDialog from "./components/AuthDialog"
import EventCard from './components/Event Card/index';
import DynamicPagination from './components/Dynamic Pagination';

const eventDetails = [
  {
    imageUrl: "https://res.cloudinary.com/ddk6cxc7c/image/upload/v1/purwafest_event/r7qqtw8d6rdieoxgyhmm",
    name: "Rock n Ride Music Festival",
    date: "May 5, 2025",
    time: 1900,
    venue: "Gelora Bung Karno Stadium",
    location: "Jakarta",
    startingPrice: 100000
  },
  {
    imageUrl: "https://res.cloudinary.com/ddk6cxc7c/image/upload/v1/purwafest_event/r7qqtw8d6rdieoxgyhmm",
    name: "Jazz in the Park",
    date: "June 12, 2025",
    time: 1800,
    venue: "Taman Mini Indonesia Indah",
    location: "Jakarta",
    startingPrice: 120000
  },
  {
    imageUrl: "https://res.cloudinary.com/ddk6cxc7c/image/upload/v1/purwafest_event/r7qqtw8d6rdieoxgyhmm",
    name: "IndoTech Expo 2025",
    date: "July 23, 2025",
    time: 1000,
    venue: "JCC Senayan",
    location: "Jakarta",
    startingPrice: 50000
  },
  {
    imageUrl: "https://res.cloudinary.com/ddk6cxc7c/image/upload/v1/purwafest_event/r7qqtw8d6rdieoxgyhmm",
    name: "Tech Innovations Summit",
    date: "August 15, 2025",
    time: 900,
    venue: "Grand Hyatt",
    location: "Jakarta",
    startingPrice: 150000
  }
];

export default function Home() {
  return (
    <div className="mx-[100px]">
      <AuthDialog/>
      <div className="flex flex-wrap gap-5">
        {eventDetails.map((event) => (
          <div key={event.name} className="w-[272px]">
            <EventCard
              {...event}
            />
          </div>
        ))}
      </div>
      <DynamicPagination/>
    </div>
  );
}
