import { format } from "date-fns";
import Image from "next/image";

import MainPageChannel from "@/components/main-page/main-page-channel";
import { Channel, Profile, Server } from "@prisma/client";

const MainPageServer = ({
  server,
}: {
  server: Server & { channels: Channel[] } & { profile: Profile };
}) => {
  return (
    <li
      className="p-2 flex flex-col gap-2"
      key={server.id + "mobile menu"}>
      <div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Image
              src={server.imageUrl}
              alt={server.name}
              fill
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-smfont-bold text-gray-900 truncate dark:text-white">
              {server.name}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              Created by: {server.profile.name}
            </p>
          </div>
          <div className="hidden xs:inline-flex items-center text-base text-gray-900 dark:text-white">
            Created: {format(new Date(server.createdAt), "dd/MM/yyyy HH:mm")}
          </div>
        </div>
      </div>
      {server.channels.length > 0 && (
        <ul className="w-full h-full p-3">
          {server.channels.map((channel) => (
            <MainPageChannel
              channel={channel}
              key={channel.id + "channel main page"}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MainPageServer;
