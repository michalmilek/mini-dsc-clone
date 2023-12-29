import { format } from "date-fns";
import Link from "next/link";

import { getIconByType } from "@/app/utils/get-icon-by-type";
import { Channel } from "@prisma/client";

const MainPageChannel = ({ channel }: { channel: Channel }) => {
  return (
    <li
      className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2"
      key={channel.id + "mobile menu"}>
      <Link
        href={`/servers/${channel.serverId}/channels/${channel.serverId}`}
        className="w-full h-full">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0">{getIconByType(channel.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {channel.name}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {channel.type}
            </p>
          </div>
          <div className="hidden xs:inline-flex items-center text-base text-gray-900 dark:text-white">
            {format(new Date(channel.createdAt), "dd/MM/yyyy HH:mm")}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default MainPageChannel;
