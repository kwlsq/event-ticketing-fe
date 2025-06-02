import { usePointsContext } from "@/app/context/pointsContext";
import Image from "next/image";

interface Props {
  userDetail: {
    nameInitial: string;
    name: string;
    email: string;
  };
}
const Sidebar: React.FC<Props> = ({ userDetail }) => {
  const { totalPoints } = usePointsContext();

  return (
    <div className="w-1/3">
      <div className="flex gap-3">
        <div className="bg-primary p-2 rounded-full w-10 h-10 text-center text-white cursor-pointer">
          {userDetail.nameInitial}
        </div>
        <div>
          <div className="font-bold text-sm">{userDetail.name}</div>
          <div className="text-xs">{userDetail.email}</div>
        </div>
      </div>
      <div className="flex gap-2 items-center mt-2 px-5 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-blue-800 text-white">
        <div>
          <Image
            src="/icon/point.svg"
            alt="point's icon"
            height={20}
            width={20}
          />
        </div>
        <div className="font-semibold">
          {totalPoints.toLocaleString("id-ID")} Points
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
