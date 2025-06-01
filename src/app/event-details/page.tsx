"use client"

import { useEvents } from '../context/use-event';
import { useParams } from "next/navigation";

const EventDetailPage = () => {

  const {id} = useParams();

  const {selectedEvent} = useEvents();

  return (
    <div>
      <h1>{selectedEvent?.name}</h1>
      <p>{selectedEvent?.description}</p>
    </div>
  );
};

export default EventDetailPage;
