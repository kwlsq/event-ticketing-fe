import { usePointsContext } from "@/app/context/pointsContext";
import Image from "next/image";
import { sidebarUser } from "../consts/sidebarUser";
import { sidebarOrganizer } from "../consts/sidebarOrganizer";
import { ListMenuItem } from "@/types/dashboard/Dashboard";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface Props {
  userDetail: {
    nameInitial: string;
    name: string;
    email: string;
    role: string;
  };
}

const Sidebar: React.FC<Props> = ({ userDetail }) => {
  const { totalPoints } = usePointsContext();
  const pathname = usePathname();

  const [selectedMenu, setSelectedMenu] = useState<string>(
    pathname.split("/")[3] || "profile"
  );

  const sidebarMenus: Array<ListMenuItem> =
    userDetail.role === "user" ? sidebarUser : sidebarOrganizer;

  return (
    <div className="md:w-1/3 m-4">
      <div className="flex gap-3 mb-3">
        <div className="flex items-center justify-center bg-primary p-2 rounded-full w-12 h-12  text-white cursor-pointer">
          {userDetail.nameInitial}
        </div>
        <div>
          <div className="font-bold">{userDetail.name}</div>
          <div className="">{userDetail.email}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-8 items-center justify-between mt-2 px-5 py-3 rounded-md bg-linear-to-r from-blue-500 to-blue-800 text-white">
        <div className="flex gap-2">
          <Image
            src="/icon/point.svg"
            alt="point's icon"
            height={20}
            width={20}
          />
          <div className="font-medium">Total points</div>
        </div>
        <div className="font-medium">{totalPoints.toLocaleString("id-ID")}</div>
      </div>

      <div className="flex flex-col gap-5 ">
        {sidebarMenus.map((item, index) => {
          return (
            <Link
              href={`/dashboard/${userDetail.role}/${item.url}`}
              key={index}
              className={`flex gap-3 cursor-pointer font-medium px-5 py-3 rounded-md ${
                selectedMenu === item.url
                  ? `bg-sidebar-accent text-sidebar-accent-foreground`
                  : ``
              }`}
              onClick={() => setSelectedMenu(item.url)}
            >
              <item.icon />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
