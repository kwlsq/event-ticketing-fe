import ProfileUpdate from "../../components/ProfileUpdate";

export default function UserProfilePage() {
  return (
    <div className="flex flex-col">
      <div className="font-medium text-2xl sm:text-3xl md:text-4xl mb-8">
        Personal info
      </div>
      <ProfileUpdate />
    </div>
  );
}
