import ProfileUpdate from "../../components/ProfileUpdate";

export default function OrganizerProfilePage() {
  return (
    <div className="flex flex-col">
      <div className="font-medium text-2xl sm:text-3xl md:text-4xl mb-8">
        Organizer info
      </div>
      <ProfileUpdate />
    </div>
  );
}
